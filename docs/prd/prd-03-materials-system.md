# PRD-03: 个人素材库系统

> **优先级**: P0（核心功能）
> **预计工作量**: 2 天
> **负责人**: TBD
> **状态**: 📝 待开发

---

## 1. 需求背景

### 1.1 问题陈述

**用户痛点**:
> "AI 经常编造数据。你想要它基于真实数据写，它却编造数据。"

**降 AI 味的核心方法**:
使用**真实的个人经历和素材**，而非 100% AI 生成。

### 1.2 解决方案

**个人素材库系统**:
- 导入社交媒体数据（即刻/微博/Twitter）
- 建立主题索引（AI 工具/编程经验/产品思考等）
- 搜索相关素材（关键词匹配）
- 改写融入文章（不是直接复制）

---

## 2. 核心功能

### 2.1 素材导入

**支持格式**:
- CSV（即刻/微博导出）
- JSON（Twitter Archive）
- Markdown（个人笔记）

**导入命令**:
```bash
content materials import ~/jike_export.csv --source jike
```

**存储位置**: `materials/raw/jike_export_2025-01.csv`

### 2.2 主题索引

**功能**: 将原始素材按主题分类

**索引结构**:
```
materials/indexed/
├── ai-tools.md          # AI 工具相关素材
├── programming.md       # 编程经验
├── product-thinking.md  # 产品思考
└── ...
```

**生成命令**:
```bash
content materials index ai-tools
```

### 2.3 素材搜索

**搜索方式**:

**方法 A: 直接搜索原始 CSV（推荐）**
```bash
/materials-search "Claude Code|Cursor"
```
AI 使用 Grep 工具在 CSV 中搜索关键词

**方法 B: 查看主题索引**
```bash
/materials-search --index ai-tools
```
AI 读取 `materials/indexed/ai-tools.md`

### 2.4 改写融入

**原则**:
- ❌ 禁止直接复制粘贴
- ✅ 改写成长文逻辑
- ✅ 保留真实细节
- ✅ 增加上下文说明

**示例**:

即刻动态（原始素材）:
```
Claude Code 又卡了，第三次了。Cursor 稳定多了。
```

改写融入文章:
```
我最近在测试 Claude Code，遇到了稳定性问题。
一周内卡顿了三次，每次都要重启。
相比之下，Cursor 几乎没有出现过这种情况。
```

---

## 3. 技术方案

### 3.1 文件结构

```
materials/
├── raw/                    # 原始导出文件
│   ├── jike_export_2025-01.csv
│   ├── weibo_export_2024-12.json
│   └── notes_2024.md
├── indexed/                # 主题索引
│   ├── ai-tools.md
│   ├── programming.md
│   └── index.json         # 索引元数据
└── archive/                # 归档的旧素材
```

### 3.2 实现步骤

#### Day 1: 素材导入功能

1. 创建 `content materials` 子命令
2. 实现 CSV/JSON/MD 解析
3. 存储到 `materials/raw/`
4. 数据验证和格式化

#### Day 2: 搜索和索引

1. 实现 `/materials-search` 命令
2. 集成 Grep 搜索
3. 实现主题索引生成
4. 添加改写融入指导

---

## 4. 验收标准

### 4.1 功能验收

**测试用例 1: 导入素材**
```
✅ 执行: content materials import ~/jike.csv --source jike
✅ 预期: 
   - CSV 保存到 materials/raw/
   - 数据格式验证通过
   - 显示导入统计（XX 条动态）
```

**测试用例 2: 搜索素材**
```
✅ 执行: /materials-search "Claude Code"
✅ 预期:
   - 搜索所有 raw/*.csv
   - 返回匹配的动态
   - 显示改写建议
```

**测试用例 3: 主题索引**
```
✅ 执行: content materials index ai-tools
✅ 预期:
   - 分析 raw/ 中的所有素材
   - 提取 AI 工具相关内容
   - 生成 indexed/ai-tools.md
```

### 4.2 质量标准

- ✅ 搜索准确率 > 70%
- ✅ 支持 CSV/JSON/MD 格式
- ✅ 禁止直接复制（命令中明确说明）
- ✅ 提供改写示例

---

## 5. 风险

**风险 1: 用户没有素材**

**缓解**: 
- 提供示例素材
- 提供导出教程（如何从即刻导出）

**风险 2: 搜索结果不相关**

**缓解**:
- 支持多关键词 OR 搜索
- 提供关键词建议
- 允许手动筛选

---

**PRD 状态**: 📝 待评审 → 待开发
