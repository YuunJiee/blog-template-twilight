#!/usr/bin/env bash
# =============================================================
#  dev.sh — 本地開發伺服器
#  用法：bash scripts/dev.sh
#       或先 chmod +x scripts/dev.sh 後直接 ./scripts/dev.sh
# =============================================================

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

# 偵測 port 3000 是否被占用
if lsof -iTCP:3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠  Port 3000 已被占用，使用 port 3001"
    PORT=3001
else
    PORT=3000
fi

echo "========================================"
echo "  Blog Dev Server"
echo "  http://localhost:${PORT}"
echo "  Ctrl+C 停止"
echo "========================================"
echo ""

PORT=$PORT npm run dev
