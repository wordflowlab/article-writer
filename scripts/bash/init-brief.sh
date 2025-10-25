#!/usr/bin/env bash
# 保存写作需求到 brief 文件

set -e

SCRIPT_DIR=$(dirname "$0")
source "$SCRIPT_DIR/common.sh"

PROJECT_ROOT=$(get_project_root)
BRIEFS_DIR="$PROJECT_ROOT/_briefs"
WORKSPACE_TYPE=$(get_active_workspace)

# 创建 briefs 目录
mkdir -p "$BRIEFS_DIR"

# 生成 brief 文件名（带时间戳）
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BRIEF_FILE="$BRIEFS_DIR/brief-$TIMESTAMP.md"

# 获取工作区特定的 brief 模板
TEMPLATE=""
case "$WORKSPACE_TYPE" in
    wechat)
        TEMPLATE="$PROJECT_ROOT/.specify/templates/brief-templates/wechat-brief-template.md"
        ;;
    video)
        TEMPLATE="$PROJECT_ROOT/.specify/templates/brief-templates/video-brief-template.md"
        ;;
    *)
        TEMPLATE="$PROJECT_ROOT/.specify/templates/brief-templates/general-brief-template.md"
        ;;
esac

# 复制模板或创建基本模板
if [ -f "$TEMPLATE" ]; then
    cp "$TEMPLATE" "$BRIEF_FILE"
    echo "✅ 已创建 brief 文件: $BRIEF_FILE"
    echo "📝 使用工作区模板: $WORKSPACE_TYPE"
else
    # 创建基本模板
    cat > "$BRIEF_FILE" << 'EOF'
# 写作需求 Brief

## 基本信息
- **创建时间**: $(date +%Y-%m-%d %H:%M:%S)
- **工作区类型**:
- **目标平台**:

## 写作目标
<!-- 描述你想写什么，为什么写，写给谁看 -->

## 核心信息
<!-- 你希望读者了解什么？获得什么？ -->

## 素材与参考
<!-- 相关链接、数据、案例等 -->

## 要求与限制
- **字数**:
- **风格**:
- **截止时间**:
- **其他要求**:

EOF
    echo "✅ 已创建 brief 文件: $BRIEF_FILE"
fi

# 输出文件路径供 AI 使用
output_json "{\"brief_file\": \"$BRIEF_FILE\", \"workspace\": \"$WORKSPACE_TYPE\"}"
