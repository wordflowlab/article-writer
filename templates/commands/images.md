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

### 步骤3: 搜索并下载公共资源 ⭐ 多重下载策略

**图片来源优先级**:
1. ⭐⭐⭐ **官方资源** (GitHub/官网) - 最优先,自动下载
2. ⭐⭐ **公共领域** (Wikimedia Commons) - 免费无版权,自动下载
3. ⭐ **免费图库** (Unsplash/Pexels) - 需标注来源,自动下载

**下载策略(多重 Fallback)**:
```
策略1: axios 直接下载 (默认,快速)
  ↓ 失败 (403/401/超时)
策略2: Playwright MCP 浏览器下载 (处理反爬虫)
  ↓ 失败 或 无 Playwright
策略3: AI 生成 SVG 替代图 (保证配图完整性)
```

**AI操作流程**:

#### 3.1 搜索图片URL
```
WebSearch: "Claude Code screenshot site:github.com OR site:anthropic.com"
WebSearch: "Cursor IDE interface site:cursor.sh OR site:github.com"
WebSearch: "programming comparison site:commons.wikimedia.org"
```

#### 3.2 提取真实图片链接
```
WebFetch: 提取的页面 URL
→ 找到 <img src="..."> 或 <a href="...jpg/png">
→ 获取原图链接(非缩略图)
```

#### 3.3 验证图片可访问性
```typescript
// 使用 image-downloader.ts 模块
import { getImageInfo } from '../utils/image-downloader.js';

const info = await getImageInfo(imageUrl);
if (info && info.size > 0) {
  // 可下载
}
```

#### 3.4 自动下载图片 (多重策略)

**策略1: axios 直接下载 (默认)**
```typescript
import { downloadImages } from '../utils/image-downloader.js';

const tasks = [
  {
    url: 'https://commons.wikimedia.org/...',
    savePath: 'workspaces/wechat/articles/001-*/images/01-interface.png'
  },
  // ... 更多
];

const results = await downloadImages(tasks, 5, true);
// 并发5个,显示进度
```

**策略2: Playwright MCP 浏览器下载 (处理反爬虫)**

如果 axios 下载失败(403/401),自动检测 Playwright MCP:

```typescript
// 检测 Playwright MCP 是否可用
const hasPlaywright = tools.some(t => t.name.startsWith('mcp__playwright__'));

if (hasPlaywright && result.needsPlaywright) {
  // 使用 Playwright 下载
  // 1. 导航到页面
  mcp__playwright__browser_navigate({ url: imageUrl });

  // 2. 等待图片加载
  mcp__playwright__browser_wait_for({ time: 2 });

  // 3. 截图保存
  mcp__playwright__browser_take_screenshot({
    element: "image element",
    ref: "img-ref-from-snapshot",
    filename: savePath,
    type: "png"
  });

  // 或者下载文件(如果是直接链接)
  // evaluate script 下载文件
}
```

**策略3: AI 生成 SVG 替代图 (终极 Fallback)**

如果下载和 Playwright 都失败,**根据上下文动态生成 SVG**:

**AI 操作流程**:

1. **分析图片上下文**
   - 读取 draft.md 中图片所在段落
   - 理解这张图片要表达什么内容
   - 提取关键信息(标题、对比项、数据等)

2. **设计 SVG 内容**
   - 根据内容类型选择合适的可视化方式
   - 界面对比 → 分屏对比图
   - 数据对比 → 柱状图/折线图
   - 流程说明 → 流程图/示意图
   - 架构图 → 方框图/连线图

3. **生成 SVG 代码** (AI 动态生成)

   **AI 执行步骤**:

   a) **从 draft.md 读取图片所在段落**
      ```
      示例段落内容:
      "测试显示,Claude Code 的响应时间为 2.8秒,而 Cursor 仅需 1.2秒。
       在代码补全场景下,Cursor 的速度优势更加明显。"
      ```

   b) **AI 分析并提取关键信息**
      - 识别类型: "响应时间" + 数字 → 性能对比图(柱状图)
      - 提取数据: Claude Code=2.8秒, Cursor=1.2秒
      - 提取主体: 两个产品名称
      - 推断品牌色: Claude(紫色系), Cursor(蓝色系)

   c) **AI 自主决定 SVG 结构**
      - 选择图表类型: 柱状图(因为是性能对比)
      - 计算尺寸: 根据数值范围自动计算柱高
      - 设计布局: 左右对比或上下对比
      - 添加标注: 数值、单位、标题

   d) **AI 生成完整 SVG 代码**
      - 使用 XML/SVG 语法
      - 包含: 标题、图表主体、图例、数据标注
      - 添加底部说明: "AI生成可视化"
      - 保持简洁美观,符合文章风格

   e) **使用 Write 工具保存**
      ```typescript
      // AI 自己决定如何生成 SVG 内容
      // 不使用固定模板,完全基于上下文
      Write('images/02-performance-comparison.svg', svgContent);
      ```

   **重要原则**:
   - ❌ 不使用固定的 SVG 模板
   - ✅ 每次都根据实际内容重新设计
   - ✅ 提取的数据决定图表样式和尺寸
   - ✅ 保持与文章内容的一致性

4. **更新 Markdown 引用**
   ```markdown
   ![响应时间对比](images/02-performance-comparison.svg)
   *图2: Claude Code vs Cursor 响应时间对比 (AI 生成可视化)*
   ```

**SVG 生成决策指南** (AI 如何选择):

AI 需要根据 draft.md 的上下文,自主决定生成什么类型的 SVG:

| 上下文特征 | 推荐 SVG 类型 | AI 应该提取的信息 | 生成要点 |
|----------|------------|----------------|---------|
| 出现"A vs B"、"对比"、"相比" | 分屏对比图 | 两个主体名称、各自特点 | 左右或上下布局,使用不同颜色区分 |
| 包含具体数字(如"2.8秒"、"30%") | 柱状图/折线图 | 数值、单位、对比项 | 根据数值范围自动计算柱高/折线点 |
| 出现"步骤"、"流程"、"然后"、"接着" | 流程图/步骤图 | 步骤顺序、每步说明 | 箭头连接,编号标识,垂直或水平布局 |
| 出现"架构"、"组成"、"模块"、"层次" | 方框连线图 | 模块名称、层级关系 | 矩形框+连接线,体现层次或关系 |
| 列举多个"功能"、"特性"、有✓/✗标记 | 特性对比表格 | 功能名称、是否支持 | 表格形式,√/×符号,清晰对齐 |
| 出现"如果...那么"、"选择"、"判断" | 决策树/流程图 | 判断条件、分支结果 | 菱形(判断)+矩形(结果),箭头连接 |

**AI 生成原则**:

1. **读取上下文**
   - Read draft.md,定位到需要配图的段落
   - 阅读前后 200-300 字的内容
   - 理解这段内容的核心要表达什么

2. **智能提取信息**
   ```
   示例段落:
   "经过测试,Claude Code 在代码理解方面得分 85 分,而 Cursor 为 78 分。
    但在响应速度上,Cursor 以 1.2 秒的成绩领先于 Claude 的 2.8 秒。"

   AI 应该提取:
   - 对比项: 代码理解(Claude:85, Cursor:78)、响应速度(Claude:2.8s, Cursor:1.2s)
   - 图表类型: 多维度对比 → 雷达图 或 分组柱状图
   - 品牌色: Claude(紫色#7C3AED), Cursor(蓝色#3B82F6)
   - 标题: "Claude Code vs Cursor 性能对比"
   ```

3. **自主设计可视化**
   - 根据数据数量选择合适的图表
   - 2-3个数据点 → 柱状图
   - 4-6个维度 → 雷达图
   - 时间序列 → 折线图
   - 层级关系 → 树状图/组织图

4. **动态生成 SVG**
   - 不使用固定模板,每次重新计算布局
   - 数值决定图形尺寸(如柱高 = 数值 × 比例系数)
   - 自动调整文字位置避免重叠
   - 添加合适的图例和标注

5. **保持一致性**
   - 从文章中识别品牌色(如提到的产品logo颜色)
   - 字体风格与文章整体一致
   - 尺寸符合工作区要求(如公众号 720px 宽)

**AI 生成 SVG 的优势**:
- ✅ 100% 成功率 (无需外部资源)
- ✅ 矢量图,任意缩放,体积小 (< 10KB)
- ✅ 保持文章配图完整性
- ✅ **根据上下文动态生成**,内容精准匹配
- ✅ 可后续替换为真实截图/设计图
- ⚠️ 仅作为 fallback,优先使用真实图片

**重要**:
- SVG 内容完全基于 draft.md 上下文生成
- 不使用固定模板,每张图都是定制的
- 标注 "AI生成可视化" 以区分真实截图

**输出示例** (展示多重策略):
```
🔍 公共资源搜索与下载:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

搜索结果 (5张):
✅ Claude Code 官方截图
   来源: https://github.com/anthropics/claude-code/raw/main/screenshot.png
   许可: MIT License ✓

✅ Cursor 界面图
   来源: https://cursor.sh/assets/interface.png
   许可: Press Kit (可使用) ✓

⚠️  对比示意图 (受保护)
   来源: https://example.com/protected-image.png
   状态: 403 Forbidden → 将使用 Playwright 重试

✅ 性能图表
   来源: 自己生成 (Python matplotlib)

❌ 功能对比表 (无公共资源)
   状态: 未找到 → 将生成 SVG 占位图

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
下载进度:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[策略1: axios 直接下载]
  [✓] 01-claude-interface.png (245KB) - 成功
  [✓] 02-cursor-interface.png (198KB) - 成功
  [✗] 03-comparison.png (403 Forbidden) - 失败
  [✓] 04-performance-chart.png (157KB) - 成功

[策略2: Playwright MCP 浏览器下载]
  ✓ Playwright MCP 已检测
  [✓] 03-comparison.png (189KB) - 成功 (Playwright)

[策略3: AI 生成 SVG 占位图]
  [✓] 05-feature-table.svg (8KB) - 已生成
     类型: 功能对比表 (AI生成占位图)
     尺寸: 800×600px
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 下载完成: 5/5 成功
   - axios 直接下载: 3张
   - Playwright 下载: 1张
   - SVG 占位图: 1张
📁 保存位置: workspaces/wechat/articles/001-*/images/

💡 提示:
  - 1张图片使用了 Playwright MCP (处理反爬虫)
  - 1张图片生成了 SVG 占位图 (可后续替换真实截图)
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

### 步骤5: 验证下载并插入 Markdown 引用 ⭐ 智能插入

**AI操作**:
1. ✅ 检查下载结果 - 只为成功下载的图片插入引用
2. ✅ 在 draft.md 的合适位置插入图片引用
3. ✅ 添加图片说明和来源标注
4. ⚠️ 失败的图片标注 `<!-- 待补充: ... -->`

**插入逻辑**:
```typescript
import { DownloadResult } from '../utils/image-downloader.js';

// 只插入成功下载的图片
const successfulImages = results.filter(r => r.success);

for (const img of successfulImages) {
  const relativePath = `images/${path.basename(img.savePath)}`;
  const markdown = `\n\n![图片说明](${relativePath})\n*来源: ${img.url}*\n`;

  // 在适当位置插入 draft.md
  // ...
}

// 失败的图片添加占位符注释
const failedImages = results.filter(r => !r.success);
for (const img of failedImages) {
  const comment = `\n<!-- ⚠️ 图片待补充: ${path.basename(img.savePath)} -->\n<!-- 原因: ${img.error} -->\n<!-- 请手动下载: ${img.url} -->\n`;
  // ...
}
```

**插入前 (draft.md)**:
```markdown
## 性能对比

测试显示,Claude Code的响应时间为2.8秒,而Cursor仅需1.2秒。

接下来我们看代码理解能力...
```

**插入后 (draft.md) - 成功下载**:
```markdown
## 性能对比

测试显示,Claude Code的响应时间为2.8秒,而Cursor仅需1.2秒。

![响应速度对比](images/02-performance-chart.png)
*图2: Claude Code vs Cursor 响应速度对比 (数据基于实测)*
*来源: 自己生成 (Python matplotlib)*

接下来我们看代码理解能力...
```

**插入后 (draft.md) - 下载失败**:
```markdown
## 产品界面

两款产品的界面设计各有特色。

<!-- ⚠️ 图片待补充: 03-interface-comparison.png -->
<!-- 原因: 403 Forbidden -->
<!-- 请手动下载: https://example.com/screenshot.png -->
<!-- 或使用自己的截图 -->

Claude Code 采用了...
```

---

### 步骤6: 生成图片清单和下载日志 ⭐ 自动生成

**创建 images/README.md**:

```markdown
# 配图清单 - [项目名]

> 生成时间: 2025-10-26
> 总数: 7 张 | 已下载: 4 张 | 待补充: 3 张

## 已下载图片 ✅

### 01-claude-interface.png (Claude Code 界面)
- **类型**: 产品截图
- **尺寸**: 1920×1080px (245KB)
- **来源**: https://github.com/anthropics/claude-code/raw/main/screenshot.png
- **许可**: MIT License
- **状态**: ✅ 已下载
- **位置**: draft.md 第1部分后

### 02-cursor-interface.png (Cursor 界面)
- **类型**: 产品截图
- **尺寸**: 1600×900px (198KB)
- **来源**: https://cursor.sh/assets/interface.png
- **许可**: Press Kit (可使用)
- **状态**: ✅ 已下载
- **位置**: draft.md 第2部分后

### 03-comparison.svg (对比示意图)
- **类型**: 矢量图
- **尺寸**: SVG (87KB)
- **来源**: https://commons.wikimedia.org/wiki/File:Comparison.svg
- **许可**: CC0 Public Domain
- **状态**: ✅ 已下载
- **位置**: draft.md 引言后

### 04-performance-chart.png (性能图表)
- **类型**: 数据图表
- **尺寸**: 800×600px (自己生成)
- **来源**: Python matplotlib (代码已提供)
- **状态**: ✅ 已生成
- **位置**: draft.md 性能对比部分

---

## 待补充图片 ⚠️

### 00-cover.png (封面图) [P0 必须]
- **类型**: 设计图
- **尺寸**: 900×500px
- **状态**: ⏳ 待AI生成
- **方法**: Midjourney prompt 已提供 (见下方)
- **位置**: 文章开头

### 05-feature-table.png (功能对比表) [P1 建议]
- **类型**: 表格截图
- **尺寸**: 1200×800px
- **状态**: ⏳ 待制作
- **方法**: Excel/Numbers 制作后截图
- **位置**: draft.md 功能对比部分

### 06-decision-tree.png (选择决策树) [P2 可选]
- **类型**: 流程图
- **尺寸**: 800×600px
- **状态**: ⏳ 待制作
- **方法**: draw.io / excalidraw
- **位置**: draft.md 结论部分

---

## 下载失败图片 ❌

_无下载失败的图片_

(如有失败,会在此列出原因和替代方案)

---

## 制作优先级

- ✅ **已完成** (4张): Claude界面, Cursor界面, 对比图, 性能图表
- ⏳ **P0 必须** (1张): 封面图 - AI生成
- ⏳ **P1 建议** (1张): 功能对比表 - 手动制作
- ⏳ **P2 可选** (1张): 决策树 - 可选

---

## 下一步行动

1. [ ] 使用 Midjourney 生成封面图 (prompt 已提供)
2. [ ] 制作功能对比表 (Excel/Numbers)
3. [ ] (可选) 绘制决策树 (draw.io)
4. [ ] 将生成的图片放入 images/ 目录
5. [ ] draft.md 中的图片引用已自动插入 ✅

---

## AI生成 Prompt (封面图)

**Midjourney**:
```
Split screen comparison, left side Claude AI interface with purple theme,
right side Cursor IDE interface with blue theme, VS text in center,
modern tech style, clean minimal design, 16:9 aspect ratio --ar 16:9 --v 6
```

**Stable Diffusion**:
```
software interface comparison, split screen design, modern UI,
purple and blue color scheme, clean minimal style, high quality
```
```

**同时创建 images/download-log.json**:

```json
{
  "timestamp": "2025-10-26T10:30:00.000Z",
  "total": 7,
  "success": 4,
  "failed": 0,
  "pending": 3,
  "results": [
    {
      "fileName": "01-claude-interface.png",
      "url": "https://github.com/anthropics/claude-code/raw/main/screenshot.png",
      "success": true,
      "size": 250880,
      "format": "png"
    },
    {
      "fileName": "02-cursor-interface.png",
      "url": "https://cursor.sh/assets/interface.png",
      "success": true,
      "size": 202752,
      "format": "png"
    },
    {
      "fileName": "03-comparison.svg",
      "url": "https://commons.wikimedia.org/wiki/File:Comparison.svg",
      "success": true,
      "size": 89088,
      "format": "svg"
    },
    {
      "fileName": "04-performance-chart.png",
      "success": true,
      "size": 156672,
      "format": "png",
      "source": "自己生成"
    },
    {
      "fileName": "00-cover.png",
      "success": false,
      "pending": true,
      "reason": "需要AI生成"
    },
    {
      "fileName": "05-feature-table.png",
      "success": false,
      "pending": true,
      "reason": "需要手动制作"
    },
    {
      "fileName": "06-decision-tree.png",
      "success": false,
      "pending": true,
      "reason": "需要手动绘制"
    }
  ]
}
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

## 多重下载策略流程图

```
开始配图流程
    ↓
分析配图需求 (步骤2)
    ↓
搜索公共资源 (WebSearch/WebFetch)
    ↓
┌─────────────────────────────────────┐
│ 策略1: axios 直接下载 (优先)       │
│ - 公共领域: Wikimedia Commons      │
│ - 官方资源: GitHub/官网            │
│ - 免费图库: Unsplash/Pexels        │
└─────────────────────────────────────┘
    ↓
  成功? ──YES──→ 保存图片 ────┐
    │                         │
    NO (403/401/超时)         │
    ↓                         │
┌─────────────────────────────────────┐
│ 策略2: Playwright MCP 浏览器下载   │
│ - 检测 Playwright MCP 是否安装     │
│ - 使用浏览器访问受保护的图片       │
│ - 截图或下载文件                   │
└─────────────────────────────────────┘
    ↓                         │
  成功? ──YES──→ 保存图片 ────┤
    │                         │
    NO (无Playwright或仍失败)  │
    ↓                         │
┌─────────────────────────────────────┐
│ 策略3: AI 生成 SVG 占位图 (兜底)  │
│ - 根据图片类型生成对应 SVG         │
│ - 保持配图完整性                   │
│ - 标注"AI生成占位图"              │
│ - 后续可替换真实图片               │
└─────────────────────────────────────┘
    ↓                         │
  生成 SVG ────────────────────┤
    ↓                         │
  ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
    ↓
插入 Markdown 引用 (步骤5)
    ↓
生成清单和日志 (步骤6)
    ↓
完成
```

## 注意事项

### 1. 版权合规
- ✅ 使用自己截图,不要盗用他人图片
- ✅ 公共领域优先 (CC0/Public Domain)
- ✅ 官方资源需确认许可 (MIT/Apache/Press Kit)
- ⚠️ 标注图片来源和许可证

### 2. 清晰度要求
- 截图使用 2x Retina 分辨率
- 压缩前保持原始质量
- 公众号封面: ≥ 900×500px
- 插图: ≥ 720px 宽度

### 3. 标注和说明
- 关键功能用箭头和文字标注
- 添加图片说明文字 (Caption)
- 复杂图表需要图例 (Legend)
- SVG 占位图明确标注 "AI生成"

### 4. 一致性
- 配图风格保持统一
- 颜色主题一致
- 字体和排版统一
- 图标风格协调

### 5. Playwright MCP 使用建议
- 首次使用会自动安装 Chromium (~200MB)
- 仅在 axios 失败时使用 (节省资源)
- 适用于需要登录或有反爬虫的网站
- 下载速度比 axios 慢,但成功率更高

### 6. SVG 占位图最佳实践
- 保持简洁,突出关键信息
- 使用品牌色彩 (如有)
- 明确标注 "AI生成占位图"
- 提供替换指引 (images/README.md)
- 尺寸与真实图片一致

---

## 最终输出示例 ⭐ 自动下载完成

```
✅ 配图系统执行完成 - 已自动下载公共资源图片

📋 执行总结:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 工作区: 公众号 (wechat)
- 配图要求: 5-8 张
- 总计规划: 7 张 (P0:2张, P1:3张, P2:2张)
- 已自动下载: 4 张 (公共资源 + 自己生成)
- 待补充: 3 张 (AI生成1张, 手动制作2张)
- 文章字数: 3200字
- 平均间隔: 约450字/图

📄 生成的文件:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ workspaces/wechat/articles/001-*/images-plan.md       - 配图方案
✅ workspaces/wechat/articles/001-*/images/README.md     - 图片清单(含下载状态)
✅ workspaces/wechat/articles/001-*/images/download-log.json  - 下载日志
✅ workspaces/wechat/articles/001-*/draft.md             - 已插入图片引用

📸 图片下载结果 (多重策略):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 已获取 (6张):
  [策略1-axios] 01-claude-interface.png   (245KB, GitHub官方)
  [策略1-axios] 02-cursor-interface.png   (198KB, Cursor官网)
  [策略2-Playwright] 03-comparison.png    (189KB, 受保护资源)
  [策略1-axios] 04-performance-chart.png  (157KB, 自己生成)
  [策略3-SVG] 05-feature-table.svg        (8KB, AI生成占位图)
  [策略3-SVG] 06-code-example.svg         (12KB, AI生成占位图)

⏳ 待补充 (1张):
  [⏳] 00-cover.png               (AI生成 - Midjourney prompt已提供)

📊 策略统计:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ axios 直接下载: 3张 (75% 成功率)
  ✓ Playwright MCP: 1张 (处理反爬虫)
  ✓ SVG 占位图: 2张 (保证配图完整)
  ⏳ 待手动补充: 1张 (封面图)

💡 Playwright 使用情况:
  - 检测状态: ✓ 已安装
  - 使用次数: 1次
  - 成功率: 100%
  - 适用场景: 403 Forbidden 资源

🔍 图片来源:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 自动下载成功: 4 张
   - 官方资源: 2 张 (GitHub + 官网)
   - 公共领域: 1 张 (Wikimedia Commons)
   - 自己生成: 1 张 (Python matplotlib)
⏳ 待手动补充: 3 张
   - AI生成: 1 张 (Midjourney prompt已提供)
   - 手动制作: 2 张 (制作指南已提供)

💡 draft.md 更新情况:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 已自动插入: 4 个图片引用 (成功下载的图片)
⏳ 已添加占位注释: 3 处 (待补充的图片,含下载/制作指引)

📦 下载详情:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 下载日志: images/download-log.json
- 总下载大小: 687KB
- 下载耗时: 约 12 秒
- 并发数: 5
- 重试次数: 0 (所有下载一次成功)

💡 下一步行动:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ✅ 公共资源图片 - 已自动下载完成
2. ⏳ 封面图 - 使用提供的 Midjourney prompt 生成
3. ⏳ 功能对比表 - 使用 Excel/Numbers 制作
4. ⏳ 决策树 - 使用 draw.io / excalidraw 绘制 (可选)
5. 将补充的图片保存到 images/ 目录
6. draft.md 中的引用无需修改 ✅
7. /check - 最终检查

⚠️  重要提醒:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- ✅ 已下载图片的引用已自动插入 draft.md
- ⏳ 待补充图片的位置已标注 HTML 注释 (<!-- 图片待补充 -->)
- 图片文件名不要修改 (与Markdown引用对应)
- 确保补充的图片尺寸符合要求:
  * 封面: 900×500px (公众号) 或 1200×675px (知乎)
  * 插图: 720px 宽度
- 版权合规: ✅ 已下载图片均为合法来源
  * GitHub官方: MIT License
  * 官网Press Kit: 可使用
  * Wikimedia Commons: CC0 Public Domain

📄 查看详情:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 完整配图清单: images/README.md
- 下载日志详情: images/download-log.json
- 配图方案文档: images-plan.md
```
