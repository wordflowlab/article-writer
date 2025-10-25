#!/usr/bin/env bash
# 选题讨论 - 基于 brief 提供选题方向

set -e

SCRIPT_DIR=$(dirname "$0")
source "$SCRIPT_DIR/common.sh"

PROJECT_ROOT=$(get_project_root)
BRIEF_FILE="$1"

# 如果没有指定 brief，使用最新的
if [ -z "$BRIEF_FILE" ]; then
    BRIEF_FILE=$(get_latest_brief)
fi

if [ -z "$BRIEF_FILE" ] || [ ! -f "$BRIEF_FILE" ]; then
    echo "❌ 错误: 未找到 brief 文件"
    echo "用法: topic-discuss.sh [brief文件路径]"
    exit 1
fi

echo "✅ 使用 brief: $BRIEF_FILE"
echo ""
echo "📋 Brief 内容摘要:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 显示 brief 的前几行（去除 frontmatter）
sed -n '/^---$/,/^---$/!p' "$BRIEF_FILE" | head -20

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 提示: AI 将基于以上 brief 提供 3-4 个选题方向"
echo "   每个方向包含: 标题、角度、大纲、工作量评估"
echo ""

# 输出 brief 路径供 AI 使用
output_json "{\"brief_file\": \"$BRIEF_FILE\", \"status\": \"ready_for_discussion\"}"
