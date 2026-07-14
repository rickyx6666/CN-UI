#!/usr/bin/env bash
# 一键打开 Figma 文件 + 新页面导出直链（供 html.to.design 导入）
set -euo pipefail

FIGMA_FILE="https://www.figma.com/design/jIeAC4hhx3XtBmgNtfG2ms/CoinNova?node-id=0-1"
BASE="http://127.0.0.1:5173/figma/app"

open "$FIGMA_FILE"
open "http://127.0.0.1:5173/figma"
open "$BASE/records/deposit-detail"
open "$BASE/records/deposit-detail-pending"
open "$BASE/wallet/deposit-save-success"

printf '%s\n' \
  "$BASE/records/deposit-detail" \
  "$BASE/records/deposit-detail-pending" \
  "$BASE/wallet/deposit-save-success" | pbcopy

echo "已打开 Figma 与 4 个浏览器标签，3 条导入链接已复制到剪贴板。"
