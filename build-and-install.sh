#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="${1:-/Users/thgmetzker/Documents/tharyck/.obsidian/plugins/mermaid-themes}"

cd "$SCRIPT_DIR"
npm run build

mkdir -p "$PLUGIN_DIR"
cp main.js styles.css manifest.json "$PLUGIN_DIR/"

printf 'Build instalado em: %s\n' "$PLUGIN_DIR"
