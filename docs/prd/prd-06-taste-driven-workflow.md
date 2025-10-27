# ⚠️ PRD-06: 品味驱动的创作工作流 [已废弃]

> **废弃原因**: 核心思路存在致命缺陷 - "从AI生成的内容中挑选"无法解决AI的5个致命伤（缺温度、缺个性、缺地域性、缺真实细节、缺思想）
> 
> **替代方案**: [PRD-07: 真实驱动的创作工作流](./prd-07-authentic-writing-workflow.md)
> 
> **关键洞察**: 无论AI生成多少字，本质都是冰冷、套话、假细节。真实的内容只能来自人的亲身经历。

---

## ⚠️ 请勿参考本文档

本文档已被废弃，请参考 [PRD-07](./prd-07-authentic-writing-workflow.md)

**核心问题**:
- ❌ 多版本生成 → 无论生成多少版本，都是AI味
- ❌ 片段选择 → 从塑料苹果里挑"最好的"，挑出来的还是塑料
- ❌ AI作为素材生成器 → AI生成的"素材"本质就不应该直接使用

**正确方向** (PRD-07):
- ✅ AI作为教练/参考书 → 提问、引导、检查
- ✅ 素材来自个人素材库 → 真实经历、即刻动态、个人笔记
- ✅ 人必须自己写 → AI不生成可用内容，只提供思路

---

## 元信息 (历史记录)
- **优先级**: ~~P0~~ → 已废弃
- **预计工作量**: 7 天
- **依赖**: 现有 /write, /review 命令
- **状态**: ❌ 已废弃 (2025-10-27)
- **创建日期**: 2025-10-27
- **废弃日期**: 2025-10-27 (创建当天即发现问题)
- **灵感来源**: 用户分享的创作工作流文章

---

## 一、需求背景

### 1.1 问题识别

通过用户分享的真实创作工作流，我们发现当前系统存在核心定位偏差：

**现状问题**：
1. ❌ AI定位过于激进 - 系统试图让AI"直接生成好文章"
2. ❌ 缺少品味体现 - 用户没有机会展现"选择能力"
3. ❌ 单一版本生成 - 无法对比、无法训练判断力
4. ❌ 缺少品味培养 - 只有技术规则，没有品味训练
5. ❌ 观点不够突出 - 观点应该是第一步，而非隐含在需求中

**核心洞察**：
> AI可以拉高创作的下限，但也正在摧毁没有品味的人的上限。
> 
> **品味 = 知道什么是好，它为什么好**
>
> 品味的建立：看（大量优秀作品）→ 做（笨拙练习）→ 想（分析原因）→ 循环

### 1.2 用户真实工作流（Gemini 2.5 Pro辅助）

```
步骤1: 深读原材料，形成核心观点
   ↓ （观点是灵魂，AI生成不了）
步骤2: 观点 + 原文 → AI生成
   → 5个独立对话框
   → 每个生成3-5个版本
   → 每个版本5000字
   → 总计：15000-25000字
   ↓
步骤3: 通读所有版本（不是扫读）
   ↓ （这一步体现品味）
步骤4: 从几万字中挑选几百字
   → 标准：无事实错误 + 符合气质 + 节奏好
   ↓ （选择能力 = 品味）
步骤5: 塞进自己的2000-3500字框架
   ↓
最终：AI辅助占15%-40%，核心是人的观点和选择
```

**关键比例**：
- 生成量：15000-25000字
- 使用量：几百字
- 比例：约 2%-5%
- **结论**：AI是"素材库"，不是"文章生成器"

### 1.3 对系统的启示

**重新定义系统目标**：
- ❌ 不是"让AI写出好文章"
- ✅ 而是"帮用户建立和强化品味，用AI放大品味"

**核心价值链**：
```
品味（人）→ 观点（人）→ 素材（AI）→ 选择（人+品味）→ 整合（人）
        ↑_______________品味培养反馈_______________↑
```

---

## 二、用户故事

### 2.1 核心用户画像

**小李 - 公众号作者（有一定基础）**
- 写了100篇文章，有一定品味基础
- 知道什么样的开头能抓人
- 能判断哪些句子"油腻"、哪些"真实"
- **需求**：用AI提高效率，但保持内容质量

**小王 - 新手创作者（品味薄弱）**
- 刚开始写作，不知道什么是"好"
- 容易被AI生成的"看起来挺好"的内容迷惑
- **需求**：在用AI的过程中，逐步建立品味

### 2.2 用户故事

#### 故事1：生成多版本素材

**场景**：小李准备写一篇关于Claude Code的文章

```
小李: /specify "写Claude Code评测，3000字"
系统: ✅ Brief已保存

小李: /extract-viewpoint
系统: 请提供你的核心观点，这将是文章的灵魂：
小李: "Claude Code的核心优势是上下文理解，比Cursor准确30%"
系统: ✅ 观点已记录

小李: /generate-materials --versions 5 --words 5000
系统: 🎲 正在生成5个不同风格的版本...
      
      版本1（严谨风格）: 5000字 ✅
      版本2（故事风格）: 5000字 ✅
      版本3（数据风格）: 5000字 ✅
      版本4（案例风格）: 5000字 ✅
      版本5（对比风格）: 5000字 ✅
      
      总计生成: 25000字素材
      保存路径: materials/generated/001-claude-code/
      
💡 下一步: /select-fragments 从素材中挑选优质片段
```

#### 故事2：选择优质片段（品味体现）

```
小李: /select-fragments
系统: 📖 正在展示5个版本的内容...
      
      [版本1 - 第3段]
      "Claude Code通过深度学习算法，实现了对代码上下文的
       精准理解，相比传统工具，其准确率提升了显著的幅度..."
      
      🤔 你的判断：
      1. 标记为优质 (g)
      2. 标记为可用 (o)
      3. 标记为不用 (b)
      4. 跳过 (s)
      5. 退出选择 (q)
      
小李: b  (判断：太书面、"显著的幅度"很AI)
系统: ✅ 已标记为不用

      [版本2 - 第1段]
      "用了两周Claude Code，说实话，比Cursor好用不少。
       最明显的是代码补全，Cursor经常补错，Claude Code准确率高很多。"
      
小李: g  (判断：真实、具体、有对比)
系统: ✅ 已标记为优质，添加到收藏夹

      ...（继续筛选）...
      
系统: 📊 选择统计:
      - 总片段: 247个
      - 优质: 12个（约500字）
      - 可用: 23个（约800字）
      - 不用: 212个
      
      💾 已保存到: materials/selected/001-claude-code.md
      
💡 下一步: /assemble 组装成文章
```

#### 故事3：品味培养反馈

```
小李: /taste-report
系统: 📈 您的品味分析报告

      选择统计（最近10篇）:
      - 优质片段命中率: 85% ✅（AI检测<30%的比例）
      - 拒绝AI套话: 92% ✅
      - 真实细节识别: 78% ⚠️（可以提升）
      
      品味特征:
      ✅ 擅长识别: 书面词汇、AI套话
      ⚠️ 需提升: 真实细节识别、节奏感把控
      
      对比优秀作者:
      - 大师兄朱炫: 风格锤炼 ⭐⭐⭐⭐⭐
      - 您的水平: 风格锤炼 ⭐⭐⭐☆☆（进步中）
      
      💡 训练建议:
      1. 多读优秀案例（推荐5篇）
      2. 对比你的选择和优秀作者的选择
      3. 完成3个"品味挑战"
```

---

## 三、功能需求

### 3.1 观点提炼命令（新增）

#### `/extract-viewpoint` - 提炼核心观点

**功能描述**：
在生成内容前，强制用户提炼核心观点

**执行逻辑**：
1. 读取 brief
2. 询问用户核心观点
3. 保存到 `articles/*/viewpoint.md`
4. 后续 AI 生成围绕观点展开

**验收标准**：
- [ ] 必须有观点才能进行 `/generate-materials`
- [ ] 观点保存在独立文件
- [ ] 生成时 AI 会多次引用观点

---

### 3.2 多版本生成（核心改进）

#### `/generate-materials` - 生成多版本素材

**取代**: 原 `/write` 命令

**参数**：
```bash
/generate-materials [选项]

选项:
  --versions <数量>    生成版本数（默认：3，推荐：5）
  --words <字数>       每版本字数（默认：5000）
  --styles <风格列表>  指定风格（逗号分隔）
  --parallel           并行生成（更快，但消耗更多token）
```

**风格类型**：
- `rigorous` - 严谨风格（学术、数据导向）
- `story` - 故事风格（案例、经历）
- `data` - 数据风格（图表、对比）
- `casual` - 轻松风格（口语化、幽默）
- `debate` - 辩论风格（正反对比）

**输出结构**：
```
materials/generated/001-claude-code/
├── version-1-rigorous.md        (5000字)
├── version-2-story.md           (5000字)
├── version-3-data.md            (5000字)
├── version-4-casual.md          (5000字)
├── version-5-debate.md          (5000字)
├── metadata.json                (元信息)
└── index.md                     (索引)
```

**metadata.json 示例**：
```json
{
  "article_id": "001-claude-code",
  "viewpoint": "Claude Code的核心优势是上下文理解，比Cursor准确30%",
  "brief": "_briefs/001-claude-code-brief.md",
  "total_words": 25000,
  "versions": [
    {
      "id": "version-1",
      "style": "rigorous",
      "words": 5000,
      "generated_at": "2025-10-27T10:00:00Z",
      "model": "gemini-2.0-flash-exp"
    },
    ...
  ]
}
```

**验收标准**：
- [ ] 可生成 3-5 个版本
- [ ] 每个版本风格明显不同
- [ ] 总字数可控（推荐 15000-25000 字）
- [ ] 生成时间 < 5 分钟（并行模式）

---

### 3.3 片段选择系统（品味核心）

#### `/select-fragments` - 交互式片段选择

**功能描述**：
逐段展示生成的内容，用户标记 优质/可用/不用

**交互流程**：

```
1. 读取所有生成版本
2. 按段落拆分（以空行为分隔）
3. 逐个展示：
   
   [版本2 - 第3段] (共247段，当前第15段)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   "用了两周Claude Code，说实话，比Cursor好用不少。
    最明显的是代码补全，Cursor经常补错，Claude Code
    准确率高很多。我测了30个场景，Claude Code能正确
    理解上下文的占26个，准确率87%。Cursor只有18个，60%。"
   
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   📊 片段分析:
   - 字数: 87字
   - 真实细节: ✅ 有具体数字
   - AI特征: ✅ 无套话
   - 句式: ✅ 口语化
   - AI检测预估: 25% ✅
   
   你的判断:
   [g] 优质 - 必须用  [o] 可用 - 可考虑  [b] 不用 - 跳过
   [s] 暂时跳过      [q] 退出选择      [?] 查看帮助
   
   > _
```

**标记系统**：

| 标记 | 含义 | 快捷键 | 颜色 |
|------|------|--------|------|
| **优质** | AI味低、有细节、符合气质 | `g` | 🟢 绿色 |
| **可用** | 基本可用，需要修改 | `o` | 🟡 黄色 |
| **不用** | AI味重、套话多、不符合 | `b` | 🔴 红色 |
| **跳过** | 暂时不确定 | `s` | ⚪ 灰色 |

**辅助功能**：
- `Ctrl+Z` - 撤销上一次标记
- `Ctrl+F` - 搜索关键词（跳到相关片段）
- `Ctrl+S` - 保存当前进度
- `Ctrl+R` - 查看统计报告
- `?` - 查看帮助

**输出文件** `materials/selected/001-claude-code.md`：
```markdown
# 选择的片段 - Claude Code评测

## 元信息
- 文章ID: 001-claude-code
- 选择时间: 2025-10-27 10:30:00
- 总片段数: 247
- 优质片段: 12
- 可用片段: 23

---

## 优质片段 (12个)

### 片段 #1.3 (版本1-第3段)
**来源**: version-1-rigorous.md
**字数**: 87字
**评分**: AI检测 25%

> 用了两周Claude Code，说实话，比Cursor好用不少。
> 最明显的是代码补全，Cursor经常补错，Claude Code
> 准确率高很多。我测了30个场景，Claude Code能正确
> 理解上下文的占26个，准确率87%。Cursor只有18个，60%。

**适用场景**: 开头引入、数据支撑
**标签**: #真实数据 #对比 #口语化

---

### 片段 #2.7 (版本2-第7段)
...

---

## 可用片段 (23个)
...
```

**验收标准**：
- [ ] 可逐段浏览所有生成内容
- [ ] 标记操作流畅（< 2秒响应）
- [ ] 支持撤销、搜索、保存
- [ ] 提供片段分析（AI检测预估）
- [ ] 保存结构化的选择结果

---

### 3.4 文章组装（人的整合）

#### `/assemble` - 组装文章

**功能描述**：
基于选择的片段，组装成完整文章

**执行逻辑**：

```
1. 读取选择的片段
2. 读取观点和 brief
3. 提供两种模式:
   
   模式A: 手动组装
   - 用户拖拽片段排序
   - 添加过渡段落
   - 调整结构
   
   模式B: AI辅助组装
   - AI根据观点+片段生成框架
   - 用户审核、调整
   - 最终人工确认
```

**手动组装界面**（TUI）：
```
┌─ 文章组装 - Claude Code评测 ────────────────────────┐
│                                                        │
│ 观点: Claude Code的核心优势是上下文理解               │
│ 目标字数: 3000-3500                                   │
│                                                        │
├─ 可用片段（35个） ────────┬─ 文章框架 ───────────────┤
│                            │                          │
│ 🟢 #1.3 (87字) 真实数据    │ 1. 开头 (300字)          │
│    用了两周Claude Code...  │    [拖拽片段到这里]      │
│                            │                          │
│ 🟢 #2.7 (120字) 案例       │ 2. 核心观点 (500字)      │
│    某次重构项目中...       │    🟢 #1.3               │
│                            │    [添加过渡]            │
│ 🟡 #3.2 (95字) 数据        │                          │
│    根据测试结果...         │ 3. 深度对比 (1200字)     │
│                            │    🟢 #2.7               │
│ ... (更多片段)             │    🟡 #3.2               │
│                            │    [添加分析]            │
│                            │                          │
│                            │ 4. 结尾 (300字)          │
│                            │    [待添加]              │
├────────────────────────────┴──────────────────────────┤
│ 当前字数: 1500 / 3000-3500  进度: ████░░░░░░ 50%      │
│                                                        │
│ [Space] 选择/取消  [Enter] 添加  [Del] 删除           │
│ [↑↓] 移动光标  [Ctrl+S] 保存  [Ctrl+Q] 退出          │
└────────────────────────────────────────────────────────┘
```

**AI辅助组装**：
```
系统: 📝 基于你的观点和选择的35个片段，我建议以下框架：
      
      1. 开头 - 真实使用场景引入 (300字)
         建议使用: 片段 #1.3, #2.1
         过渡语: "两周前，我开始了这次对比测试"
         
      2. 核心观点阐述 (500字)
         建议使用: 片段 #1.3, #3.5, #4.2
         重点: 围绕"上下文理解准确30%"展开
         
      3. 深度对比测试 (1200字)
         建议使用: 片段 #2.7, #3.2, #5.1, #6.3
         结构: 3个场景 × 400字
         
      4. 数据总结 (600字)
         建议使用: 片段 #7.1, #8.3
         包含: 对比图表
         
      5. 结尾 - 推荐建议 (300字)
         建议使用: 片段 #9.2
         明确立场
      
      预计字数: 2900字（略低于目标，可补充）
      
      接受此框架? (yes/no/edit)
```

**输出文件** `articles/001-claude-code/draft.md`：
```markdown
# Claude Code评测 - 初稿

> 本文由 35 个精选片段组装而成
> 生成素材: 25000字 → 选择: 1300字 → 最终: 3200字
> AI辅助比例: 约 40%

---

## 开头

用了两周Claude Code，说实话，比Cursor好用不少。（片段 #1.3）

两周前，我开始了这次对比测试。（人工过渡）

...
```

**验收标准**：
- [ ] 支持手动组装（拖拽式TUI界面）
- [ ] 支持AI辅助组装（提供框架建议）
- [ ] 标注片段来源
- [ ] 实时字数统计
- [ ] 保存草稿版本

---

### 3.5 品味培养系统

#### `/taste-report` - 品味分析报告

**功能描述**：
分析用户的选择模式，生成品味报告

**数据收集**：
每次 `/select-fragments` 时记录：
- 选择了哪些片段（优质/可用/不用）
- 片段的AI检测分数
- 片段的特征（套话、真实细节、句式等）

**分析维度**：

1. **选择准确率**
   - 优质片段命中率（AI检测<30%的比例）
   - 拒绝AI套话的准确率
   - 真实细节识别能力

2. **品味特征**
   - 擅长识别：哪些AI痕迹识别最准
   - 需提升：哪些方面容易误判

3. **进步曲线**
   - 最近10篇的品味评分趋势
   - 对比初期和现在

4. **对比优秀作者**
   - 你的选择 vs 优秀作者的选择（相同素材）
   - 差距分析

**报告示例**：
```
┌─ 品味分析报告 ───────────────────────────────────────┐
│                                                        │
│ 用户: 小李                     写作时长: 6个月         │
│ 完成文章: 32篇                 品味等级: ⭐⭐⭐⭐☆      │
│                                                        │
├─ 选择准确率 ──────────────────────────────────────────┤
│                                                        │
│ 优质片段命中率:  85% ████████░░  (目标: >80%)  ✅      │
│ 拒绝AI套话:     92% █████████░  (目标: >85%)  ✅      │
│ 真实细节识别:    78% ███████░░░  (目标: >80%)  ⚠️      │
│                                                        │
├─ 品味特征 ────────────────────────────────────────────┤
│                                                        │
│ ✅ 擅长识别:                                            │
│    • AI套话 ("在当今..."、"值得注意的是")  准确率95%  │
│    • 书面词汇 ("显著提升"、"充分利用")    准确率90%  │
│    • AI句式 ("不仅...而且...")             准确率88%  │
│                                                        │
│ ⚠️ 需提升:                                              │
│    • 真实细节识别 (容易被"看似真实"迷惑)   准确率78%  │
│    • 节奏感把控 (长短句搭配)               准确率72%  │
│    • 情感真实度 (区分真情实感vs假大空)     准确率70%  │
│                                                        │
├─ 进步曲线 ────────────────────────────────────────────┤
│                                                        │
│  品味评分                                              │
│  100┤                                    ●             │
│   90┤                             ●   ●   ●          │
│   80┤                    ●   ●                        │
│   70┤           ●   ●                                 │
│   60┤      ●                                          │
│   50┤  ●                                              │
│   40┤                                                  │
│     └────┬────┬────┬────┬────┬────┬────┬─────        │
│         1月  2月  3月  4月  5月  6月  7月  现在        │
│                                                        │
│ 📈 趋势: 稳步提升，过去2个月进步明显                    │
│                                                        │
├─ 对比优秀作者 ────────────────────────────────────────┤
│                                                        │
│ 对比对象: 大师兄朱炫 (AI领域资深作者)                   │
│                                                        │
│ 相同素材测试（10组）:                                   │
│ - 你的选择与大师兄重合度: 68% ⚠️ (优秀: >75%)          │
│ - 大师兄选择但你忽略的优质片段: 12个                    │
│ - 你选择但大师兄拒绝的片段: 5个                        │
│                                                        │
│ 差距分析:                                              │
│ 1. 大师兄更善于发现"反常识"的表达                       │
│ 2. 你倾向选择"安全"的片段，冒险不足                    │
│ 3. 节奏感把控差距明显                                  │
│                                                        │
├─ 训练建议 ────────────────────────────────────────────┤
│                                                        │
│ 🎯 本周训练目标: 提升真实细节识别能力                   │
│                                                        │
│ 📚 推荐阅读 (5篇):                                      │
│ 1. 大师兄朱炫《AI降临之夜》- 真实细节运用典范           │
│ 2. 宝玉老师《编程1000小时》- 观点提炼典范             │
│ 3. ...                                                │
│                                                        │
│ 💪 品味挑战 (3个):                                      │
│ 1. 对比练习: 你的选择 vs 大师兄的选择（10组）           │
│ 2. 盲选测试: 从100个片段中选出10个优质的               │
│ 3. 改写练习: 把5个AI味重的片段改成真实的               │
│                                                        │
│ ⏱️ 预计完成时间: 本周内（3-4小时）                       │
│                                                        │
└────────────────────────────────────────────────────────┘

继续? [Enter] 查看详情  [q] 退出
```

**验收标准**：
- [ ] 准确计算选择准确率
- [ ] 识别品味特征（擅长+需提升）
- [ ] 展示进步曲线
- [ ] 提供对比分析
- [ ] 给出个性化训练建议

---

#### `/taste-challenge` - 品味挑战

**功能描述**：
通过对比练习、盲选测试等方式训练品味

**挑战类型**：

**1. 对比练习**
```
题目: 以下两个片段，哪个更好？

片段A:
"Claude Code通过深度学习算法，实现了对代码上下文的精准
理解，相比传统工具，其准确率提升了显著的幅度。"

片段B:
"用了两周Claude Code，代码补全准确率高很多。我测了30个
场景，Claude Code正确26个（87%），Cursor只有18个（60%）。"

你的选择: [A / B / 都不好]

> B

✅ 正确！大师兄朱炫也选择了B
   
理由:
- B有真实数据（30个场景、具体比例）
- B口语化（"用了两周"、"高很多"）
- A太书面（"精准理解"、"显著的幅度"）
- A没有具体数据

得分: +10分
```

**2. 盲选测试**
```
从以下10个片段中，选出3个最优质的:

1. "在当今AI技术飞速发展的时代..."  [选择]
2. "说实话，用Claude Code两周后..."  [选择]
3. "通过充分利用工具的能力..."      [选择]
...

提交答案

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 测试结果:

你的选择: 2, 5, 8
标准答案: 2, 5, 7

准确率: 66% (2/3)
排名: 前30%

分析:
✅ #2 - 正确，真实细节丰富
✅ #5 - 正确，口语化自然
❌ #8 - 错误，有轻微AI句式
   标准答案是 #7，因为...

得分: +15分
```

**3. 改写练习**
```
任务: 把以下AI味重的片段改写成真实的

原文:
"在使用过程中，我们发现Claude Code在代码补全方面表现出色，
不仅响应速度快，而且准确率高，显著提升了开发效率。"

你的改写:
> 用Claude Code写代码，最明显的是补全快。以前Cursor要等2-3秒，
> Claude Code基本秒出。而且准确，10次补全能对8-9次，Cursor只能对6次。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AI评分:

去AI化: 9/10 ✅ (删除了"显著提升"、"不仅...而且...")
真实性: 8/10 ✅ (加入了具体数字)
口语化: 9/10 ✅ ("最明显的是"、"基本秒出")

总评: 优秀改写！已接近专业水平。

建议: 可以再加一句个人感受，如"现在再也不想换回Cursor了"

得分: +20分
```

**积分系统**：
- 对比练习: +10分/题
- 盲选测试: +15分/题
- 改写练习: +20分/题
- 连续正确: 额外奖励

**等级系统**：
```
Lv1 新手作者    0-100分
Lv2 入门作者    100-300分
Lv3 熟练作者    300-600分
Lv4 资深作者    600-1000分
Lv5 专家作者    1000-2000分
Lv6 大师作者    2000+分
```

**验收标准**：
- [ ] 3种挑战类型可用
- [ ] 题库至少100道
- [ ] 积分系统运行正常
- [ ] 提供详细的错误分析
- [ ] 支持进度保存

---

## 四、技术方案

### 4.1 多版本生成实现

**方案A: 串行生成（稳定）**
```typescript
// src/commands/generate-materials.ts

interface GenerationOptions {
  versions: number;        // 版本数量
  words: number;           // 每版本字数
  styles?: string[];       // 风格列表
  parallel?: boolean;      // 是否并行
}

async function generateMaterials(options: GenerationOptions) {
  const { versions, words, styles, parallel } = options;
  
  // 读取观点和 brief
  const viewpoint = await readViewpoint();
  const brief = await readBrief();
  
  const results = [];
  
  if (parallel) {
    // 并行生成（更快，消耗更多token）
    const promises = [];
    for (let i = 0; i < versions; i++) {
      const style = styles?.[i] || getRandomStyle();
      promises.push(generateVersion(viewpoint, brief, style, words));
    }
    results = await Promise.all(promises);
  } else {
    // 串行生成（稳定）
    for (let i = 0; i < versions; i++) {
      const style = styles?.[i] || getRandomStyle();
      const version = await generateVersion(viewpoint, brief, style, words);
      results.push(version);
      
      // 显示进度
      showProgress(i + 1, versions);
    }
  }
  
  // 保存所有版本
  await saveMaterials(results);
  
  return results;
}

async function generateVersion(
  viewpoint: string,
  brief: Brief,
  style: string,
  words: number
) {
  const prompt = `
你是一个${style}风格的内容生成器。

核心观点（灵魂，必须围绕展开）:
${viewpoint}

Brief:
${brief.content}

要求:
1. 严格围绕核心观点展开
2. 字数: ${words}字
3. 风格: ${style}
4. 生成完整内容，包含:
   - 开头、中间论证、结尾
   - 尽可能详细和丰富
   - 提供多种表达方式和案例

注意: 这是素材生成，不是最终文章。请大胆尝试不同表达。
`;

  const response = await callAI(prompt);
  
  return {
    id: generateId(),
    style,
    content: response,
    words: countWords(response),
    generated_at: new Date(),
  };
}
```

**方案B: 使用不同AI模型生成（多样性更高）**
```typescript
const models = [
  'gemini-2.0-flash-exp',
  'claude-3-5-sonnet',
  'gpt-4-turbo',
  'claude-3-5-haiku',
  'gpt-4o-mini',
];

for (let i = 0; i < versions; i++) {
  const model = models[i % models.length];
  const version = await generateVersionWithModel(model, ...);
  results.push(version);
}
```

---

### 4.2 片段选择实现

**TUI 库选择**: `blessed` 或 `ink`（React-based TUI）

**选择 ink 的原因**:
- React 组件式开发，易维护
- 丰富的组件生态
- 支持复杂交互

**核心组件**:
```tsx
// src/commands/select-fragments/SelectionUI.tsx

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

interface Fragment {
  id: string;
  version: string;
  paragraph: number;
  content: string;
  words: number;
  aiScore: number;
  features: string[];
}

export function SelectionUI({ fragments }: { fragments: Fragment[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<Map<string, 'good' | 'ok' | 'bad'>>(new Map());
  
  const current = fragments[currentIndex];
  
  useInput((input, key) => {
    if (input === 'g') {
      selections.set(current.id, 'good');
      setCurrentIndex(i => Math.min(i + 1, fragments.length - 1));
    } else if (input === 'o') {
      selections.set(current.id, 'ok');
      setCurrentIndex(i => Math.min(i + 1, fragments.length - 1));
    } else if (input === 'b') {
      selections.set(current.id, 'bad');
      setCurrentIndex(i => Math.min(i + 1, fragments.length - 1));
    } else if (input === 's') {
      setCurrentIndex(i => Math.min(i + 1, fragments.length - 1));
    } else if (key.upArrow) {
      setCurrentIndex(i => Math.max(i - 1, 0));
    } else if (key.downArrow) {
      setCurrentIndex(i => Math.min(i + 1, fragments.length - 1));
    }
  });
  
  return (
    <Box flexDirection="column">
      <Box borderStyle="single" paddingX={2}>
        <Text bold>
          片段选择 - 第 {currentIndex + 1} / {fragments.length}
        </Text>
      </Box>
      
      <Box marginTop={1} borderStyle="single" paddingX={2} paddingY={1}>
        <Text>{current.content}</Text>
      </Box>
      
      <Box marginTop={1}>
        <Text>
          📊 分析: {current.words}字 | AI检测: {current.aiScore}% | 特征: {current.features.join(', ')}
        </Text>
      </Box>
      
      <Box marginTop={1}>
        <Text color="green">[g] 优质</Text>
        <Text>  </Text>
        <Text color="yellow">[o] 可用</Text>
        <Text>  </Text>
        <Text color="red">[b] 不用</Text>
        <Text>  </Text>
        <Text color="gray">[s] 跳过</Text>
      </Box>
      
      <Box marginTop={1} borderStyle="single" paddingX={2}>
        <Text>
          优质: {countSelections('good')} | 可用: {countSelections('ok')} | 不用: {countSelections('bad')}
        </Text>
      </Box>
    </Box>
  );
}
```

---

### 4.3 品味分析实现

**数据收集**:
```typescript
// src/services/taste-tracker.ts

interface SelectionRecord {
  articleId: string;
  fragmentId: string;
  userChoice: 'good' | 'ok' | 'bad' | 'skip';
  fragmentFeatures: {
    aiScore: number;
    hasRealDetails: boolean;
    hasClichés: boolean;
    isOralStyle: boolean;
    sentenceLength: number;
  };
  timestamp: Date;
}

class TasteTracker {
  private db: Database; // SQLite
  
  async recordSelection(record: SelectionRecord) {
    await this.db.insert('selection_records', record);
  }
  
  async analyzeUserTaste(userId: string): Promise<TasteReport> {
    // 查询最近 50 次选择
    const records = await this.db.query(`
      SELECT * FROM selection_records
      WHERE user_id = ?
      ORDER BY timestamp DESC
      LIMIT 50
    `, [userId]);
    
    // 计算准确率
    const goodChoices = records.filter(r => r.userChoice === 'good');
    const hitRate = goodChoices.filter(r => r.fragmentFeatures.aiScore < 30).length / goodChoices.length;
    
    // 识别特征
    const rejectClichés = records.filter(r => 
      r.userChoice === 'bad' && r.fragmentFeatures.hasClichés
    ).length / records.filter(r => r.fragmentFeatures.hasClichés).length;
    
    // ...更多分析
    
    return {
      hitRate,
      rejectClichés,
      // ...
    };
  }
}
```

---

### 4.4 数据库设计

**使用 SQLite**（轻量级，无需额外服务）

```sql
-- 用户表
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  created_at DATETIME
);

-- 文章表
CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT,
  viewpoint TEXT,
  user_id TEXT,
  created_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 生成版本表
CREATE TABLE generated_versions (
  id TEXT PRIMARY KEY,
  article_id TEXT,
  version_number INTEGER,
  style TEXT,
  content TEXT,
  words INTEGER,
  model TEXT,
  generated_at DATETIME,
  FOREIGN KEY (article_id) REFERENCES articles(id)
);

-- 片段表
CREATE TABLE fragments (
  id TEXT PRIMARY KEY,
  version_id TEXT,
  paragraph_number INTEGER,
  content TEXT,
  words INTEGER,
  ai_score REAL,              -- AI检测分数
  has_clichés BOOLEAN,        -- 是否有套话
  has_real_details BOOLEAN,   -- 是否有真实细节
  is_oral_style BOOLEAN,      -- 是否口语化
  sentence_length_avg REAL,   -- 平均句长
  FOREIGN KEY (version_id) REFERENCES generated_versions(id)
);

-- 选择记录表
CREATE TABLE selection_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  article_id TEXT,
  fragment_id TEXT,
  user_choice TEXT,           -- 'good' | 'ok' | 'bad' | 'skip'
  timestamp DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (fragment_id) REFERENCES fragments(id)
);

-- 品味分数表
CREATE TABLE taste_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  date DATE,
  hit_rate REAL,              -- 优质片段命中率
  reject_clichés_rate REAL,   -- 拒绝套话准确率
  real_details_rate REAL,     -- 真实细节识别率
  overall_score REAL,         -- 综合评分
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 挑战记录表
CREATE TABLE challenge_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  challenge_type TEXT,        -- 'comparison' | 'blind' | 'rewrite'
  question_id TEXT,
  user_answer TEXT,
  correct_answer TEXT,
  is_correct BOOLEAN,
  points INTEGER,
  timestamp DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 索引
CREATE INDEX idx_selection_records_user ON selection_records(user_id);
CREATE INDEX idx_selection_records_article ON selection_records(article_id);
CREATE INDEX idx_taste_scores_user ON taste_scores(user_id);
CREATE INDEX idx_challenge_records_user ON challenge_records(user_id);
```

---

## 五、用户界面设计

### 5.1 命令行参数

```bash
# 提炼观点
/extract-viewpoint [brief路径]

# 生成素材
/generate-materials [选项]
  --versions <数量>      版本数（默认：3）
  --words <字数>         每版本字数（默认：5000）
  --styles <风格列表>    指定风格（逗号分隔）
  --parallel             并行生成
  --model <模型>         指定AI模型

# 选择片段
/select-fragments [选项]
  --article <ID>         文章ID（默认：最新）
  --filter <过滤器>      过滤条件（如：--filter ai_score<30）
  --resume               继续上次选择

# 组装文章
/assemble [选项]
  --mode <模式>          'manual' | 'ai-assist'（默认：manual）
  --article <ID>         文章ID

# 品味报告
/taste-report [选项]
  --period <时期>        分析时期（如：--period 30days）
  --compare <用户>       对比其他用户

# 品味挑战
/taste-challenge [选项]
  --type <类型>          挑战类型（comparison/blind/rewrite）
  --level <难度>         难度等级（1-5）
```

---

### 5.2 交互流程图

```
┌─────────────────┐
│  /specify       │
│  定义需求       │
└────────┬────────┘
         ↓
┌─────────────────┐
│  /extract-      │  ⭐ 新增
│   viewpoint     │
│  提炼观点       │
└────────┬────────┘
         ↓
┌─────────────────┐
│  /research      │
│  信息搜索       │
└────────┬────────┘
         ↓
┌─────────────────┐
│  /collect       │
│  搜索素材       │
└────────┬────────┘
         ↓
┌─────────────────┐
│  /generate-     │  ⭐ 取代 /write
│   materials     │
│  生成3-5个版本  │
│  (15000-25000字)│
└────────┬────────┘
         ↓
┌─────────────────┐
│  /select-       │  ⭐ 新增（品味核心）
│   fragments     │
│  逐个标记片段   │
│  (几百字优质)   │
└────────┬────────┘
         ↓
┌─────────────────┐
│  /assemble      │  ⭐ 新增
│  组装文章       │
│  (2000-3500字)  │
└────────┬────────┘
         ↓
┌─────────────────┐
│  /review        │
│  三遍审校       │
└────────┬────────┘
         ↓
┌─────────────────┐
│  /images        │
│  配图           │
└────────┬────────┘
         ↓
┌─────────────────┐
│  发布           │
└─────────────────┘

同时：
┌─────────────────┐
│  /taste-report  │  ⭐ 品味培养
│  查看品味分析   │
└─────────────────┘

┌─────────────────┐
│  /taste-        │  ⭐ 品味训练
│   challenge     │
│  完成挑战训练   │
└─────────────────┘
```

---

## 六、验收标准

### 6.1 功能验收

#### P0 - 必须完成

- [ ] `/extract-viewpoint` 可用，强制用户提炼观点
- [ ] `/generate-materials` 可生成 3-5 个版本
- [ ] 总生成量可达 15000-25000 字
- [ ] `/select-fragments` TUI 界面可用
- [ ] 支持标记 优质/可用/不用
- [ ] 选择结果保存为结构化文件
- [ ] `/assemble` 手动组装模式可用
- [ ] 组装时可插入片段和过渡段
- [ ] 最终文章标注 AI 辅助比例

#### P1 - 应该完成

- [ ] `/generate-materials` 支持指定风格
- [ ] 支持并行生成（加速）
- [ ] `/select-fragments` 提供片段分析
- [ ] 支持撤销、搜索、保存进度
- [ ] `/assemble` AI 辅助模式可用
- [ ] `/taste-report` 基础报告可用
- [ ] 显示选择准确率、品味特征

#### P2 - 可选

- [ ] `/taste-challenge` 全部 3 种挑战类型
- [ ] 对比优秀作者功能
- [ ] 积分和等级系统
- [ ] 多模型生成支持

---

### 6.2 体验验收

#### 核心体验指标

**1. 品味体现度**
- [ ] 用户能明显感受到"选择权在我"
- [ ] 用户完成选择后有"这是我的判断"的感觉
- [ ] 对比前后，用户认同"品味提升"

**2. 工作流自然度**
- [ ] 从观点提炼到成文，流程连贯
- [ ] 每一步都知道为什么这么做
- [ ] 没有"AI越俎代庖"的感觉

**3. 效率提升**
- [ ] 相比纯人工，节省 30%-50% 时间
- [ ] 相比纯 AI 生成，质量提升明显（AI 检测率降低 20%+）

---

### 6.3 真实用户验证

**验证方法**：

1. **对比测试**
   - 用户 A：用新工作流写 3 篇文章
   - 用户 B：用旧工作流写 3 篇文章
   - 对比：AI 检测率、真实感、用户满意度

2. **品味提升测试**
   - 用户完成 10 篇文章
   - 对比第 1 篇和第 10 篇的选择准确率
   - 预期：准确率提升 10%-20%

3. **定性访谈**
   - 询问用户：感觉 AI 是助手还是主导？
   - 询问用户：是否感觉品味有提升？
   - 询问用户：会推荐给朋友吗？

**成功标准**：
- [ ] 70% 用户认为"AI 是助手，我是主导"
- [ ] 60% 用户感觉品味有提升
- [ ] 80% 用户愿意推荐给朋友
- [ ] AI 检测率平均 < 35%（对比旧方法 50%+）

---

## 七、开发排期

### Phase 1: 核心功能（5天）

**Day 1-2: 多版本生成**
- [ ] 实现 `/generate-materials` 命令
- [ ] 支持串行生成 3-5 个版本
- [ ] 保存到结构化目录
- [ ] 编写测试

**Day 3-4: 片段选择**
- [ ] 实现 `/select-fragments` TUI
- [ ] 支持标记 优质/可用/不用
- [ ] 保存选择结果
- [ ] 编写测试

**Day 5: 文章组装**
- [ ] 实现 `/assemble` 手动模式
- [ ] 支持插入片段
- [ ] 生成最终文章
- [ ] 编写测试

### Phase 2: 品味培养（2天）

**Day 6: 品味报告**
- [ ] 数据库设计和初始化
- [ ] 实现选择记录收集
- [ ] 实现 `/taste-report` 基础报告

**Day 7: 品味挑战**
- [ ] 实现对比练习
- [ ] 实现盲选测试
- [ ] 题库准备（50 道）

### Phase 3: 测试和优化（1-2天）

**Day 8: 完整流程测试**
- [ ] 真实文章测试（5 篇）
- [ ] 用户体验测试
- [ ] Bug 修复

---

## 八、风险和依赖

### 8.1 技术风险

**风险1: 多版本生成成本高**
- **描述**: 生成 5 个版本×5000 字，token 消耗大
- **影响**: P0（成本问题）
- **缓解措施**:
  - 支持选择版本数（3-5 可调）
  - 支持选择模型（便宜模型：Gemini Flash）
  - 提供成本预估
- **替代方案**: 生成更短的版本（3000 字），总量 15000 字

**风险2: TUI 开发复杂度**
- **描述**: `ink` 学习曲线，调试困难
- **影响**: P1（体验问题）
- **缓解措施**:
  - 先实现简单版本（纯文本交互）
  - 逐步升级到 TUI
- **替代方案**: 使用 Web 界面（Electron）

**风险3: 片段分析准确性**
- **描述**: AI 检测分数、特征识别可能不准
- **影响**: P1（辅助功能）
- **缓解措施**:
  - 基于规则+AI 评分结合
  - 允许用户标注"分析错误"
  - 持续优化算法

### 8.2 产品风险

**风险1: 用户不愿意做选择**
- **描述**: 用户可能觉得"选择太费时间"，宁愿让 AI 直接生成
- **影响**: P0（核心价值）
- **缓解措施**:
  - 强调品味的重要性（教育）
  - 提供快速模式（AI 自动筛选 + 人工审核）
  - 显示品味提升效果
- **验证方法**: 早期用户测试，观察是否愿意完成选择

**风险2: 学习曲线过陡**
- **描述**: 新增命令多，用户可能不理解
- **影响**: P1（用户体验）
- **缓解措施**:
  - 详细文档和教程
  - 交互式引导
  - 提供模板流程

### 8.3 依赖

**外部依赖**:
- [ ] AI API（Gemini、Claude、GPT）
- [ ] `ink` 库（TUI）
- [ ] SQLite（数据库）

**内部依赖**:
- [ ] 现有 `/write` 命令逻辑可复用
- [ ] 现有 `/review` 审校规则
- [ ] 现有 brief 和 materials 系统

---

## 九、后续迭代方向

### V2.0 功能

1. **AI 自动预筛选**
   - AI 先筛选出优质片段候选
   - 用户只需审核，减少工作量

2. **协作品味库**
   - 多用户共享优秀片段
   - 学习其他人的选择

3. **品味风格定制**
   - 用户定义自己的品味标准
   - 系统自动应用

4. **Web 界面**
   - 更丰富的交互
   - 可视化品味曲线

---

## 十、总结

本 PRD 基于用户真实工作流，重新定义了 Article Writer 的核心价值：

**从"让 AI 写文章"转向"帮用户建立品味，用 AI 放大品味"**

核心改进：
1. ⭐ **多版本生成** - 生成几万字素材供选择
2. ⭐ **片段选择系统** - 体现品味的关键环节
3. ⭐ **品味培养机制** - 让用户在使用中提升品味
4. ⭐ **观点驱动** - 强调观点是灵魂

**这些改进将让系统真正成为"AI 辅助创作"的标杆产品，而不仅仅是一个"AI 生成工具"。**

---

**下一步**：进入开发阶段，按照 Phase 1 → Phase 2 → Phase 3 的顺序实施。

