# Slash Command 架构设计

## 核心架构

```
┌─────────────────────────────────────┐
│   Markdown 指令层                    │
│   - 检查标准（自然语言）              │
│   - 判断原则和示例                    │
│   - 工作流程描述                      │
│   - 引用bash脚本                     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   AI 执行层                          │
│   - 读取并理解markdown标准            │
│   - 根据上下文灵活判断                │
│   - 调用bash脚本处理文件              │
│   - 生成个性化反馈                    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Bash/PowerShell 脚本层             │
│   - 文件和目录管理                    │
│   - 工作区检测和创建                  │
│   - 字数统计（中文准确）              │
│   - 输出JSON供AI使用                 │
└─────────────────────────────────────┘
```

## 层次职责

### 1. Markdown指令层（模板）

**位置**：`templates/commands/*.md`

**职责**：
- 定义AI的角色和边界
- 用自然语言描述检查标准
- 说明工作流程（原则，非具体对话）
- 引用需要的bash脚本

**示例**（YAML frontmatter）：
```yaml
---
description: AI教练逐段引导写作(用户必须自己写)
argument-hint: [brief文件路径]
allowed-tools: Read(//workspaces/**/brief.md), Write(//workspaces/**/draft.md)
scripts:
  sh: scripts/bash/write.sh
---
```

**不应该包含**：
- ❌ "AI: ..."、"用户: ..."的对话脚本
- ❌ 硬编码的问题列表
- ❌ 预设的反馈文本

### 2. AI执行层

**职责**：
- 读取markdown指令
- 理解检查标准和原则
- 根据具体内容灵活判断
- 调用bash脚本处理文件操作
- 生成针对性的反馈

**不应该做**：
- ❌ 机械匹配关键词
- ❌ 照本宣科执行预设流程
- ❌ 直接操作文件系统（应通过bash脚本）

### 3. Bash/PowerShell脚本层

**位置**：
- `scripts/bash/*.sh`（Linux/Mac）
- `scripts/powershell/*.ps1`（Windows）

**职责**：
- 文件和目录操作
- 工作区管理
- 字数统计
- 输出JSON供AI读取

**核心脚本**：

**`common.sh`** - 通用函数库：
```bash
get_project_root()        # 获取项目根目录
get_current_workspace()   # 获取当前工作区
count_chinese_words()     # 准确的中文字数统计
output_json()             # 输出JSON
```

**`write.sh`** - 写作命令：
```bash
# 创建草稿文件
# 检测工作区类型
# 显示工作区规则
# 输出JSON供AI使用
```

**`collect.sh`** - 素材搜索：
```bash
# 检查素材库
# 统计素材数量
# 输出素材路径
```

**设计原则**：
- 纯工具函数，无业务逻辑
- 输出JSON格式供AI解析
- 跨平台兼容（bash/powershell）

## 命令执行流程

### 示例：`/write` 命令

**1. 用户执行**：
```bash
/write
```

**2. AI读取模板**：
- 读取 `templates/commands/write.md`
- 理解角色：写作教练
- 理解边界：forbidden（不能生成内容）
- 看到引用脚本：`scripts/bash/write.sh`

**3. AI调用bash脚本**：
```bash
bash scripts/bash/write.sh [brief文件路径]
```

**4. Bash脚本执行**：
- 检测工作区类型（wechat/video/general）
- 创建草稿文件
- 输出JSON：
```json
{
  "draft_file": "/path/to/draft.md",
  "brief_file": "/path/to/brief.md",
  "workspace": "wechat"
}
```

**5. AI解析JSON**：
- 知道草稿文件路径
- 知道工作区类型
- 根据工作区规则调整引导策略

**6. AI开始引导**：
- 根据markdown中的原则提问
- 等待用户写作
- 检查用户内容（根据markdown标准）
- 生成个性化反馈

## 为什么这样设计？

### 1. 利用bash脚本的优势

**Bash擅长**：
- 文件和目录操作
- 工作区检测
- 跨进程调用
- 输出格式化数据

**TypeScript不擅长**（在命令行环境）：
- 需要编译
- 依赖node_modules
- 跨平台兼容性问题

### 2. 避免重复实现

已有的bash脚本非常完善：
- 准确的中文字数统计（去除markdown标记）
- 工作区自动检测
- 编号目录管理
- JSON输出

不需要用TypeScript重新实现一遍。

### 3. 符合slash command理念

Slash command的本质：
- **配置化**：用YAML配置引用脚本
- **灵活性**：AI根据指令灵活执行
- **工具化**：调用外部工具处理具体任务

### 4. 可扩展性

添加新命令只需要：
1. 创建markdown模板（指令）
2. 创建bash脚本（工具）
3. 在YAML中引用

不需要写TypeScript代码。

## 实际案例

### 案例1：字数统计

**错误做法**（TypeScript重复实现）：
```typescript
// ❌ 重复实现，维护两套代码
export function countWords(text: string): number {
  // 复杂的中文分词逻辑...
  // 去除markdown标记...
  // ...
}
```

**正确做法**（使用bash脚本）：
```bash
# ✅ 复用已有脚本
bash scripts/bash/common.sh count_chinese_words draft.md
```

### 案例2：工作区检测

**错误做法**（TypeScript）：
```typescript
// ❌ 需要遍历目录树，处理边界情况
export function detectWorkspace() {
  // ...复杂逻辑
}
```

**正确做法**（使用bash脚本）：
```bash
# ✅ 一行命令
workspace=$(bash scripts/bash/common.sh get_active_workspace)
```

## Bash脚本规范

### 输出规范

所有脚本应该输出JSON供AI解析：

```bash
#!/usr/bin/env bash

# ... 执行逻辑 ...

# 最后输出JSON
output_json "{
  \"status\": \"success\",
  \"draft_file\": \"$DRAFT_FILE\",
  \"workspace\": \"$WORKSPACE_TYPE\"
}"
```

### 错误处理

```bash
if [ ! -f "$BRIEF_FILE" ]; then
    echo "❌ 错误: 未找到 brief 文件" >&2
    output_json "{\"status\": \"error\", \"message\": \"brief文件不存在\"}"
    exit 1
fi
```

### 提示信息

```bash
echo "✅ 已创建草稿文件: $DRAFT_FILE"
echo "📝 工作区: $WORKSPACE_TYPE"
echo ""
echo "💡 接下来:"
echo "   1. AI 将基于 brief、调研、素材撰写初稿"
```

AI可以读取这些提示，理解当前状态。

## 验收标准

一个正确的slash command系统应该：

- [ ] ✅ 所有命令模板都有YAML frontmatter
- [ ] ✅ YAML中正确引用bash脚本
- [ ] ✅ Markdown用自然语言描述标准，无对话脚本
- [ ] ✅ Bash脚本输出JSON供AI解析
- [ ] ✅ 无TypeScript工具函数重复实现
- [ ] ✅ AI根据markdown标准+bash输出灵活执行

## 总结

| 层次 | 技术 | 职责 | 不应该做 |
|---|---|---|---|
| **指令层** | Markdown | 定义标准和原则 | 硬编码对话 |
| **执行层** | AI | 理解+判断+调用工具 | 机械匹配 |
| **工具层** | Bash/PowerShell | 文件操作+输出JSON | 业务逻辑 |

**核心原则**：
> Markdown定义"做什么"（标准）  
> AI决定"怎么做"（灵活执行）  
> Bash执行"具体操作"（工具）

