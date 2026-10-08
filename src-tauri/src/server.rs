use axum::{
    extract::{ws::{Message, WebSocket, WebSocketUpgrade}, DefaultBodyLimit, Path, Query, State},
    http::{header, HeaderValue, StatusCode},
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use base64::{engine::general_purpose::STANDARD as BASE64, Engine as _};
use mindzj_lib::kernel::{
    error::KernelError,
    types::{AppSettings, HotkeyBinding, SearchQuery, WorkspaceState},
    AppState,
};
use serde_json::{json, Value};
use std::{collections::{HashMap, HashSet}, net::SocketAddr, path::PathBuf, sync::{Arc, Mutex}, time::{Duration, Instant}};
use tower_http::services::ServeDir;
use uuid::Uuid;
use yrs::{updates::decoder::Decode, Doc, GetString, OffsetKind, Options, ReadTxn, StateVector, Text, Transact, Update};
use tokio::sync::broadcast;
use futures_util::{SinkExt, StreamExt};
use sha2::{Digest, Sha256};

const WEB_CLIENT: &str = "mindzj-web";

#[derive(Clone)]
struct ServerState {
    kernel: Arc<AppState>,
    edit_leases: Arc<Mutex<HashMap<String, EditLease>>>,
    collab_rooms: Arc<Mutex<HashMap<String, Arc<CollabRoom>>>>,
    active_collab_paths: Arc<Mutex<HashSet<String>>>,
}

struct CollabRoom {
    doc: Doc,
    updates: broadcast::Sender<Vec<u8>>,
    clients: std::sync::atomic::AtomicUsize,
    revision: std::sync::atomic::AtomicU64,
    state_path: PathBuf,
    persist_lock: tokio::sync::Mutex<()>,
}

struct EditLease {
    client_id: String,
    owner_name: String,
    token: String,
    expires_at: Instant,
}

const EDIT_LEASE_TTL: Duration = Duration::from_secs(45);

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

fn plugin_dir(vault_root: &std::path::Path, plugin_id: &str) -> Option<PathBuf> {
    if plugin_id.is_empty() || plugin_id.contains('/') || plugin_id.contains('\\') {
        return None;
    }
    let plugins_dir = vault_root.join(".mindzj").join("plugins");
    let exact = plugins_dir.join(plugin_id);
    if exact.is_dir() { return Some(exact); }
    for entry in std::fs::read_dir(plugins_dir).ok()?.flatten() {
        if !entry.file_type().map(|kind| kind.is_dir()).unwrap_or(false) { continue; }
        let manifest_path = entry.path().join("manifest.json");
        let Ok(bytes) = std::fs::read(manifest_path) else { continue; };
        let Ok(manifest) = serde_json::from_slice::<Value>(&bytes) else { continue; };
        if manifest.get("id").and_then(Value::as_str) == Some(plugin_id) {
            return Some(entry.path());
        }
    }
    None
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

fn edit_lock_key(state: &ServerState, relative_path: &str) -> Result<String, ApiError> {
    let ctx = context(state)?;
    Ok(format!("{}\0{}", ctx.vault.root().display(), relative_path.replace('\\', "/")))
}

fn verify_edit_lease<'a>(
    state: &'a ServerState,
    args: &Value,
    relative_path: &str,
) -> Result<Option<std::sync::MutexGuard<'a, HashMap<String, EditLease>>>, ApiError> {
    let extension = PathBuf::from(relative_path)
        .extension()
        .and_then(|value| value.to_str())
        .unwrap_or("")
        .to_ascii_lowercase();
    if !matches!(extension.as_str(), "md" | "markdown" | "mdx") {
        return Ok(None);
    }

    let key = edit_lock_key(state, relative_path)?;
    if state.active_collab_paths.lock().map_err(|_| ApiError::bad_request("Collaboration state unavailable"))?.contains(&key) {
        return Err(ApiError {
            status: StatusCode::LOCKED,
            code: "COLLABORATIVE_EDIT_ACTIVE",
            message: "This file is currently being edited in a collaborative session".into(),
        });
    }
    let client_id = optional_string(args, "clientId").unwrap_or_default();
    let token = optional_string(args, "editLockToken").unwrap_or_default();
    let mut leases = state.edit_leases.lock().map_err(|_| ApiError::bad_request("Edit lock state unavailable"))?;
    if leases.get(&key).is_some_and(|lease| lease.expires_at <= Instant::now()) {
        leases.remove(&key);
    }
    match leases.get(&key) {
        Some(lease) if lease.client_id == client_id && lease.token == token => Ok(Some(leases)),
        Some(lease) => Err(ApiError {
            status: StatusCode::LOCKED,
            code: "FILE_LOCKED",
            message: format!("This file is being edited by {}", lease.owner_name),
        }),
        None => Err(ApiError {
            status: StatusCode::LOCKED,
            code: "EDIT_LOCK_REQUIRED",
            message: "Acquire the edit lock before saving this file".into(),
        }),
    }
}

fn collab_state_path(ctx: &mindzj_lib::kernel::VaultContext, room_key: &str) -> PathBuf {
    let hash = hex::encode(Sha256::digest(room_key.as_bytes()));
    ctx.vault.root().join(".mindzj").join("collab").join(format!("{hash}.bin"))
}

fn atomic_write(path: &std::path::Path, bytes: &[u8]) -> Result<(), ApiError> {
    let parent = path.parent().ok_or_else(|| ApiError::bad_request("Invalid collaboration state path"))?;
    std::fs::create_dir_all(parent).map_err(|e| ApiError::bad_request(e.to_string()))?;
    let temporary = parent.join(format!(".collab-{}.tmp", Uuid::new_v4()));
    std::fs::write(&temporary, bytes).map_err(|e| ApiError::bad_request(e.to_string()))?;
    std::fs::rename(&temporary, path).map_err(|e| {
        let _ = std::fs::remove_file(&temporary);
        ApiError::bad_request(e.to_string())
    })
}

fn schedule_collab_flush(
    room: Arc<CollabRoom>,
    ctx: Arc<mindzj_lib::kernel::VaultContext>,
    relative_path: String,
    revision: u64,
) {
    tokio::spawn(async move {
        tokio::time::sleep(Duration::from_millis(350)).await;
        if room.revision.load(std::sync::atomic::Ordering::Acquire) != revision { return; }
        eprintln!("[collab] flushing revision {revision} for {relative_path}");
        let _persist_guard = room.persist_lock.lock().await;
        let (content, snapshot) = {
            if room.revision.load(std::sync::atomic::Ordering::Acquire) != revision { return; }
            eprintln!("[collab] capturing Yrs state for {relative_path}");
            let text = room.doc.get_or_insert_text("markdown");
            eprintln!("[collab] acquiring Yrs read transaction for {relative_path}");
            let txn = room.doc.transact();
            eprintln!("[collab] reading Yrs text for {relative_path}");
            let content = text.get_string(&txn);
            eprintln!("[collab] encoding Yrs snapshot for {relative_path}");
            let snapshot = txn.encode_state_as_update_v1(&StateVector::default());
            drop(txn);
            eprintln!("[collab] captured Yrs state for {relative_path}");
            (content, snapshot)
        };
        eprintln!("[collab] captured revision {revision} for {relative_path}");
        if atomic_write(&room.state_path, &snapshot).is_err() {
            eprintln!("[collab] snapshot write failed for {relative_path}");
            let _ = room.updates.send(vec![4]);
            return;
        }
        eprintln!("[collab] snapshot persisted for {relative_path}");
        if ctx.vault.write_file(&relative_path, &content).is_ok() {
            eprintln!("[collab] markdown persisted for {relative_path}");
            ctx.on_file_changed(&relative_path, &content);
            if room.revision.load(std::sync::atomic::Ordering::Acquire) == revision {
                let _ = room.updates.send(vec![3]);
            }
        } else {
            let _ = room.updates.send(vec![4]);
        }
    });
}

fn get_or_create_collab_room(
    state: &ServerState,
    relative_path: &str,
) -> Result<(String, Arc<CollabRoom>, Arc<mindzj_lib::kernel::VaultContext>), ApiError> {
    let ctx = context(state)?;
    let path = PathBuf::from(relative_path);
    let extension = path.extension().and_then(|e| e.to_str()).unwrap_or("").to_ascii_lowercase();
    if !matches!(extension.as_str(), "md" | "markdown" | "mdx") {
        return Err(ApiError::bad_request("Collaborative editing is available for Markdown files only"));
    }
    let contents = ctx.vault.read_file(relative_path).map_err(ApiError::from_kernel)?.content;
    let key = edit_lock_key(state, relative_path)?;
    if state.edit_leases.lock().map_err(|_| ApiError::bad_request("Edit lock state unavailable"))?.get(&key).is_some_and(|lease| lease.expires_at > Instant::now()) {
        return Err(ApiError {
            status: StatusCode::LOCKED,
            code: "EDIT_LOCK_ACTIVE",
            message: "This file is already open in the regular editor. Close edit mode before starting collaborative editing.".into(),
        });
    }
    let mut rooms = state.collab_rooms.lock().map_err(|_| ApiError::bad_request("Collaboration state unavailable"))?;
    if let Some(room) = rooms.get(&key) {
        room.clients.fetch_add(1, std::sync::atomic::Ordering::Relaxed);
        return Ok((key, room.clone(), ctx));
    }

    // Yjs indexes text in UTF-16 code units; use the same indexing for
    // Japanese and emoji offsets exchanged with CodeMirror.
    let doc = Doc::with_options(Options { offset_kind: OffsetKind::Utf16, ..Options::default() });
    let text = doc.get_or_insert_text("markdown");
    let state_path = collab_state_path(&ctx, &key);
    let restored_snapshot = std::fs::read(&state_path)
        .ok()
        .and_then(|snapshot| Update::decode_v1(&snapshot).ok())
        .is_some_and(|update| doc.transact_mut().apply_update(update).is_ok());
    if !restored_snapshot && !contents.is_empty() {
        text.insert(&mut doc.transact_mut(), 0, &contents);
    }
    let recovered = text.get_string(&doc.transact());
    if recovered != contents {
        // Preserve a file changed outside the collaboration session before
        // restoring the last durable collaborative state.
        let conflict_path = format!("{relative_path}.external-{}.md", chrono::Utc::now().format("%Y%m%d-%H%M%S"));
        if ctx.vault.write_file(&conflict_path, &contents).is_ok() {
            ctx.on_file_changed(&conflict_path, &contents);
        }
        let _ = ctx.vault.write_file(relative_path, &recovered);
        ctx.on_file_changed(relative_path, &recovered);
    }
    let (updates, _) = broadcast::channel(128);
    let room = Arc::new(CollabRoom {
        doc,
        updates,
        clients: std::sync::atomic::AtomicUsize::new(1),
        revision: std::sync::atomic::AtomicU64::new(0),
        state_path,
        persist_lock: tokio::sync::Mutex::new(()),
    });
    rooms.insert(key.clone(), room.clone());
    state.active_collab_paths.lock().map_err(|_| ApiError::bad_request("Collaboration state unavailable"))?.insert(key.clone());
    Ok((key, room, ctx))
}

async fn collab_socket(
    ws: WebSocketUpgrade,
    State(state): State<ServerState>,
    Path(relative_path): Path<String>,
) -> Result<impl IntoResponse, ApiError> {
    let relative_path = relative_path.replace('\\', "/");
    eprintln!("[collab] opening room for {relative_path}");
    let (key, room, ctx) = get_or_create_collab_room(&state, &relative_path)?;
    eprintln!("[collab] room ready for {relative_path}");
    Ok(ws.on_upgrade(move |socket| handle_collab_socket(socket, state, key, relative_path, room, ctx)))
}

fn remove_collab_client(state: &ServerState, key: &str, room: &Arc<CollabRoom>) {
    if let Ok(mut rooms) = state.collab_rooms.lock() {
        let previous = room.clients.fetch_sub(1, std::sync::atomic::Ordering::AcqRel);
        if previous <= 1 && rooms.get(key).is_some_and(|current| Arc::ptr_eq(current, room)) {
            rooms.remove(key);
            if let Ok(mut active) = state.active_collab_paths.lock() { active.remove(key); }
            let _ = std::fs::remove_file(&room.state_path);
        } else if previous > 1 {
            let mut presence = Vec::with_capacity(5);
            presence.push(2);
            presence.extend_from_slice(&((previous - 1) as u32).to_be_bytes());
            let _ = room.updates.send(presence);
        }
    }
}

async fn handle_collab_socket(
    socket: WebSocket,
    state: ServerState,
    key: String,
    relative_path: String,
    room: Arc<CollabRoom>,
    ctx: Arc<mindzj_lib::kernel::VaultContext>,
) {
    eprintln!("[collab] websocket upgraded for {relative_path}");
    let mut receiver = room.updates.subscribe();
    let snapshot = room.doc.transact().encode_state_as_update_v1(&StateVector::default());
    let mut initial = Vec::with_capacity(snapshot.len() + 1);
    initial.push(0);
    initial.extend(snapshot);
    let (mut sender, mut incoming) = socket.split();
    if sender.send(Message::Binary(initial.into())).await.is_err() {
        remove_collab_client(&state, &key, &room);
        return;
    }
    eprintln!("[collab] initial snapshot sent for {relative_path}");
    let mut presence = Vec::with_capacity(5);
    presence.push(2);
    presence.extend_from_slice(&(room.clients.load(std::sync::atomic::Ordering::Acquire) as u32).to_be_bytes());
    if sender.send(Message::Binary(presence.into())).await.is_err() {
        remove_collab_client(&state, &key, &room);
        return;
    }
    let _ = room.updates.send({
        let mut presence = Vec::with_capacity(5);
        presence.push(2);
        presence.extend_from_slice(&(room.clients.load(std::sync::atomic::Ordering::Acquire) as u32).to_be_bytes());
        presence
    });

    loop {
        tokio::select! {
            incoming_message = incoming.next() => match incoming_message {
                Some(Ok(Message::Binary(frame))) if frame.first() == Some(&1) => {
                    let update_bytes = frame[1..].to_vec();
                    eprintln!("[collab] update received ({} bytes) for {relative_path}", update_bytes.len());
                    let update = match Update::decode_v1(&update_bytes) {
                        Ok(update) => update,
                        Err(error) => {
                            eprintln!("[collab] update decode failed for {relative_path}: {error}");
                            continue;
                        }
                    };
                    let update_result = {
                        let mut txn = room.doc.transact_mut();
                        txn.apply_update(update)
                    };
                    if let Err(error) = update_result {
                        eprintln!("[collab] update apply failed for {relative_path}: {error}");
                        continue;
                    }
                    let revision = room.revision.fetch_add(1, std::sync::atomic::Ordering::AcqRel) + 1;
                    let mut outgoing = Vec::with_capacity(update_bytes.len() + 1);
                    outgoing.push(1);
                    outgoing.extend_from_slice(&update_bytes);
                    let _ = room.updates.send(outgoing);
                    eprintln!("[collab] update broadcast as revision {revision} for {relative_path}");

                    // Persist after a short quiet period, without holding up the
                    // websocket reader so subsequent keystrokes still sync at once.
                    schedule_collab_flush(room.clone(), ctx.clone(), relative_path.clone(), revision);
                }
                Some(Ok(Message::Close(frame))) => {
                    eprintln!("[collab] websocket closed for {relative_path}: {frame:?}");
                    break;
                }
                None => {
                    eprintln!("[collab] websocket stream ended for {relative_path}");
                    break;
                }
                Some(Err(error)) => {
                    eprintln!("[collab] websocket read failed for {relative_path}: {error}");
                    break;
                }
                _ => {}
            },
            update = receiver.recv() => match update {
                Ok(update) => if sender.send(Message::Binary(update.into())).await.is_err() { break; },
                Err(broadcast::error::RecvError::Lagged(_)) => {
                    let snapshot = room.doc.transact().encode_state_as_update_v1(&StateVector::default());
                    let mut frame = Vec::with_capacity(snapshot.len() + 1);
                    frame.push(0);
                    frame.extend(snapshot);
                    if sender.send(Message::Binary(frame.into())).await.is_err() { break; }
                }
                Err(broadcast::error::RecvError::Closed) => break,
            }
        }
    }
    remove_collab_client(&state, &key, &room);
}

async fn health() -> Json<Value> {
    Json(json!({ "status": "ok" }))
}

async fn list_vaults(Query(query): Query<std::collections::HashMap<String, String>>) -> Result<Json<Value>, ApiError> {
    let root = PathBuf::from(query.get("root").filter(|s| !s.trim().is_empty()).map(String::as_str).unwrap_or("Vaults"));
    if root == PathBuf::from("Vaults") {
        std::fs::create_dir_all(&root).map_err(|e| ApiError::bad_request(e.to_string()))?;
    }
    let root = root.canonicalize().map_err(|e| ApiError::bad_request(format!("Cannot open vaults folder: {e}")))?;
    if !root.is_dir() {
        return Err(ApiError::bad_request("Selected path is not a folder"));
    }
    let mut vaults = std::fs::read_dir(&root)
        .map_err(|e| ApiError::bad_request(e.to_string()))?
        .filter_map(Result::ok)
        .filter_map(|entry| {
            let file_type = entry.file_type().ok()?;
            if !file_type.is_dir() || file_type.is_symlink() {
                return None;
            }
            let path = entry.path();
            let name = entry.file_name().into_string().ok()?;
            Some(json!({ "name": name, "path": path.to_string_lossy() }))
        })
        .collect::<Vec<_>>();
    vaults.sort_by(|a, b| {
        a.get("name").and_then(Value::as_str).unwrap_or("")
            .to_lowercase()
            .cmp(&b.get("name").and_then(Value::as_str).unwrap_or("").to_lowercase())
    });
    Ok(Json(Value::Array(vaults)))
}

fn preview_assets_enabled(vault: &mindzj_lib::kernel::vault::Vault, relative_path: &str) -> bool {
    let path = PathBuf::from(relative_path);
    let mut directory = path.parent();
    loop {
        let marker = directory
            .filter(|dir| !dir.as_os_str().is_empty())
            .map(|dir| dir.join(".mindzj-preview.json"))
            .unwrap_or_else(|| PathBuf::from(".mindzj-preview.json"));
        let marker = marker.to_string_lossy().replace('\\', "/");
        if let Ok(file) = vault.read_file(&marker) {
            if let Some(enabled) = serde_json::from_str::<Value>(&file.content)
                .ok()
                .and_then(|config| config.get("allowCrossOriginAssets").and_then(Value::as_bool))
            {
                return enabled;
            }
        }
        let Some(current) = directory else { break };
        if current.as_os_str().is_empty() {
            break;
        }
        directory = current.parent();
    }
    false
}

async fn asset(
    State(state): State<ServerState>,
    Path(relative_path): Path<String>,
    Query(query): Query<HashMap<String, String>>,
) -> Result<impl IntoResponse, ApiError> {
    let ctx = context(&state)?;
    let mut bytes = ctx
        .vault
        .read_binary(&relative_path)
        .map_err(ApiError::from_kernel)?;
    let extension = PathBuf::from(&relative_path)
        .extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or("")
        .to_ascii_lowercase();
    let content_type = match extension.as_str() {
        "js" | "mjs" => "text/javascript; charset=utf-8",
        "wasm" => "application/wasm",
        "css" => "text/css; charset=utf-8",
        "json" => "application/json; charset=utf-8",
        "html" | "htm" => "text/html; charset=utf-8",
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
    // HTML previews run in an opaque-origin sandbox. A folder can opt in to
    // cross-origin subresource loading by containing .mindzj-preview.json.
    // The opt-in is scoped to files below that folder; command APIs are never
    // covered by this CORS rule.
    if preview_assets_enabled(&ctx.vault, &relative_path) {
        headers.insert(
            header::ACCESS_CONTROL_ALLOW_ORIGIN,
            HeaderValue::from_static("*"),
        );
    }
    if matches!(extension.as_str(), "html" | "htm") {
        // Keep vault HTML usable as a resource page while isolating its script
        // origin from the MindZJ app and its API, including when opened directly.
        headers.insert(
            header::CONTENT_SECURITY_POLICY,
            HeaderValue::from_static(
                "sandbox allow-scripts allow-forms allow-popups allow-downloads allow-modals; default-src * data: blob: 'unsafe-inline' 'unsafe-eval'",
            ),
        );

        if relative_path.eq_ignore_ascii_case("photocraft/index.html")
            && query.get("mindzj_photocraft_bridge").is_some_and(|v| v == "1")
        {
            const PHOTOCRAFT_DROP_BRIDGE: &str = r#"<script>
let mindzjPhotoCraftStarted = false;
let mindzjPhotoCraftReady = false;
let mindzjPhotoCraftPendingFile = null;
let mindzjPhotoCraftReadyObserver = null;

function mindzjDropPhotoCraftFile(file) {
  const canvas = document.getElementById("photocraft_canvas");
  if (!canvas || !file) return;
  const transfer = new DataTransfer();
  transfer.items.add(file);
  ["dragenter", "dragover", "drop"].forEach(function (type) {
    canvas.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: transfer }));
  });
}

window.addEventListener("TrunkApplicationStarted", function () {
  mindzjPhotoCraftStarted = true;
  mindzjPhotoCraftReadyObserver = new MutationObserver(function () {
    if (!mindzjPhotoCraftStarted || document.getElementById("photocraft_loading")) return;
    mindzjPhotoCraftReady = true;
    mindzjPhotoCraftReadyObserver.disconnect();
    if (mindzjPhotoCraftPendingFile) {
      mindzjDropPhotoCraftFile(mindzjPhotoCraftPendingFile);
      mindzjPhotoCraftPendingFile = null;
    }
  });
  mindzjPhotoCraftReadyObserver.observe(document.body, { childList: true, subtree: true });
  if (!document.getElementById("photocraft_loading")) {
    mindzjPhotoCraftReadyObserver.takeRecords();
    mindzjPhotoCraftReadyObserver.disconnect();
    mindzjPhotoCraftReady = true;
    if (mindzjPhotoCraftPendingFile) {
      mindzjDropPhotoCraftFile(mindzjPhotoCraftPendingFile);
      mindzjPhotoCraftPendingFile = null;
    }
  }
}, { once: true });

window.addEventListener("message", function (event) {
  const payload = event.data;
  if (event.source !== window.parent || !payload ||
      payload.type !== "mindzj:photocraft-open-image" || !(payload.file instanceof Blob)) return;
  try {
    const file = new File([payload.file], payload.fileName || "image", { type: payload.file.type || "application/octet-stream" });
    if (mindzjPhotoCraftReady) mindzjDropPhotoCraftFile(file);
    else mindzjPhotoCraftPendingFile = file;
  } catch (error) {
    console.error("MindZJ could not open this image in PhotoCraft:", error);
  }
});
</script>"#;
            let html = String::from_utf8_lossy(&bytes);
            let injected = if let Some((before, after)) = html.split_once("</body>") {
                format!("{before}{PHOTOCRAFT_DROP_BRIDGE}</body>{after}")
            } else {
                format!("{html}{PHOTOCRAFT_DROP_BRIDGE}")
            };
            bytes = injected.into_bytes();
        }
    }
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
        "acquire_edit_lock" => {
            let relative_path = string_arg(&args, "relativePath")?;
            let client_id = string_arg(&args, "clientId")?;
            let owner_name = optional_string(&args, "ownerName").unwrap_or_else(|| "MindZJ user".into());
            let force = args.get("force").and_then(Value::as_bool).unwrap_or(false);
            let key = edit_lock_key(&state, &relative_path)?;
            let collaboration_active = state.active_collab_paths.lock().map_err(|_| ApiError::bad_request("Collaboration state unavailable"))?.contains(&key);
            if collaboration_active {
                json!({ "acquired": false, "ownerName": "Collaborative editing session" })
            } else {
                let mut leases = state.edit_leases.lock().map_err(|_| ApiError::bad_request("Edit lock state unavailable"))?;
                if leases.get(&key).is_some_and(|lease| lease.expires_at <= Instant::now()) {
                    leases.remove(&key);
                }
                let existing = leases.get(&key).map(|lease| (
                    lease.client_id.clone(), lease.owner_name.clone(), lease.token.clone(), lease.expires_at,
                ));
                if let Some((current_client, current_name, current_token, expires_at)) = existing {
                    if current_client == client_id {
                        if let Some(lease) = leases.get_mut(&key) {
                            lease.expires_at = Instant::now() + EDIT_LEASE_TTL;
                        }
                        json!({ "acquired": true, "ownerName": current_name, "token": current_token, "expiresInSeconds": EDIT_LEASE_TTL.as_secs() })
                    } else if force {
                        let token = Uuid::new_v4().to_string();
                        leases.insert(key, EditLease { client_id, owner_name: owner_name.clone(), token: token.clone(), expires_at: Instant::now() + EDIT_LEASE_TTL });
                        json!({ "acquired": true, "ownerName": owner_name, "token": token, "expiresInSeconds": EDIT_LEASE_TTL.as_secs() })
                    } else {
                        json!({ "acquired": false, "ownerName": current_name, "expiresInSeconds": expires_at.saturating_duration_since(Instant::now()).as_secs() })
                    }
                } else {
                    let token = Uuid::new_v4().to_string();
                    leases.insert(key, EditLease { client_id, owner_name: owner_name.clone(), token: token.clone(), expires_at: Instant::now() + EDIT_LEASE_TTL });
                    json!({ "acquired": true, "ownerName": owner_name, "token": token, "expiresInSeconds": EDIT_LEASE_TTL.as_secs() })
                }
            }
        }
        "renew_edit_lock" => {
            let relative_path = string_arg(&args, "relativePath")?;
            let client_id = string_arg(&args, "clientId")?;
            let token = string_arg(&args, "token")?;
            let key = edit_lock_key(&state, &relative_path)?;
            let mut leases = state.edit_leases.lock().map_err(|_| ApiError::bad_request("Edit lock state unavailable"))?;
            if leases.get(&key).is_some_and(|lease| lease.expires_at <= Instant::now()) {
                leases.remove(&key);
            }
            match leases.get_mut(&key) {
                Some(lease) if lease.client_id == client_id && lease.token == token => {
                    lease.expires_at = Instant::now() + EDIT_LEASE_TTL;
                    json!({ "acquired": true, "expiresInSeconds": EDIT_LEASE_TTL.as_secs() })
                }
                _ => json!({ "acquired": false }),
            }
        }
        "release_edit_lock" => {
            let relative_path = string_arg(&args, "relativePath")?;
            let client_id = string_arg(&args, "clientId")?;
            let token = string_arg(&args, "token")?;
            let key = edit_lock_key(&state, &relative_path)?;
            let mut leases = state.edit_leases.lock().map_err(|_| ApiError::bad_request("Edit lock state unavailable"))?;
            if leases.get(&key).is_some_and(|lease| lease.client_id == client_id && lease.token == token) {
                leases.remove(&key);
            }
            Value::Null
        }
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
            let _edit_lease = verify_edit_lease(&state, &args, &path)?;
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
        "get_hotkeys" => serde_json::to_value(
            context(&state)?.load_hotkeys().map_err(ApiError::from_kernel)?,
        ).map_err(|e| ApiError::bad_request(e.to_string()))?,
        "save_hotkeys" => {
            let bindings: Vec<HotkeyBinding> = serde_json::from_value(
                args.get("bindings").cloned().ok_or_else(|| ApiError::bad_request("Missing bindings"))?,
            ).map_err(|e| ApiError::bad_request(e.to_string()))?;
            context(&state)?.save_hotkeys(&bindings).map_err(ApiError::from_kernel)?;
            Value::Null
        }
        "list_plugins" => {
            let ctx = context(&state)?;
            let root = ctx.vault.root();
            let plugins_dir = root.join(".mindzj").join("plugins");
            let enabled_path = root.join(".mindzj").join("plugins.json");
            let enabled: Vec<String> = std::fs::read_to_string(enabled_path)
                .ok().and_then(|text| serde_json::from_str(&text).ok()).unwrap_or_default();
            let mut plugins = Vec::new();
            if let Ok(entries) = std::fs::read_dir(&plugins_dir) {
                for entry in entries.flatten() {
                    let dir = entry.path();
                    if !dir.is_dir() { continue; }
                    let manifest_path = dir.join("manifest.json");
                    let Ok(bytes) = std::fs::read(manifest_path) else { continue; };
                    let Ok(manifest) = serde_json::from_slice::<Value>(&bytes) else { continue; };
                    let Some(id) = manifest.get("id").and_then(Value::as_str) else { continue; };
                    plugins.push(json!({
                        "manifest": manifest,
                        "enabled": enabled.iter().any(|entry| entry == id),
                        "has_styles": dir.join("styles.css").is_file(),
                        "dir_path": dir.to_string_lossy(),
                        "is_core": false
                    }));
                }
            }
            plugins.sort_by(|a: &Value, b: &Value| {
                a.pointer("/manifest/name").and_then(Value::as_str).unwrap_or("")
                    .cmp(b.pointer("/manifest/name").and_then(Value::as_str).unwrap_or(""))
            });
            Value::Array(plugins)
        }
        "read_plugin_main" | "read_plugin_styles" => {
            let id = string_arg(&args, "pluginId")?;
            let ctx = context(&state)?;
            let root = ctx.vault.root();
            let dir = plugin_dir(root, &id).ok_or_else(|| ApiError::bad_request("Plugin directory not found"))?;
            let file = if name == "read_plugin_main" { "main.js" } else { "styles.css" };
            match std::fs::read_to_string(dir.join(file)) {
                Ok(contents) => json!(contents),
                Err(error) if name == "read_plugin_styles" && error.kind() == std::io::ErrorKind::NotFound => json!(""),
                Err(error) => return Err(ApiError::bad_request(format!("Failed to read plugin {file}: {error}"))),
            }
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

    let state = ServerState {
        kernel,
        edit_leases: Arc::new(Mutex::new(HashMap::new())),
        collab_rooms: Arc::new(Mutex::new(HashMap::new())),
        active_collab_paths: Arc::new(Mutex::new(HashSet::new())),
    };
    let api = Router::new()
        .route("/health", get(health))
        .route("/vaults", get(list_vaults))
        .route("/assets/{*relative_path}", get(asset))
        .route("/collab/{*relative_path}", get(collab_socket))
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
