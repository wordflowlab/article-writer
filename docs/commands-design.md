# Article Writer - 核心命令设计

## 命令对照表

| 步骤 | 命令 | 来源 | 优先级 | 开发工作量 |
|-----|------|------|--------|----------|
| 1 | `/brief-save` | 改造 `/specify` | P0 | 1天 |
| 2 | `/research` | **新增** | P0 | 3天 |
| 3 | `/topic-discuss` | 改造 `/clarify` | P0 | 2天 |
| 4 | `/collab-doc` | 改造 `/tasks` | P1 | 1天 |
| 5 | `/style-learn` | 改造 `/constitution` | P1 | 1天 |
| 5.5 | `/materials-search` | **新增** | P0 | 2天 |
| 6 | `/write-draft` | 改造 `/write` | P0 | 2天 |
| 7.5 | `/style-transform` | **新增** | P2 | 2天 |
| 8 | `/audit` | 扩展 `/analyze` | P0 | 4天 |
| 9 | `/images` | **新增** | P1 | 3天 |

**总计开发时间: 21天 (P0+P1),考虑测试和调试,预计30天完成**

---

## 命令详细设计

### 1. `/brief-save` - 理解需求并保存brief

**改造自:** `/specify`

**Frontmatter:**
```yaml
---
description: 理解写作需求并保存brief
argument-hint: [需求描述或brief文件路径]
allowed-tools: Write(//_briefs/**), Read(//*)
scripts:
  sh: .specify/scripts/bash/init-brief.sh
---
```

**执行逻辑:**

```markdown
# 理解需求并保存Brief

## 输入方式

### 方式1: 用户直接描述需求
用户提供文字描述,例如:
> "写一篇关于Claude Code的文章,3000字左右,对比Cursor,目标读者是程序员"

**AI处理流程:**
1. 提取关键信息:
   - 主题: Claude Code
   - 字数: 3000
   - 对比对象: Cursor
   - 目标读者: 程序员

2. 补充关键信息(通过提问):
   - 发布平台? (公众号/博客/小红书)
   - 内容定位? (评测/教程/观点)
   - 是否需要真实测试?
   - 是否有配图要求?
   - 截稿时间?

3. 生成brief草稿,让用户确认

### 方式2: 用户上传brief文件
用户提供Word/PDF/Markdown文件:
> "这是客户给的brief: /path/to/brief.docx"

**AI处理流程:**
1. 读取文件内容
2. 解析结构化信息
3. 补充缺失字段
4. 生成标准格式brief

## Brief标准格式

保存到: `_briefs/项目名-brief.md`

```markdown
# 写作Brief - [项目名]

## 元信息
- **项目编号**: 001
- **创建时间**: 2025-01-15
- **截稿时间**: 2025-01-20
- **项目类型**: 商单/个人创作

## 内容需求

### 主题
Claude Code 使用体验与对比评测

### 目标读者
- **主要读者**: 程序员、技术从业者
- **次要读者**: 对AI工具感兴趣的普通用户
- **读者痛点**: 选择合适的AI编程工具

### 内容定位
- [x] 评测/对比
- [ ] 教程/指南
- [ ] 观点/分析
- [ ] 案例研究

### 字数要求
- **目标字数**: 3000-3500字
- **可接受范围**: 2800-4000字

### 发布平台
- **主平台**: 微信公众号
- **分发平台**: 小红书、即刻

## 内容要求

### 必须包含(P0)
- [ ] Claude Code 核心特性介绍
- [ ] 与 Cursor 的详细对比
- [ ] 真实使用体验(至少3个场景)
- [ ] 定价信息

### 建议包含(P1)
- [ ] 使用截图(5-8张)
- [ ] 代码示例
- [ ] 社区评价汇总

### 可选内容(P2)
- [ ] 视频演示
- [ ] 配置教程

## 风格要求

### 语言风格
- **基调**: 实用、接地气
- **语气**: 第一人称,"我测了XX"
- **专业度**: 技术准确,但避免过度术语

### 结构要求
- **开头**: hook(真实使用场景引入)
- **中间**: 对比+实测数据
- **结尾**: 推荐建议

## 数据要求

### 需要真实测试
- [x] 是
- [ ] 否

**测试内容:**
- Claude Code 与 Cursor 性能对比(响应速度、代码质量)
- 实际项目开发测试(至少3个场景)
- 功能覆盖度测试

### 需要信息调研
- [x] 是

**调研内容:**
- 官方特性说明
- 社区评价(Reddit、Twitter)
- 竞品对比数据

## 配图要求

- **配图数量**: 5-8张
- **配图类型**:
  - 产品界面截图(3-4张)
  - 对比图表(1-2张)
  - 使用场景示意图(1-2张)
- **配图风格**: 简洁、专业

## 质量要求

### AI检测
- **目标AI浓度**: < 30%
- **审校轮次**: 至少2轮(风格+细节)

### SEO要求
- **关键词**: Claude Code, AI编程工具, Cursor对比
- **标题优化**: 包含核心关键词

## 内容红线

### 禁止内容
- ❌ 夸大宣传(不能说"最好"、"完美")
- ❌ 贬低竞品(客观对比,不恶意攻击)
- ❌ 未验证的数据(所有数据必须有来源)

### 注意事项
- ⚠️ 产品名称统一: "Claude Code"(不是"ClaudeCode")
- ⚠️ 定价信息需官方确认
- ⚠️ 评价需标注来源

## 备注

- 客户要求重点突出"上下文理解"能力
- 需要在文章末尾加购买链接
- 如有问题,联系: xxx@example.com
```

## 执行后操作

1. **保存brief文件**
   - 路径: `_briefs/项目名-brief.md`
   - 自动生成项目编号(递增)

2. **创建项目目录结构**
   ```
   articles/001-claude-code/
   ├── specification.md  (从brief生成)
   ├── tasks.md          (待生成)
   ├── draft.md          (待生成)
   └── images/           (待创建)
   ```

3. **提示用户下一步**
   ```
   ✅ Brief已保存: _briefs/001-claude-code-brief.md

   📋 项目概览:
   - 主题: Claude Code 使用体验与对比评测
   - 字数: 3000-3500字
   - 截稿: 2025-01-20
   - 需要测试: 是
   - 需要调研: 是

   💡 下一步:
   1. /research - 开始信息调研
   2. /topic-discuss - 讨论选题方向

   或者输入 "continue" 自动执行后续流程
   ```
```

---

### 2. `/research` - 信息搜索与知识管理

**新增命令**

**Frontmatter:**
```yaml
---
description: 多渠道信息搜索,保存到知识库
argument-hint: [主题] [--update 更新已有调研]
allowed-tools: WebSearch, WebFetch, Write(//_knowledge_base/**), Read(//_briefs/**)
scripts:
  sh: .specify/scripts/bash/check-network.sh
model: claude-sonnet-4-5-20250929
---
```

**执行逻辑:**
(详见 technical-design.md 第2.4节)

**核心创新点:**
1. **强制信息源优先级** - 官方>媒体>社区,禁用知乎/百度
2. **时间戳管理** - 每次调研记录时间,建议更新周期
3. **交叉验证** - 至少2个来源确认数据
4. **结构化保存** - 统一的Markdown模板,便于后续引用

---

### 3. `/topic-discuss` - 选题讨论

**改造自:** `/clarify`

**Frontmatter:**
```yaml
---
description: 提供3-4个选题方向,等待用户选择
argument-hint: []
allowed-tools: Read(//_briefs/**), Read(//_knowledge_base/**)
scripts:
  sh: .specify/scripts/bash/load-brief.sh
---
```

**执行逻辑:**

```markdown
# 选题讨论

## 前置条件检查

1. 确认brief已保存
2. 确认调研数据已准备(如需要)

## 选题生成流程

基于brief和调研结果,生成3-4个选题方向:

### 选题格式

每个选题包含:
1. **标题**(吸引人的)
2. **核心角度** - 从什么角度切入
3. **工作量评估** - ⭐⭐⭐ (1-5星)
4. **优势** - 这个角度的优点
5. **劣势** - 可能的挑战
6. **是否需要真实测试** - 是/否
7. **大纲预览** - 3-7个大标题 + 字数分配

### 示例输出

```
📝 基于您的需求,我准备了4个选题方向:

---

## 选题1: "我用Claude Code替代Cursor两周后,发现了这些真相"

**核心角度**: 第一人称真实体验 + 对比测试
**工作量评估**: ⭐⭐⭐⭐ (需要深度测试)

**优势:**
- 真实性强,容易获得读者信任
- 对比有说服力
- 适合从个人经历引入,有代入感

**劣势:**
- 需要至少2周真实使用数据
- 测试工作量大(需3-5个实际项目)
- 主观性较强,需要客观数据支撑

**需要真实测试:** 是
- 至少3个实际项目测试
- 性能对比数据
- 功能覆盖度验证

**大纲预览**(预计3200字):

1. **开头 - 为什么要换工具**(300字)
   - 用真实场景引入: "Cursor又卡了,我决定试试Claude Code"
   - 点明对比测试的必要性

2. **核心对比 - 5个关键维度**(1500字)
   - 响应速度: 实测数据对比(500字)
   - 上下文理解: 具体案例(400字)
   - 代码质量: 真实项目测试(300字)
   - 稳定性: 一周使用记录(200字)
   - 价格: 性价比分析(100字)

3. **深度体验 - 3个实际场景**(800字)
   - 场景1: 重构老代码
   - 场景2: 新项目开发
   - 场景3: Bug修复

4. **数据总结 - 客观结论**(400字)
   - 图表展示对比数据
   - 适用场景建议

5. **结尾 - 推荐建议**(200字)
   - 明确立场: 什么情况下推荐/不推荐
   - 给出选择建议

---

## 选题2: "Claude Code vs Cursor:程序员必看的2025年AI工具选购指南"

**核心角度**: 选购指南 + 决策树
**工作量评估**: ⭐⭐⭐ (中等,更多依赖调研)

**优势:**
- 实用性强,符合"工具选择"痛点
- 可以引入更多维度(不只是两个工具)
- SEO友好(关键词覆盖全)

**劣势:**
- 缺乏个人故事,代入感弱
- 容易写得像产品说明书
- 需要更多竞品对比数据

**需要真实测试:** 否(可选)
- 可以基于调研数据和社区评价
- 如有真实测试更好,但非必须

**大纲预览**(预计3000字):

1. **开头 - 选择困难**(250字)
   - 场景: "2025年,AI编程工具太多了"
   - 提出核心问题: 如何选择?

2. **工具矩阵 - 横向对比**(600字)
   - 对比表格: Claude Code / Cursor / GitHub Copilot
   - 5个维度快速对比

3. **Claude Code详解**(800字)
   - 核心特性
   - 适用人群
   - 优缺点

4. **Cursor详解**(800字)
   - 核心特性
   - 适用人群
   - 优缺点

5. **决策树 - 如何选择**(400字)
   - 根据使用场景推荐
   - 根据预算推荐
   - 根据技术栈推荐

6. **结尾 - 未来趋势**(150字)
   - AI编程工具发展方向

---

## 选题3: "Claude Code的5个隐藏功能,比Cursor好用100倍"

**核心角度**: 功能挖掘 + 技巧分享
**工作量评估**: ⭐⭐ (轻量,重点在功能发现)

**优势:**
- 标题吸引眼球("100倍"、"隐藏功能")
- 适合碎片化阅读
- 容易产生"原来还能这样"的惊喜感

**劣势:**
- 标题党嫌疑,可能降低信任度
- 需要真正发现"隐藏功能"(不能编造)
- 不够系统,缺乏完整对比

**需要真实测试:** 是
- 需要深度使用发现隐藏功能
- 需要验证这些功能确实好用

**大纲预览**(预计2800字):

1. **开头 - 钩子**(200字)
   - "用了一个月才发现的秘密"
   - 点明"隐藏功能"概念

2. **功能1-5 逐一介绍**(2000字,每个400字)
   - 功能描述 + 使用场景 + 对比Cursor

3. **组合技巧**(400字)
   - 多个功能配合使用的高级技巧

4. **结尾 - 彩蛋**(200字)
   - 还有哪些功能值得探索

---

## 选题4: "为什么我从Cursor切换到Claude Code?一个前端开发者的3000字长文"

**核心角度**: 个人叙事 + 技术分析
**工作量评估**: ⭐⭐⭐⭐ (需要真实切换经历)

**优势:**
- 叙事感强,容易引发共鸣
- "为什么切换"是刚需话题
- 前端开发视角更具体

**劣势:**
- 需要真正的切换经历(不能编造)
- 局限于前端,其他领域适用性弱
- 可能过于主观

**需要真实测试:** 是
- 需要真实切换过程记录
- 前端项目实测

**大纲预览**(预计3100字):

1. **开头 - 切换契机**(300字)
   - 真实故事: Cursor遇到的问题
   - 为什么考虑Claude Code

2. **对比测试 - 前端场景**(1200字)
   - React项目测试
   - Vue项目测试
   - 性能优化场景

3. **切换成本**(400字)
   - 配置迁移
   - 学习曲线
   - 团队协作影响

4. **真实收益**(800字)
   - 效率提升数据
   - 代码质量改善
   - 成本变化

5. **踩坑记录**(300字)
   - 遇到的问题
   - 解决方案

6. **结尾 - 是否推荐**(100字)

---

## 等待用户选择

💡 **请选择一个方向,或者:**
- 输入 "1-4" 选择对应选题
- 输入 "组合" - 融合多个选题的优点
- 输入 "调整" - 基于某个选题微调
- 输入 "重新" - 提供新的方向

⚠️ **重要:** 我不会假设你的选择,也不会自己决定。请明确告诉我你的选择后,我再继续。
```

## 核心原则

1. **不要自作主张** - 绝不假设用户会选哪个
2. **提供足够信息** - 让用户能做出明智决策
3. **工作量透明** - 明确标注需要的测试/调研工作
4. **大纲预览** - 让用户看到具体会写什么

## 用户选择后

用户选择后,AI才继续:

```
✅ 您选择了: 选题1 - "我用Claude Code替代Cursor两周后,发现了这些真相"

📊 工作量评估:
- 预计字数: 3200字
- 测试任务: 3个实际项目
- 预计耗时: 2-3天(含测试)

💡 下一步:
1. /collab-doc - 创建测试任务清单
2. 完成测试后,提供数据
3. /write-draft - 开始写作

或输入 "continue" 继续流程
```
```

---

### 4. `/materials-search` - 搜索个人素材库

**新增命令**

**Frontmatter:**
```yaml
---
description: 从个人素材库搜索真实经历和观点
argument-hint: [关键词] [--source raw|indexed]
allowed-tools: Grep(//materials/**), Read(//materials/**), Bash(ls:materials/*)
scripts:
  sh: .specify/scripts/bash/materials-search.sh
---
```

**执行逻辑:**
(详见 technical-design.md 第2.2节)

**核心特点:**
1. **双路径搜索** - 原始CSV(Grep) + 主题索引(Read)
2. **真实性保障** - 禁止编造,所有素材必须真实
3. **改写融入** - 提供改写示例,避免直接复制粘贴

---

### 5. `/audit` - 三遍审校机制

**扩展自:** `/analyze`

**Frontmatter:**
```yaml
---
description: 三遍审校 - 系统化降低AI检测率
argument-hint: [模式:content|style|detail|all] [文件路径]
allowed-tools: Read(//articles/**), Write(//articles/**), Bash(wc:*)
scripts:
  sh: .specify/scripts/bash/audit-check.sh
model: claude-sonnet-4-5-20250929
---
```

**三种模式:**

#### 模式1: content (内容审校)
- 事实准确性
- 逻辑一致性
- 结构合理性
- 真实性验证

#### 模式2: style (风格审校) ⭐核心
- 删除AI套话(8大类套话库)
- 拆解AI句式(识别对称结构)
- 替换书面词汇(200+常见替换)
- 口语化改造
- 加入真实细节
- 增强个性化

#### 模式3: detail (细节打磨)
- 句子长度控制
- 段落长度优化
- 标点自然化
- 节奏变化

**对比输出格式:**
```
⚠️ 需修改 (12处)

【位置】第1段第1句
❌ 原文: "在当今AI技术飞速发展的时代,编程工具也在不断进化..."
✅ 改为: "Claude Code出了两周,我每天都在用。"
【理由】删除套话,用真实时长代替
【AI特征】套话 + 书面语 + 过长(38字)

【位置】第3段第2句
❌ 原文: "通过充分利用Claude Code的能力,可以显著提升开发效率"
✅ 改为: "用好Claude Code,每个项目能省3-5小时"
【理由】替换书面词汇 + 加入具体数字
【AI特征】书面词汇 + 抽象表达

...

应用全部修改? (yes/no/edit/preview)
```

---

### 6. `/images` - 文章配图

**新增命令**

**Frontmatter:**
```yaml
---
description: 分析文章并自动生成/获取配图
argument-hint: [文件路径]
allowed-tools: Read(//articles/**), Write(//articles/**/images/**), WebFetch, Bash(curl:*)
scripts:
  sh: .specify/scripts/bash/image-manager.sh
plugins: image-generator
---
```

**执行逻辑:**

```markdown
# 文章配图命令

## 执行流程

### 1. 分析文章配图需求

读取文章内容,自动识别需要配图的位置:

**规则:**
- 每1000字至少1张图
- 核心观点/数据必须配图
- 对比内容需要对比图
- 步骤教程需要截图

**输出:**
```
📸 配图需求分析

推荐配图位置:

1. 【第1段后】开篇引入图
   - 类型: 产品截图
   - 内容: Claude Code界面
   - 来源建议: 官方素材 / 自己截图

2. 【第3段中】性能对比图
   - 类型: 数据图表
   - 内容: Claude Code vs Cursor 响应速度对比
   - 来源建议: 自己制作(基于测试数据)

3. 【第5段后】使用场景图
   - 类型: 示意图
   - 内容: 代码补全效果展示
   - 来源建议: 截图 + 标注

4. 【第7段中】功能对比表
   - 类型: 表格图
   - 内容: 5个维度对比
   - 来源建议: AI生成

5. 【结尾前】总结配图
   - 类型: 概念图
   - 内容: 选择决策树
   - 来源建议: AI生成

总计: 5张 (符合5-8张要求)
```

### 2. 确定图片来源

按优先级:
1. **公共领域作品** (Wikimedia Commons)
2. **官方素材** (产品官网/GitHub)
3. **AI生成** (火山引擎/MidJourney API)
4. **免费图库** (Unsplash/Pexels)
5. **自己截图** (需要标注)

### 3. 获取/生成图片

**方法A: 搜索公共资源**
```bash
# 使用 WebSearch 搜索公共领域图片
WebSearch query="Claude Code screenshot site:github.com OR site:anthropic.com"
```

**方法B: AI生成**
```bash
# 调用插件 image-generator
curl -X POST https://api.volcengine.com/image/generate \
  -d '{
    "prompt": "software interface comparison chart, clean modern design",
    "size": "1024x768"
  }'
```

**方法C: 图库下载**
```bash
# Unsplash API
curl "https://api.unsplash.com/photos/random?query=technology&client_id=xxx"
```

### 4. 保存图片

目录结构:
```
articles/001-claude-code/images/
├── 01-claude-code-interface.png      # 产品截图
├── 02-performance-comparison.png     # 性能对比
├── 03-code-completion-demo.png       # 使用场景
├── 04-feature-comparison-table.png   # 功能对比
└── 05-decision-tree.png              # 决策树
```

### 5. 插入图片引用

在Markdown中插入图片:

```markdown
<!-- 原文 -->
Claude Code的界面设计简洁直观。

<!-- 插入后 -->
Claude Code的界面设计简洁直观。

![Claude Code界面](images/01-claude-code-interface.png)
*图1: Claude Code主界面*
```

### 6. 生成图片清单

创建 `images/README.md`:

```markdown
# 图片清单

## 01-claude-code-interface.png
- **描述**: Claude Code主界面截图
- **来源**: 官方网站 (https://claude.ai)
- **授权**: 官方宣传素材,可商用
- **尺寸**: 1920x1080
- **文件大小**: 256KB

## 02-performance-comparison.png
- **描述**: 性能对比图表
- **来源**: AI生成 (火山引擎)
- **授权**: 商业授权
- **Prompt**: "clean bar chart comparing response times..."
- **尺寸**: 1024x768
- **文件大小**: 128KB

...
```

## 特殊功能

### 图片优化
- 自动压缩(目标<300KB/张)
- 格式转换(PNG→WebP节省体积)
- 尺寸调整(适配公众号/小红书)

### 水印添加
```bash
# 使用 ImageMagick 添加水印
convert image.png -pointsize 20 \
  -draw "text 10,10 '图片来源:作者测试'" \
  image-watermarked.png
```

### 图床上传(可选)
如果配置了图床:
```bash
# 上传到阿里云OSS
ossutil cp images/*.png oss://my-bucket/article-001/
```

返回CDN链接,更新Markdown引用。

## 输出报告

```
✅ 配图完成

📊 配图统计:
- 总数: 5张
- 来源分布:
  - 官方素材: 2张
  - AI生成: 2张
  - 免费图库: 1张
- 总大小: 1.2MB
- 平均大小: 240KB ✅

📁 保存位置: articles/001-claude-code/images/

💡 已更新文章:
- 插入图片引用: 5处
- 添加图片说明: 5处

🔗 图片清单: images/README.md

是否需要:
1. 图片优化 - 压缩体积
2. 水印添加 - 添加来源标注
3. 图床上传 - 上传到CDN

输入 "1,2" 执行多个操作,或 "done" 完成
```
```

---

## 命令执行顺序建议

### 标准流程(新写作任务)

```
/brief-save → /research → /topic-discuss → (用户选择)
  ↓
/collab-doc → (用户完成测试任务)
  ↓
/materials-search → /write-draft
  ↓
/audit content → /audit style → /audit detail
  ↓
/images → 完成
```

### 快速流程(无需测试)

```
/brief-save → /topic-discuss → (用户选择)
  ↓
/materials-search → /write-draft
  ↓
/audit style → /audit detail → /images → 完成
```

### 修改流程(已有文章)

```
/audit style → /audit detail → 完成
```

---

## 命令之间的数据传递

```
/brief-save
  ↓ 生成: _briefs/项目名-brief.md
  ↓
/research
  ↓ 读取: _briefs/*.md
  ↓ 生成: _knowledge_base/主题-日期.md
  ↓
/topic-discuss
  ↓ 读取: _briefs/*.md + _knowledge_base/*.md
  ↓ 输出: 选题列表(不保存,等用户选择)
  ↓
/materials-search
  ↓ 读取: articles/*/specification.md (提取关键词)
  ↓ 搜索: materials/raw/*.csv + materials/indexed/*.md
  ↓ 输出: 素材列表(供write-draft使用)
  ↓
/write-draft
  ↓ 读取: brief + knowledge_base + materials搜索结果
  ↓ 生成: articles/*/draft.md
  ↓
/audit
  ↓ 读取: draft.md
  ↓ 更新: draft.md (应用修改后)
  ↓
/images
  ↓ 读取: draft.md
  ↓ 生成: articles/*/images/*.png
  ↓ 更新: draft.md (插入图片引用)
  ↓
📄 完成: final.md
```

---

**命令设计完成!下一步可以开始编写具体的命令模板Markdown文件。**
