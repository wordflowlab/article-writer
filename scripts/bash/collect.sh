#!/usr/bin/env bash
# 素材搜索 - 从个人素材库中查找相关内容

set -e

SCRIPT_DIR=$(dirname "$0")
source "$SCRIPT_DIR/common.sh"

PROJECT_ROOT=$(get_project_root)
MATERIALS_DIR="$PROJECT_ROOT/materials"
INDEXED_DIR="$MATERIALS_DIR/indexed"
BRIEF_FILE="$1"

# 如果没有指定 brief，使用最新的
if [ -z "$BRIEF_FILE" ]; then
    BRIEF_FILE=$(get_latest_brief)
fi

if [ -z "$BRIEF_FILE" ] || [ ! -f "$BRIEF_FILE" ]; then
    echo "❌ 错误: 未找到 brief 文件"
    echo "用法: collect.sh [brief文件路径]"
    exit 1
fi

echo "✅ 使用 brief: $BRIEF_FILE"
echo ""

# 检查素材库是否存在
if [ ! -d "$MATERIALS_DIR" ]; then
    echo "⚠️  警告: 素材库目录不存在"
    echo "   请先使用 /import-materials 导入个人素材"
    echo ""
    output_json "{\"status\": \"no_materials\", \"brief_file\": \"$BRIEF_FILE\"}"
    exit 0
fi

# 统计素材数量
RAW_COUNT=0
INDEXED_COUNT=0

if [ -d "$MATERIALS_DIR/raw" ]; then
    RAW_COUNT=$(find "$MATERIALS_DIR/raw" -type f | wc -l | tr -d ' ')
fi

if [ -d "$INDEXED_DIR" ]; then
    INDEXED_COUNT=$(find "$INDEXED_DIR" -type f -name "*.md" | wc -l | tr -d ' ')
fi

echo "📁 素材库统计:"
echo "   原始素材: $RAW_COUNT 个文件"
echo "   已索引: $INDEXED_COUNT 个主题"
echo ""

if [ "$INDEXED_COUNT" -eq 0 ]; then
    echo "⚠️  素材库为空，AI 将基于 brief 内容进行创作"
else
    echo "✅ 素材库就绪，AI 将搜索相关内容并融入文章"
    echo ""
    echo "📋 可用主题索引:"
    if [ -d "$INDEXED_DIR" ]; then
        ls "$INDEXED_DIR" | head -10
    fi
fi

echo ""
echo "💡 提示:"
echo "   - AI 将搜索素材库中与 brief 相关的真实案例"
echo "   - 优先使用个人经历替代 AI 编造的案例"
echo "   - 这是降低 AI 味的关键步骤"
echo ""

# 输出信息供 AI 使用
output_json "{\"brief_file\": \"$BRIEF_FILE\", \"materials_dir\": \"$MATERIALS_DIR\", \"indexed_count\": $INDEXED_COUNT}"
