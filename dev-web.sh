#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$repo_root"

for tool in cargo npm; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    printf 'Required command not found: %s\n' "$tool" >&2
    exit 1
  fi
done

export MINDZJ_BIND="${MINDZJ_BIND:-0.0.0.0}"
export MINDZJ_PORT="${MINDZJ_PORT:-1430}"
export MINDZJ_API_TARGET="${MINDZJ_API_TARGET:-http://127.0.0.1:${MINDZJ_PORT}}"
vite_port="${VITE_PORT:-3000}"

cargo run -p mindzj --bin mindzj-server &
api_pid=$!
npm run dev -- --host 0.0.0.0 --port "$vite_port" --strictPort &
vite_pid=$!

cleanup() {
  trap - EXIT INT TERM
  kill "$api_pid" "$vite_pid" 2>/dev/null || true
  wait "$api_pid" "$vite_pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

printf '\nMindZJWeb development servers are starting.\n'
printf 'Open the app at: https://localhost:%s/\n' "$vite_port"
printf 'The HTTPS app is reachable at: https://<this-computer-ip>:%s/\n' "$vite_port"
printf 'The Rust API listens on: http://%s:%s\n' "$MINDZJ_BIND" "$MINDZJ_PORT"
printf 'For another device, use https://<this-computer-ip>:%s/ (accept the local dev certificate warning).\n' "$vite_port"
printf 'Press Ctrl+C to stop both servers.\n\n'

wait -n "$api_pid" "$vite_pid"
