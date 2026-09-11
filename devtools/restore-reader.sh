#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
cat destools/reader-app.tsx.b64.* | tr -d '\n' | base64 -d > src/components/reader-app.tsx
echo "Restored src/components/reader-app.tsx ($(wc -c < src/components/reader-app.tsx) bytes)"
