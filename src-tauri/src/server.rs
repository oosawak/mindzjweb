use axum::{
    extract::{DefaultBodyLimit, Path, State},
    http::{header, HeaderValue, StatusCode},
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use base64::{engine::general_purpose::STANDARD as BASE64, Engine as _};
use mindzj_lib::kernel::{
    error::KernelError,
    types::{AppSettings, SearchQuery, WorkspaceState},
    AppState,
};
use serde_json::{json, Value};
use std::{net::SocketAddr, path::PathBuf, sync::Arc};
use tower_http::services::ServeDir;

const WEB_CLIENT: &str = "mindzj-web";

#[derive(Clone)]
struct ServerState {
    kernel: Arc<AppState>,
}

#[derive(Debug)]
struct ApiError {
    status: StatusCode,
    code: &'static str,
    message: String,
}

impl ApiError {
    fn from_kernel(error: KernelError) -> Self {
        let code = match &error {
            KernelError::VaultNotFound(_) => "VAULT_NOT_FOUND",
            KernelError::FileNotFound(_) => "FILE_NOT_FOUND",
            KernelError::FileAlreadyExists(_) => "FILE_ALREADY_EXISTS",
            KernelError::PathTraversalDenied(_) => "PATH_TRAVERSAL_DENIED",
            KernelError::InvalidFileName(_) => "INVALID_FILE_NAME",
            _ => "KERNEL_ERROR",
        };
        Self {
            status: StatusCode::BAD_REQUEST,
            code,
            message: error.to_string(),
        }
    }

    fn bad_request(message: impl Into<String>) -> Self {
        Self {
            status: StatusCode::BAD_REQUEST,
            code: "INVALID_REQUEST",
            message: message.into(),
        }
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        (
            self.status,
            Json(json!({ "code": self.code, "message": self.message })),
        )
            .into_response()
    }
}

fn string_arg(args: &Value, key: &str) -> Result<String, ApiError> {
    args.get(key)
        .and_then(Value::as_str)
        .map(str::to_owned)
        .ok_or_else(|| ApiError::bad_request(format!("Missing string argument: {key}")))
}

fn optional_string(args: &Value, key: &str) -> Option<String> {
    args.get(key).and_then(Value::as_str).map(str::to_owned)
}

fn context(state: &ServerState) -> Result<Arc<mindzj_lib::kernel::VaultContext>, ApiError> {
    state
        .kernel
        .get_vault_context(WEB_CLIENT)
        .map_err(|e| ApiError {
            status: StatusCode::PRECONDITION_FAILED,
            code: "NO_VAULT",
            message: e.message,
        })
}

async fn health() -> Json<Value> {
    Json(json!({ "status": "ok" }))
}

async fn asset(
    State(state): State<ServerState>,
    Path(relative_path): Path<String>,
) -> Result<impl IntoResponse, ApiError> {
    let ctx = context(&state)?;
    let bytes = ctx
        .vault
        .read_binary(&relative_path)
        .map_err(ApiError::from_kernel)?;
    let content_type = match PathBuf::from(&relative_path)
        .extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or("")
        .to_ascii_lowercase()
        .as_str()
    {
        "png" => "image/png",
        "jpg" | "jpeg" => "image/jpeg",
        "gif" => "image/gif",
        "webp" => "image/webp",
        "svg" => "image/svg+xml",
        "avif" => "image/avif",
        "pdf" => "application/pdf",
        "mp3" => "audio/mpeg",
        "m4a" | "aac" => "audio/mp4",
        "wav" => "audio/wav",
        "ogg" => "audio/ogg",
        "opus" => "audio/opus",
        "flac" => "audio/flac",
        "mp4" | "m4v" => "video/mp4",
        "mov" => "video/quicktime",
        "webm" => "video/webm",
        "ogv" => "video/ogg",
        "glb" => "model/gltf-binary",
        "gltf" => "model/gltf+json",
        _ => "application/octet-stream",
    };
    let mut headers = axum::http::HeaderMap::new();
    headers.insert(header::CONTENT_TYPE, HeaderValue::from_static(content_type));
    headers.insert(
        header::CACHE_CONTROL,
        HeaderValue::from_static("private, max-age=300"),
    );
    Ok((headers, bytes))
}

async fn command(
    State(state): State<ServerState>,
    Path(name): Path<String>,
    Json(args): Json<Value>,
) -> Result<Json<Value>, ApiError> {
    let result = match name.as_str() {
        "open_vault" => {
            let path = PathBuf::from(string_arg(&args, "path")?);
            let name = string_arg(&args, "name")?;
            let (info, _) = state
                .kernel
                .open_vault(path, &name, WEB_CLIENT)
                .map_err(ApiError::from_kernel)?;
            serde_json::to_value(info).map_err(|e| ApiError::bad_request(e.to_string()))?
        }
        "get_vault_info" => match context(&state) {
            Ok(ctx) => serde_json::to_value(ctx.vault.info())
                .map_err(|e| ApiError::bad_request(e.to_string()))?,
            Err(_) => Value::Null,
        },
        "get_file_tree" => {
            let depth = args
                .get("maxDepth")
                .and_then(Value::as_u64)
                .unwrap_or(10)
                .min(32) as u32;
            serde_json::to_value(
                context(&state)?
                    .vault
                    .file_tree(depth)
                    .map_err(ApiError::from_kernel)?,
            )
            .map_err(|e| ApiError::bad_request(e.to_string()))?
        }
        "read_file" => {
            let path = string_arg(&args, "relativePath")?;
            serde_json::to_value(
                context(&state)?
                    .vault
                    .read_file(&path)
                    .map_err(ApiError::from_kernel)?,
            )
            .map_err(|e| ApiError::bad_request(e.to_string()))?
        }
        "write_file" => {
            let path = string_arg(&args, "relativePath")?;
            let content = string_arg(&args, "content")?;
            let ctx = context(&state)?;
            let file = ctx
                .vault
                .write_file(&path, &content)
                .map_err(ApiError::from_kernel)?;
            ctx.on_file_changed(&path, &content);
            serde_json::to_value(file).map_err(|e| ApiError::bad_request(e.to_string()))?
        }
        "write_binary_file" => {
            let path = string_arg(&args, "relativePath")?;
            let encoded = string_arg(&args, "base64Data")?;
            let data = BASE64
                .decode(encoded)
                .map_err(|e| ApiError::bad_request(format!("Invalid base64 data: {e}")))?;
            context(&state)?
                .vault
                .write_binary(&path, &data)
                .map_err(ApiError::from_kernel)?;
            Value::Null
        }
        "create_file" => {
            let path = string_arg(&args, "relativePath")?;
            let content = optional_string(&args, "content").unwrap_or_default();
            let ctx = context(&state)?;
            let file = ctx
                .vault
                .create_file(&path, &content)
                .map_err(ApiError::from_kernel)?;
            ctx.on_file_changed(&path, &content);
            serde_json::to_value(file).map_err(|e| ApiError::bad_request(e.to_string()))?
        }
        "delete_file" => {
            let path = string_arg(&args, "relativePath")?;
            let ctx = context(&state)?;
            ctx.vault
                .delete_file(&path)
                .map_err(ApiError::from_kernel)?;
            ctx.on_file_deleted(&path);
            Value::Null
        }
        "create_dir" => {
            let path = string_arg(&args, "relativePath")?;
            context(&state)?
                .vault
                .create_dir(&path)
                .map_err(ApiError::from_kernel)?;
            Value::Null
        }
        "delete_dir" => {
            let path = string_arg(&args, "relativePath")?;
            let recursive = args
                .get("recursive")
                .and_then(Value::as_bool)
                .unwrap_or(false);
            context(&state)?
                .vault
                .delete_dir(&path, recursive)
                .map_err(ApiError::from_kernel)?;
            Value::Null
        }
        "rename_file" => {
            let from = string_arg(&args, "from")?;
            let to = string_arg(&args, "to")?;
            let ctx = context(&state)?;
            ctx.vault
                .rename_file(&from, &to)
                .map_err(ApiError::from_kernel)?;
            ctx.on_file_deleted(&from);
            let content = ctx
                .vault
                .read_file(&to)
                .map(|f| f.content)
                .unwrap_or_default();
            ctx.on_file_changed(&to, &content);
            Value::Null
        }
        "search_vault" => {
            let query = SearchQuery {
                text: string_arg(&args, "query")?,
                limit: args
                    .get("limit")
                    .and_then(Value::as_u64)
                    .unwrap_or(20)
                    .min(500) as usize,
                extension_filter: optional_string(&args, "extensionFilter"),
                path_filter: optional_string(&args, "pathFilter"),
            };
            let ctx = context(&state)?;
            let index = ctx
                .search_index
                .lock()
                .map_err(|_| ApiError::bad_request("Search index unavailable"))?;
            serde_json::to_value(
                index
                    .search(&query)
                    .map_err(|e| ApiError::bad_request(e.to_string()))?,
            )
            .map_err(|e| ApiError::bad_request(e.to_string()))?
        }
        "get_backlinks" => {
            let path = string_arg(&args, "relativePath")?;
            let ctx = context(&state)?;
            let links = ctx
                .link_index
                .lock()
                .map_err(|_| ApiError::bad_request("Link index unavailable"))?;
            serde_json::to_value(links.get_backlinks(&path))
                .map_err(|e| ApiError::bad_request(e.to_string()))?
        }
        "get_forward_links" => {
            let path = string_arg(&args, "relativePath")?;
            let ctx = context(&state)?;
            let links = ctx
                .link_index
                .lock()
                .map_err(|_| ApiError::bad_request("Link index unavailable"))?;
            serde_json::to_value(links.get_forward_links(&path))
                .map_err(|e| ApiError::bad_request(e.to_string()))?
        }
        "get_graph_data" => {
            let ctx = context(&state)?;
            let links = ctx
                .link_index
                .lock()
                .map_err(|_| ApiError::bad_request("Link index unavailable"))?;
            serde_json::to_value(links.build_graph())
                .map_err(|e| ApiError::bad_request(e.to_string()))?
        }
        "get_unresolved_links" => {
            let ctx = context(&state)?;
            let links = ctx
                .link_index
                .lock()
                .map_err(|_| ApiError::bad_request("Link index unavailable"))?;
            serde_json::to_value(links.get_unresolved_links())
                .map_err(|e| ApiError::bad_request(e.to_string()))?
        }
        "get_settings" => {
            let ctx = context(&state)?;
            let settings = ctx
                .settings
                .read()
                .map_err(|_| ApiError::bad_request("Settings unavailable"))?;
            serde_json::to_value(&*settings).map_err(|e| ApiError::bad_request(e.to_string()))?
        }
        "update_settings" => {
            let settings: AppSettings = serde_json::from_value(
                args.get("settings")
                    .cloned()
                    .ok_or_else(|| ApiError::bad_request("Missing settings"))?,
            )
            .map_err(|e| ApiError::bad_request(e.to_string()))?;
            let ctx = context(&state)?;
            *ctx.settings
                .write()
                .map_err(|_| ApiError::bad_request("Settings unavailable"))? = settings;
            ctx.save_settings().map_err(ApiError::from_kernel)?;
            Value::Null
        }
        "load_workspace" => serde_json::to_value(
            context(&state)?
                .load_workspace()
                .map_err(ApiError::from_kernel)?,
        )
        .map_err(|e| ApiError::bad_request(e.to_string()))?,
        "save_workspace" => {
            let workspace: WorkspaceState = serde_json::from_value(
                args.get("workspace")
                    .cloned()
                    .ok_or_else(|| ApiError::bad_request("Missing workspace"))?,
            )
            .map_err(|e| ApiError::bad_request(e.to_string()))?;
            context(&state)?
                .save_workspace(&workspace)
                .map_err(ApiError::from_kernel)?;
            Value::Null
        }
        _ => {
            return Err(ApiError {
                status: StatusCode::NOT_FOUND,
                code: "UNKNOWN_COMMAND",
                message: format!("Unsupported web command: {name}"),
            })
        }
    };
    Ok(Json(result))
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let kernel = Arc::new(AppState::new());
    if let Ok(path) = std::env::var("MINDZJ_VAULT") {
        if !path.trim().is_empty() {
            let name = PathBuf::from(&path)
                .file_name()
                .and_then(|s| s.to_str())
                .unwrap_or("Vault")
                .to_owned();
            kernel.open_vault(PathBuf::from(path), &name, WEB_CLIENT)?;
        }
    }

    let state = ServerState { kernel };
    let api = Router::new()
        .route("/health", get(health))
        .route("/assets/{*relative_path}", get(asset))
        .route("/commands/{command}", post(command))
        .with_state(state);
    let app = Router::new()
        .nest("/api", api)
        .fallback_service(ServeDir::new("dist").append_index_html_on_directories(true))
        .layer(DefaultBodyLimit::max(64 * 1024 * 1024));

    let bind = std::env::var("MINDZJ_BIND").unwrap_or_else(|_| "127.0.0.1".into());
    let port = std::env::var("MINDZJ_PORT")
        .ok()
        .and_then(|v| v.parse::<u16>().ok())
        .unwrap_or(3000);
    let address: SocketAddr = format!("{bind}:{port}").parse()?;
    let listener = tokio::net::TcpListener::bind(address).await?;
    eprintln!("MindZJ web server listening on http://{address}");
    axum::serve(listener, app).await?;
    Ok(())
}
