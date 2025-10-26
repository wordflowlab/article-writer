---
description: 生成配图建议(封面/插图/图表)
argument-hint: [项目路径]
allowed-tools: Read(//workspaces/**/draft.md), Write(//workspaces/**/images-plan.md)
scripts:
  sh: .specify/scripts/bash/images.sh
---

# 配图系统

## 功能说明

基于文章内容,**自动完成配图流程**:

### 阶段1: 配图需求分析 ⭐
- 分析 draft.md 确定配图位置
- 根据工作区要求确定配图数量
- 生成配图清单和优先级

### 阶段2: 图片获取 ⭐
- 优先级1: 搜索公共领域资源(Wikimedia/GitHub/官网)
- 优先级2: 提供AI生成prompt(可选)
- 优先级3: 推荐免费图库(Unsplash/Pexels)

### 阶段3: Markdown插入 ⭐
- 在draft.md中插入图片引用
- 添加图片说明和来源标注
- 生成images/README.md清单

**重要**: 这不只是"建议",而是**自动执行**完成配图

---

## 工作区配图要求

### 公众号工作区 (wechat)
- **配图数量**: 5-8 张 (**必须完成**)
- **尺寸要求**: 900×500px (封面), 720px宽度 (插图)
- **格式**: PNG/JPG
- **质量**: 清晰度 > 72dpi

### 视频工作区 (video)
- **配图数量**: 不需要 (脚本有分镜标注即可)
- 如需要,可提供分镜设计建议

### 通用工作区 (general)
- **配图数量**: 可选 (根据用户brief决定)
- **尺寸**: 根据发布平台调整

---

## 配图类型

### 1. 封面图(必需)

**建议格式:**
- 公众号: 900×500px 或 2:1 比例
- 知乎: 1200×675px 或 16:9 比例

**设计建议:**
```
封面图方案 A: 对比式
━━━━━━━━━━━━━━━━━━━
左侧: Claude Code logo/界面截图
中间: VS 文字
右侧: Cursor logo/界面截图
背景: 渐变色(蓝紫色系)
标题: "Claude Code vs Cursor: 真实场景对比"

生成工具建议: Canva, Figma, 或 Midjourney
```

### 2. 文章插图(建议3-5张)

**插图1: 测试场景示意图**
```
类型: 流程图/示意图
内容: 5个测试场景的icon展示
位置: 引言后
工具: draw.io, excalidraw
```

**插图2-4: 真实截图**
```
类型: 产品截图(带标注)
内容: Claude Code 和 Cursor 的实际使用界面
关键: 标注重点功能,添加箭头说明
工具: 截图 + Snagit/Skitch 标注
```

### 3. 数据图表(如有数据)

**图表1: 响应时间对比**
```
类型: 柱状图
数据:
- Claude Code: 2.8秒
- Cursor: 1.2秒
工具: Excel, Numbers, 或代码生成(Python matplotlib)
```

---

## 执行流程

### 步骤1: 读取draft.md和工作区配置

**AI操作**:
```
1. Read workspaces/*/articles/001-*/draft.md
2. Read memory/current-workspace.json  # 获取工作区类型
3. Read spec/presets/workspaces/*.md   # 获取配图要求
```

**输出**:
```
📋 项目信息:
- 文章: workspaces/wechat/articles/001-claude-code/draft.md
- 工作区: 公众号 (wechat)
- 配图要求: 5-8 张 (必须完成)
- 文章字数: 3200字
```

---

### 步骤2: 分析配图需求

**分析维度**:
1. **段落分析**: 每 500-800 字插入一张图
2. **内容类型**: 识别需要配图的内容(数据/对比/概念/截图)
3. **优先级**: P0(必须) > P1(建议) > P2(可选)

**输出示例**:
```
📸 配图需求分析 (共7张)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 配图1: 封面图 [P0 必须]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
位置: 文章开头
类型: 设计图
内容: Claude Code vs Cursor 对比主视觉
尺寸: 900×500px
来源: AI生成 或 Canva设计
文件名: 00-cover.png

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 配图2: 产品界面对比 [P0 必须]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
位置: 第1部分后 (约300字处)
类型: 产品截图
内容: Claude Code 和 Cursor 的主界面
建议: 截图 + 标注重点区域
文件名: 01-interface-comparison.png

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 配图3: 响应速度对比图表 [P1 建议]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
位置: 性能对比部分 (约900字处)
类型: 柱状图
数据: Claude Code 2.8s vs Cursor 1.2s
工具: Excel/Numbers 或 Python matplotlib
文件名: 02-performance-chart.png

[...其他配图...]
```

---

### 步骤3: 搜索公共资源 (优先)

**图片来源优先级**:
1. ⭐⭐⭐ **官方资源** (GitHub/官网) - 最优先
2. ⭐⭐ **公共领域** (Wikimedia Commons) - 免费无版权
3. ⭐ **免费图库** (Unsplash/Pexels) - 需标注来源

**AI操作示例**:
```
WebSearch: "Claude Code screenshot site:github.com OR site:anthropic.com"
WebSearch: "Cursor IDE interface site:cursor.sh OR site:github.com"
WebSearch: "programming interface comparison Wikimedia Commons"
```

**输出**:
```
🔍 公共资源搜索结果:

✅ 找到 Claude Code 官方截图:
- 来源: https://github.com/anthropics/claude-code
- 许可: MIT License (可使用)
- 建议: 下载后标注使用

✅ 找到 Cursor 官方素材:
- 来源: https://cursor.sh/press
- 许可: Press Kit (可使用)

⚠️  未找到现成的对比图表:
- 建议: 自己制作或AI生成
```

---

### 步骤4: 提供AI生成prompt (可选)

**如果公共资源不足,提供AI生成prompt**:

```
🎨 AI生成建议 (可选)

图片1: 封面图
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Midjourney Prompt:
"Split screen comparison, left side Claude AI interface with purple theme, right side Cursor IDE interface with blue theme, VS text in center, modern tech style, clean minimal design, 16:9 aspect ratio --ar 16:9 --v 6"

或 Stable Diffusion Prompt:
"software interface comparison, split screen design, modern UI, purple and blue color scheme, clean minimal style, high quality"

图片3: 性能图表
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Python代码生成:
```python
import matplotlib.pyplot as plt

tools = ['Claude Code', 'Cursor']
response_time = [2.8, 1.2]

plt.bar(tools, response_time, color=['#7C3AED', '#3B82F6'])
plt.ylabel('Response Time (seconds)')
plt.title('Performance Comparison')
plt.savefig('02-performance-chart.png', dpi=150)
```
```

---

### 步骤5: 插入 Markdown 引用

**AI操作**:
1. 创建 images/ 目录 (如不存在)
2. 在 draft.md 的合适位置插入图片引用
3. 添加图片说明和来源标注

**插入前 (draft.md)**:
```markdown
## 性能对比

测试显示,Claude Code的响应时间为2.8秒,而Cursor仅需1.2秒。

接下来我们看代码理解能力...
```

**插入后 (draft.md)**:
```markdown
## 性能对比

测试显示,Claude Code的响应时间为2.8秒,而Cursor仅需1.2秒。

![响应速度对比](images/02-performance-chart.png)
*图2: Claude Code vs Cursor 响应速度对比 (数据基于5个场景平均值)*

接下来我们看代码理解能力...
```

---

### 步骤6: 生成图片清单

**创建 images/README.md**:

```markdown
# 配图清单 - [项目名]

> 生成时间: 2025-10-26
> 总数: 7 张

## 图片列表

### 00-cover.png (封面图)
- **类型**: 设计图
- **尺寸**: 900×500px
- **来源**: AI生成 (Midjourney)
- **状态**: ⏳ 待制作

### 01-interface-comparison.png (界面对比)
- **类型**: 产品截图
- **尺寸**: 1200×800px
- **来源**: 官方 GitHub + 自己截图
- **状态**: ⏳ 待截图

### 02-performance-chart.png (性能图表)
- **类型**: 数据图表
- **尺寸**: 800×600px
- **来源**: Python matplotlib 生成
- **状态**: ⏳ 待生成

[...其他图片...]

---

## 制作优先级

- ✅ P0 (必须): 封面图, 界面对比 (2张)
- ⏳ P1 (建议): 性能图表, 功能对比表 (3张)
- ⏳ P2 (可选): 使用场景示意图, 决策树 (2张)

---

## 下一步行动

1. [ ] 使用AI生成封面图 (Midjourney/Stable Diffusion)
2. [ ] 截取产品界面 (需要安装Claude Code和Cursor)
3. [ ] 运行Python脚本生成图表
4. [ ] 将生成的图片放入 images/ 目录
5. [ ] 检查 draft.md 中的图片引用是否正确
```

---

## 输出格式

**保存文件**: `workspaces/*/articles/001-*/images-plan.md`

```markdown
# 配图方案 - [项目名]

## 封面图

**方案**: 对比式设计
**尺寸**: 900×500px (公众号) / 1200×675px (知乎)
**设计元素**:
- 左: Claude Code logo
- 右: Cursor logo
- 中: VS文字
- 背景: 渐变蓝紫
**文字**: "Claude Code vs Cursor: 5个真实场景深度对比"
**工具**: Canva模板 或 Midjourney生成

---

## 插图清单

### 插图1: 测试场景总览
**位置**: 引言后
**类型**: 示意图
**内容**: 5个场景icon (重构/开发/修复/审查/文档)
**工具**: draw.io

### 插图2: Claude Code 使用截图
**位置**: 场景1
**类型**: 产品截图+标注
**内容**: 展示代码理解能力
**要点**: 标注AI的理解提示

[...更多插图...]

---

## 图表清单

### 图表1: 响应时间对比
**位置**: 场景1后
**类型**: 柱状图
**数据**: Claude 2.8s vs Cursor 1.2s

---

## 制作优先级

- P0 (必须): 封面图
- P1 (建议): 插图2-4 (真实截图)
- P2 (可选): 图表1-2, 插图1

---

## 下一步

- [ ] 制作封面图
- [ ] 截取产品使用截图
- [ ] 生成数据图表(如有)
- [ ] 将图片放入 images/ 目录
- [ ] 在 draft.md 中标注图片位置
```

---

## 注意事项

1. **版权**: 使用自己截图,不要盗用他人图片
2. **清晰度**: 截图使用2x Retina分辨率
3. **标注**: 关键功能用箭头和文字标注
4. **一致性**: 配图风格保持统一

---

## 最终输出示例

```
✅ 配图系统执行完成

📋 执行总结:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 工作区: 公众号 (wechat)
- 配图要求: 5-8 张
- 实际生成: 7 张 (P0:2张, P1:3张, P2:2张)
- 文章字数: 3200字
- 平均间隔: 约450字/图

📄 生成的文件:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ workspaces/wechat/articles/001-*/images-plan.md    - 配图方案
✅ workspaces/wechat/articles/001-*/images/README.md  - 图片清单
✅ workspaces/wechat/articles/001-*/draft.md          - 已插入图片引用

📸 配图清单:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[P0] 00-cover.png              - 封面图 (900×500px)
[P0] 01-interface-comparison   - 界面对比 (截图)
[P1] 02-performance-chart      - 性能图表 (Python生成)
[P1] 03-feature-table          - 功能对比表
[P1] 04-code-demo              - 代码演示截图
[P2] 05-use-case-diagram       - 使用场景示意图
[P2] 06-decision-tree          - 选择决策树

🔍 图片来源:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 找到官方资源: 2 张 (Claude Code GitHub, Cursor Press Kit)
⏳ 需要AI生成: 1 张 (封面图 - Midjourney prompt已提供)
⏳ 需要自己制作: 4 张 (截图、图表、表格)

💡 下一步行动:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 使用提供的 Midjourney prompt 生成封面图
2. 按照 images-plan.md 截取产品界面
3. 运行提供的 Python 代码生成图表
4. 将图片保存到 images/ 目录
5. draft.md 中已自动插入图片引用 ✅
6. /final-check - 最终检查

⚠️  重要提醒:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 所有图片引用已插入 draft.md
- 图片文件名不要修改 (与Markdown引用对应)
- 确保图片尺寸符合要求 (公众号: 900×500px封面, 720px宽度插图)
- 版权合规: 使用官方素材、自己截图、或AI生成
```
