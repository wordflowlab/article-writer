#!/usr/bin/env bash
# 信息调研 - 基于 brief 进行资料搜集

set -e

SCRIPT_DIR=$(dirname "$0")
source "$SCRIPT_DIR/common.sh"

PROJECT_ROOT=$(get_project_root)
KNOWLEDGE_DIR="$PROJECT_ROOT/_knowledge_base"
BRIEF_FILE="$1"

# 如果没有指定 brief，使用最新的
if [ -z "$BRIEF_FILE" ]; then
    BRIEF_FILE=$(get_latest_brief)
fi

if [ -z "$BRIEF_FILE" ] || [ ! -f "$BRIEF_FILE" ]; then
    echo "❌ 错误: 未找到 brief 文件"
    echo "用法: research.sh [brief文件路径]"
    exit 1
fi

# 创建知识库目录
mkdir -p "$KNOWLEDGE_DIR"

# 生成调研文件名
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
RESEARCH_FILE="$KNOWLEDGE_DIR/research-$TIMESTAMP.md"

# 创建调研模板
cat > "$RESEARCH_FILE" << EOF
# 调研结果

**创建时间**: $(date '+%Y-%m-%d %H:%M:%S')
**关联 Brief**: $(basename "$BRIEF_FILE")

---

## 调研目标
<!-- 从 brief 中提取的调研需求 -->

## 搜索关键词
<!-- 列出搜索使用的关键词 -->

## 调研结果

### 数据与事实
<!-- 收集的数据、统计信息 -->

### 案例与示例
<!-- 相关案例、真实故事 -->

### 观点与分析
<!-- 专家观点、分析文章 -->

### 参考链接
<!-- 信息来源链接 -->

---

## 调研总结
<!-- 关键发现和结论 -->

EOF

echo "✅ 已创建调研文件: $RESEARCH_FILE"
echo "📝 Brief 来源: $BRIEF_FILE"
echo ""
echo "💡 接下来:"
echo "   1. AI 将基于 brief 进行网络搜索"
echo "   2. 整理调研结果到上述文件"
echo "   3. 为后续写作提供事实依据"
echo ""

# 输出文件路径供 AI 使用
output_json "{\"research_file\": \"$RESEARCH_FILE\", \"brief_file\": \"$BRIEF_FILE\"}"
