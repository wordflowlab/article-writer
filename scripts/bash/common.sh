#!/usr/bin/env bash
# 通用函数库 - Article Writer

# 获取项目根目录
get_project_root() {
    if [ -f ".content/config.json" ]; then
        pwd
    else
        # 向上查找包含 .content 的目录
        current=$(pwd)
        while [ "$current" != "/" ]; do
            if [ -f "$current/.content/config.json" ]; then
                echo "$current"
                return 0
            fi
            current=$(dirname "$current")
        done
        echo "错误: 未找到 article-writer 项目根目录" >&2
        exit 1
    fi
}

# 获取当前工作区目录
get_current_workspace() {
    PROJECT_ROOT=$(get_project_root)
    WORKSPACES_DIR="$PROJECT_ROOT/workspaces"

    # 找到最新的工作区目录
    if [ -d "$WORKSPACES_DIR" ]; then
        latest=$(ls -t "$WORKSPACES_DIR" 2>/dev/null | head -1)
        if [ -n "$latest" ]; then
            echo "$WORKSPACES_DIR/$latest"
        fi
    fi
}

# 获取活跃工作区名称（只返回名称，不返回路径）
get_active_workspace() {
    workspace_dir=$(get_current_workspace)
    if [ -n "$workspace_dir" ]; then
        basename "$workspace_dir"
    else
        # 如果没有工作区，返回默认名称
        echo "general"
    fi
}

# 创建带编号的目录
create_numbered_dir() {
    base_dir="$1"
    prefix="$2"

    mkdir -p "$base_dir"

    # 找到最高编号
    highest=0
    for dir in "$base_dir"/*; do
        [ -d "$dir" ] || continue
        dirname=$(basename "$dir")
        number=$(echo "$dirname" | grep -o '^[0-9]\+' || echo "0")
        number=$((10#$number))
        if [ "$number" -gt "$highest" ]; then
            highest=$number
        fi
    done

    # 返回下一个编号
    next=$((highest + 1))
    printf "%03d" "$next"
}

# 输出 JSON（用于与 AI 助手通信）
output_json() {
    echo "$1"
}

# 确保文件存在
ensure_file() {
    file="$1"
    template="$2"

    if [ ! -f "$file" ]; then
        if [ -f "$template" ]; then
            cp "$template" "$file"
        else
            touch "$file"
        fi
    fi
}

# 准确的中文字数统计
# 排除Markdown标记、空格、换行符，只统计实际内容
count_chinese_words() {
    local file="$1"

    if [ ! -f "$file" ]; then
        echo "0"
        return
    fi

    # 移除Markdown标记和格式符号，然后统计字符
    # 1. 移除代码块
    # 2. 移除标题标记 (#)
    # 3. 移除强调标记 (* 和 _)
    # 4. 移除链接标记 ([ ] ( ))
    # 5. 移除引用标记 (>)
    # 6. 移除列表标记 (- *)
    # 7. 移除空格、换行、制表符
    # 8. 统计剩余字符数
    local word_count=$(cat "$file" | \
        sed '/^```/,/^```/d' | \
        sed 's/^#\+[[:space:]]*//' | \
        sed 's/\*\*//g' | \
        sed 's/__//g' | \
        sed 's/\*//g' | \
        sed 's/_//g' | \
        sed 's/\[//g' | \
        sed 's/\]//g' | \
        sed 's/(http[^)]*)//g' | \
        sed 's/^>[[:space:]]*//' | \
        sed 's/^[[:space:]]*[-*][[:space:]]*//' | \
        sed 's/^[[:space:]]*[0-9]\+\.[[:space:]]*//' | \
        tr -d '[:space:]' | \
        tr -d '[:punct:]' | \
        grep -o . | \
        wc -l | \
        tr -d ' ')

    echo "$word_count"
}

# 显示友好的字数信息
# 参数: 文件路径, 最小字数(可选), 最大字数(可选)
show_word_count_info() {
    local file="$1"
    local min_words="${2:-0}"
    local max_words="${3:-999999}"
    local actual_words=$(count_chinese_words "$file")

    echo "字数：$actual_words"

    if [ "$min_words" -gt 0 ]; then
        if [ "$actual_words" -lt "$min_words" ]; then
            echo "⚠️ 未达到最低字数要求（最小：${min_words}）"
        elif [ "$actual_words" -gt "$max_words" ]; then
            echo "⚠️ 超过最大字数限制（最大：${max_words}）"
        else
            echo "✅ 符合字数要求（${min_words}-${max_words}）"
        fi
    fi
}

# 获取最新的 brief 文件
get_latest_brief() {
    PROJECT_ROOT=$(get_project_root)
    BRIEFS_DIR="$PROJECT_ROOT/_briefs"

    if [ -d "$BRIEFS_DIR" ]; then
        latest=$(ls -t "$BRIEFS_DIR"/*.md 2>/dev/null | head -1)
        echo "$latest"
    fi
}

# 获取最新的草稿文件
get_latest_draft() {
    workspace_dir=$(get_current_workspace)
    if [ -n "$workspace_dir" ]; then
        draft=$(find "$workspace_dir" -name "draft.md" -o -name "*-draft.md" | head -1)
        echo "$draft"
    fi
}
