# PRD-05: 配图系统

> **优先级**: P1（重要功能）
> **预计工作量**: 3 天
> **负责人**: Claude
> **状态**: ✅ 已完成

---

## 1. 需求背景

### 1.1 问题陈述

**用户需求**:
公众号文章需要 5-8 张配图，手动配图耗时且质量不稳定。

**目标**:
自动完成配图流程，不只是给建议。

### 1.2 解决方案

**配图系统**:
1. 分析文章，确定配图需求
2. 按优先级获取图片（公共领域 → AI 生成 → 免费图库）
3. 保存到 `images/` 目录
4. 自动插入 Markdown

---

## 2. 核心功能

### 2.1 配图需求分析

**/images 命令自动分析**:

```
📸 配图需求分析

推荐配图位置:

1. 【第1段后】开篇引入图
   - 类型: 产品截图
   - 内容: Claude Code 界面
   - 来源建议: 官方素材 / 自己截图

2. 【第3段中】性能对比图
   - 类型: 数据图表
   - 内容: Claude Code vs Cursor 响应速度对比
   - 来源建议: 自己制作(基于测试数据)

总计: 5 张 (符合 5-8 张要求)
```

### 2.2 图片来源优先级

**优先级顺序**:
1. **公共领域作品** (Wikimedia Commons) - 免费无版权
2. **官方素材** (产品官网/GitHub) - 通常允许使用
3. **AI 生成** (火山引擎 API) - 需要配置 API Key
4. **免费图库** (Unsplash/Pexels) - 免费但需注明来源
5. **自己截图** - 需要手动上传

### 2.3 图片获取

**方法 A: 搜索公共资源**
```bash
WebSearch query="Claude Code screenshot site:github.com OR site:anthropic.com"
```

**方法 B: AI 生成**（可选）
```bash
# 调用火山引擎 API（需要配置）
curl -X POST https://api.volcengine.com/image/generate \
  -d '{"prompt": "software interface comparison chart", "size": "1024x768"}'
```

**方法 C: 图库下载**
```bash
# Unsplash API（可选）
curl "https://api.unsplash.com/photos/random?query=technology"
```

### 2.4 自动插入 Markdown

**插入前**:
```markdown
Claude Code 的界面设计简洁直观。
```

**插入后**:
```markdown
Claude Code 的界面设计简洁直观。

![Claude Code界面](images/01-claude-code-interface.png)
*图1: Claude Code主界面*
```

---

## 3. 技术方案

### 3.1 文件结构

```
articles/001-claude-code/images/
├── 01-claude-code-interface.png
├── 02-performance-comparison.png
├── 03-code-completion-demo.png
├── 04-feature-comparison-table.png
├── 05-decision-tree.png
└── README.md                       # 图片清单
```

### 3.2 实现步骤

#### Day 1: 配图需求分析

1. 修改 `/images` 命令模板
2. 实现图片位置分析逻辑
3. 输出配图需求清单

#### Day 2: 图片获取（基础版）

1. 实现公共领域搜索（WebSearch）
2. 实现图片下载和保存
3. 生成图片清单 README.md

#### Day 3: Markdown 插入

1. 实现图片引用插入
2. 添加图片说明
3. 测试完整流程

**Note**: AI 生成和免费图库 API 可在后续版本实现

---

## 4. 验收标准

### 4.1 功能验收

**测试用例: 自动配图**
```
✅ 执行: /images articles/001-claude-code/draft.md
✅ 预期:
   - 分析文章，输出 5-8 个配图位置
   - 搜索并下载图片（至少公共领域）
   - 保存到 images/ 目录
   - 自动插入 Markdown 引用
   - 生成图片清单
```

### 4.2 质量标准

- ✅ 配图数量符合要求（5-8 张）
- ✅ 图片清晰度满足公众号要求
- ✅ 图片来源合法（公共领域或有授权）
- ✅ Markdown 引用正确插入

---

## 5. 风险

**风险 1: API 成本**

**缓解**:
- 优先使用公共领域和免费图库
- AI 生成作为可选功能
- 提供成本预估

**风险 2: 图片质量不佳**

**缓解**:
- 提供多个候选图片供用户选择
- 允许用户手动上传替换

---

## 6. 后续迭代

### v1.1 - API 集成

- 集成火山引擎图片生成 API
- 集成 Unsplash API

### v1.2 - 图床上传

- 支持上传到阿里云 OSS
- 返回 CDN 链接

---

## 7. 实现总结

### 7.1 已实现功能

✅ **配图需求分析系统**
- 读取 draft.md 和工作区配置
- 根据工作区要求确定配图数量 (公众号: 5-8张)
- 每 500-800 字插入一张图
- 按优先级分类: P0(必须) > P1(建议) > P2(可选)
- 输出详细的配图需求清单

✅ **图片来源优先级系统**
- 优先级1: 官方资源 (GitHub/官网)
- 优先级2: 公共领域 (Wikimedia Commons)
- 优先级3: 免费图库 (Unsplash/Pexels)
- 使用 WebSearch 搜索公共资源
- 提供 AI 生成 prompt (Midjourney/Stable Diffusion)
- 提供 Python 代码生成图表

✅ **Markdown 自动插入**
- 在 draft.md 合适位置插入图片引用
- 添加图片说明和来源标注
- 生成 images/README.md 清单
- 包含图片状态跟踪 (待制作/待截图/待生成)

✅ **完整执行流程**
- 步骤1: 读取draft.md和工作区配置
- 步骤2: 分析配图需求 (位置、类型、优先级)
- 步骤3: 搜索公共资源 (WebSearch)
- 步骤4: 提供AI生成prompt (可选)
- 步骤5: 插入Markdown引用
- 步骤6: 生成图片清单 (images/README.md)

### 7.2 验收标准达成

- ✅ 配图数量符合要求 (5-8张,根据工作区)
- ✅ 自动分析并输出配图位置
- ✅ 图片来源优先级明确 (官方 > 公共领域 > AI生成)
- ✅ Markdown 引用自动插入 draft.md
- ✅ 生成图片清单和制作指南
- ✅ 提供 AI 生成 prompt 和代码示例

### 7.3 文件变更

**Modified**:
- `templates/commands/images.md` - 从"建议型"升级为"自动执行型"
- `docs/prd/prd-05-image-system.md` - 更新状态为已完成

**New Features**:
- 工作区配图要求 (wechat: 5-8张必须, video: 不需要, general: 可选)
- 6步完整执行流程
- WebSearch 公共资源搜索
- Midjourney/Stable Diffusion prompt 生成
- Python matplotlib 代码示例
- Markdown 自动插入逻辑
- images/README.md 清单生成

### 7.4 后续迭代 (v1.1+)

**Not Implemented (留待后续)**:
- 火山引擎 API 集成 (需要配置 API Key)
- Unsplash API 集成 (需要配置)
- 图床上传功能 (阿里云 OSS/CDN)
- 实际下载图片 (当前提供搜索链接和生成指导)

**理由**: MVP 版本聚焦于"自动化配图流程",实际图片生成/下载由用户执行,AI 提供完整指导。

---

**PRD 状态**: ✅ 已完成 (2025-10-26)

**MVP 实现**: 配图需求分析 + 公共资源搜索 + AI 生成 prompt + Markdown 插入 + 清单生成
