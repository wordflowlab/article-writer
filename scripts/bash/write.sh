#!/usr/bin/env bash
# 撰写初稿 - 基于 brief、调研和素材创作文章

set -e

SCRIPT_DIR=$(dirname "$0")
source "$SCRIPT_DIR/common.sh"

PROJECT_ROOT=$(get_project_root)
WORKSPACE_DIR=$(get_current_workspace)
WORKSPACE_TYPE=$(get_active_workspace)
BRIEF_FILE="$1"

# 如果没有指定 brief，使用最新的
if [ -z "$BRIEF_FILE" ]; then
    BRIEF_FILE=$(get_latest_brief)
fi

if [ -z "$BRIEF_FILE" ] || [ ! -f "$BRIEF_FILE" ]; then
    echo "❌ 错误: 未找到 brief 文件"
    echo "用法: write.sh [brief文件路径]"
    exit 1
fi

# 确定工作区和文章目录
if [ -z "$WORKSPACE_DIR" ]; then
    WORKSPACE_DIR="$PROJECT_ROOT/workspaces/$WORKSPACE_TYPE"
    mkdir -p "$WORKSPACE_DIR"
fi

ARTICLES_DIR="$WORKSPACE_DIR/articles"
mkdir -p "$ARTICLES_DIR"

# 生成草稿文件名
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
ARTICLE_DIR="$ARTICLES_DIR/article-$TIMESTAMP"
mkdir -p "$ARTICLE_DIR"

DRAFT_FILE="$ARTICLE_DIR/draft.md"

# 创建草稿模板
cat > "$DRAFT_FILE" << EOF
# [标题待定]

**创建时间**: $(date '+%Y-%m-%d %H:%M:%S')
**工作区**: $WORKSPACE_TYPE
**关联 Brief**: $(basename "$BRIEF_FILE")

---

<!-- 在此撰写文章内容 -->

EOF

echo "✅ 已创建草稿文件: $DRAFT_FILE"
echo "📝 工作区: $WORKSPACE_TYPE"
echo "📋 Brief: $(basename "$BRIEF_FILE")"
echo ""

# 显示工作区特定提示
case "$WORKSPACE_TYPE" in
    wechat)
        echo "📱 公众号工作区规则:"
        echo "   - 段落控制在 150 字以内"
        echo "   - AI 味目标 < 30%"
        echo "   - 注意敏感词检测"
        ;;
    video)
        echo "🎥 视频工作区规则:"
        echo "   - 高度口语化 (AI 味 < 20%)"
        echo "   - 1分钟 ≈ 150-180 字"
        echo "   - 前 3 秒设计 Hook"
        ;;
    *)
        echo "📄 通用工作区:"
        echo "   - 灵活配置"
        echo "   - 可自定义规则"
        ;;
esac

echo ""
echo "💡 接下来:"
echo "   1. AI 将基于 brief、调研、素材撰写初稿"
echo "   2. 完成后使用 /audit 进行三遍审校"
echo ""

# 输出文件路径供 AI 使用
output_json "{\"draft_file\": \"$DRAFT_FILE\", \"brief_file\": \"$BRIEF_FILE\", \"workspace\": \"$WORKSPACE_TYPE\"}"
