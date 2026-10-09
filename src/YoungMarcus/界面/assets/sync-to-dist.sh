#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
SRC="$ROOT/src/YoungMarcus/界面/assets"
DST="$ROOT/dist/YoungMarcus/界面/assets"
mkdir -p "$DST"
cp -f "$SRC"/*.webp "$DST/" 2>/dev/null || true
echo "synced assets -> $DST"
ls -la "$DST"
