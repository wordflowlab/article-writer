# Article Writer - 基于 novel-writer 的智能写作系统

> 从 novel-writer 分支,专注于公众号/自媒体文章创作的智能写作助手

## 项目定位

**Article Writer** 是 novel-writer 的分支版本,保留其成熟的斜杠命令架构和插件系统,但将核心流程从"小说创作"改造为"文章写作",特别针对:
- 📱 公众号文章写作
- 🎬 视频脚本创作
- ✍️ 通用内容创作

## 核心特性

### 1. 两层判断机制
- **第一层:工作区判断** - 自动识别公众号/视频/通用工作区
- **第二层:任务类型识别** - 区分新写作/修改/审校/咨询

### 2. 九步写作流程
1. **理解需求** - 保存brief到 `_briefs/`
2. **信息搜索** ⭐ - 多渠道调研,保存到 `_knowledge_base/`
3. **选题讨论** ⭐ - 提供3-4个方向,等待用户选择
4. **协作文档** - 测试任务/配图需求清单
5. **风格学习** - 分析个人写作风格
5.5. **素材搜索** ⭐ - 从即刻动态/历史文章提取真实素材
6. **创作初稿** - 基于真实数据写作
7.5. **风格转换** - 实验性功能,可选
8. **三遍审校** ⭐ - 内容/风格/细节三模式降AI味
9. **文章配图** ⭐ - 自动生成/获取图片

标记 ⭐ 的为核心创新功能

### 3. 个人素材库
- **原始数据导入** - 支持即刻/微博CSV导出
- **主题索引管理** - 手动整理常用主题素材
- **智能搜索引用** - AI用Grep搜索真实经历和观点

### 4. 反AI检测
- **三遍审校机制** - 系统化降低AI检测率(目标<30%)
- **朱雀标准内置** - 基于实测0% AI浓度的写作规范
- **对比式修改** - 提供 ❌AI化 vs ✅自然化 对比

## 技术架构

### 继承自 novel-writer
- ✅ CLI初始化系统 (`content init`)
- ✅ 斜杠命令注入(支持13个AI平台)
- ✅ 插件系统 (PluginManager)
- ✅ 文件结构管理 (`.specify/`、配置生成)
- ✅ 反AI检测规范 (`anti-ai-detection.md`)

### 核心改造
| 模块 | novel-writer | article-writer |
|------|-------------|----------------|
| **内容目录** | `stories/` (小说章节) | `workspaces/` (工作区管理) |
| **核心流程** | 七步方法论(规划导向) | 九步流程(协作导向) |
| **追踪系统** | 角色/情节追踪 | 素材库管理 |
| **质量控制** | 一致性验证 | 三遍审校降AI味 |
| **预设模板** | 六种写作方法 | 工作区模板(公众号/视频/通用) |

## 目录结构

```
my-article/
├── .specify/                # 配置与脚本
│   ├── memory/
│   │   ├── constitution.md       # 写作原则
│   │   ├── style-reference.md    # 风格参考
│   │   └── personal-voice.md     # 个人语料
│   ├── scripts/                  # 支持脚本
│   └── templates/                # 命令模板
│
├── .claude/commands/        # AI平台命令
├── .cursor/commands/
├── .gemini/commands/
│   ... (支持13个平台)
│
├── workspaces/              # 工作区
│   ├── wechat/              # 公众号工作区
│   │   ├── CLAUDE.md        # 工作区规则
│   │   ├── _briefs/         # 需求文档
│   │   ├── _协作文档/        # 测试任务、配图需求
│   │   └── articles/        # 文章输出
│   │       └── 001-文章主题/
│   │           ├── specification.md
│   │           ├── tasks.md
│   │           ├── draft.md
│   │           ├── final.md
│   │           └── images/
│   ├── video/               # 视频工作区
│   └── general/             # 通用工作区
│
├── materials/               # 个人素材库 ⭐
│   ├── raw/                 # 原始数据
│   │   ├── jike-all.csv     # 即刻动态导出
│   │   └── weibo-posts.json
│   ├── indexed/             # 主题索引
│   │   ├── ai-tools.md
│   │   ├── product-dev.md
│   │   └── personal-views.md
│   └── archive/             # 历史文章存档
│
├── _knowledge_base/         # 调研结果 ⭐
│   └── 主题-2025-01-15.md
│
└── spec/                    # 写作规范
    ├── presets/
    │   ├── anti-ai-detection.md
    │   ├── audit-checklist.md
    │   └── workspace-templates/
    └── config.json
```

## 核心命令

### 九步流程命令

| 命令 | 描述 | 来源 |
|-----|------|------|
| `/brief-save` | 理解需求并保存brief | 改造 `/specify` |
| `/research` | 信息搜索与知识管理 | **新增** |
| `/topic-discuss` | 选题讨论(3-4个方向) | 改造 `/clarify` |
| `/collab-doc` | 创建协作文档 | 改造 `/tasks` |
| `/style-learn` | 学习个人风格 | 改造 `/constitution` |
| `/materials-search` | 搜索个人素材库 | **新增** |
| `/write-draft` | 创作初稿 | 改造 `/write` |
| `/style-transform` | 风格转换实验 | **新增** (可选) |
| `/audit` | 三遍审校机制 | 扩展 `/analyze` |
| `/images` | 文章配图 | **新增** |

### 工作区管理命令

| 命令 | 描述 |
|-----|------|
| `/workspace-init` | 初始化工作区(选择类型) |
| `/workspace-switch` | 切换工作区 |
| `/workspace-config` | 查看/编辑工作区配置 |

### 素材管理命令

| 命令 | 描述 |
|-----|------|
| `/materials-init` | 初始化素材库 |
| `/materials-import` | 导入CSV/JSON数据 |
| `/materials-index` | 建立主题索引 |

## 插件系统

### 内置插件
1. **authentic-voice** (继承) - 个人语料管理
2. **materials-manager** (新增) - 素材库管理
3. **image-generator** (新增) - 配图生成
4. **research-assistant** (新增) - 信息搜索助手

### 插件安装
```bash
content plugins add materials-manager
content plugins add image-generator
```

## 开发路线图

### 阶段1: 基础架构 (1-2周)
- [ ] Fork novel-writer仓库
- [ ] 重命名项目为 content-writer
- [ ] 调整CLI命令 (`content init`)
- [ ] 重构目录结构
- [ ] 移除小说特定代码

### 阶段2: 核心命令 (2-3周)
- [ ] `/research` - 信息搜索
- [ ] `/topic-discuss` - 选题讨论
- [ ] `/materials-search` - 素材搜索
- [ ] `/audit` - 三遍审校(三种模式)
- [ ] `/images` - 文章配图

### 阶段3: 工作区系统 (1周)
- [ ] 工作区判断逻辑
- [ ] 公众号/视频/通用模板

### 阶段4: 插件开发 (1-2周)
- [ ] materials-manager插件
- [ ] image-generator插件
- [ ] research-assistant插件

### 阶段5: 测试与文档 (1周)
- [ ] 完整流程测试
- [ ] 使用文档
- [ ] 最佳实践案例

**总计: 6-9周完成MVP**

## 可行性评估

### ✅ 高度可行

**架构契合度:**
- 斜杠命令系统: 90% 复用
- 工作流引擎: 85% 复用
- 插件系统: 100% 复用
- 反AI检测规范: 75% 复用

**核心差异点:**
- 内容类型: 小说章节 → 文章(独立短篇)
- 流程重心: 规划导向 → 协作导向
- 质量控制: 一致性验证 → 降AI味审校
- 素材管理: 角色追踪 → 个人动态库

**开发成本:**
- 从零开发: 3-6个月
- 基于novel-writer: 6-9周 ✅
- 成本节省: 50-70%

## 关键创新点

### 1. 个人素材库系统
不同于传统AI写作"完全生成",通过搜索用户的真实经历(即刻动态、历史文章)并融入新文章,实现:
- **真实性** - 案例、观点都是真实的
- **个性化** - 文风、态度符合本人
- **降AI味** - 真实细节替代AI编造

### 2. 选题讨论机制
AI不直接生成文章,而是先提供3-4个选题方向:
- 每个方向含标题、角度、大纲、工作量评估
- 用户选择后再执行,避免方向错误
- 增强协作感和掌控感

### 3. 三遍审校机制
系统化降低AI检测率(目标<30%):
- **第一遍(内容)**: 事实、逻辑、结构
- **第二遍(风格)**: 删套话、拆AI句式、加真实细节
- **第三遍(细节)**: 标点、排版、节奏

### 4. 工作区隔离
不同内容类型(公众号/视频)有不同规则:
- 公众号: 需配图、重降AI味、段落短小
- 视频: 口语化、节奏感、分镜说明
- 通用: 灵活配置

## 与 novel-writer 项目矩阵的关系

```
WordFlowLab 项目矩阵:

方法论探索系列:
  Novel-Writer ──┬─→ Novel-Writer-Skills (Claude专版)
                 ├─→ Novel-Writer-OpenSpec (OpenSpec方法论)
                 └─→ Article-Writer (自媒体写作分支) ⭐ 新增

工具实现系列:
  WriteFlow (CLI独立版)
  NovelWeave (VSCode扩展)
```

**Article-Writer 定位:**
- 与 Novel-Writer 并列的分支版本
- 保留核心架构,替换领域逻辑
- 证明 Spec-Kit 方法论在内容创作领域的通用性

## 预期价值

### 对用户
- ✅ 2-3倍写作效率提升
- ✅ AI检测率降至30%以下
- ✅ 保持个人风格和真实性
- ✅ 系统化的质量保障

### 对项目
- ✅ 扩展 novel-writer 使用场景
- ✅ 验证 Spec-Kit 方法论通用性
- ✅ 吸引自媒体创作者用户群
- ✅ 形成完整的内容创作工具矩阵

## 下一步行动

如果决定执行:

1. **创建仓库** - Fork novel-writer 或新建 article-writer 仓库
2. **制定详细计划** - 分解到每周任务和里程碑
3. **优先开发P0功能** - 验证核心流程可行性
4. **早期测试** - 用真实写作任务迭代优化

**预估资源:**
- 1个全职开发者
- 创始人参与测试和反馈
- 2-3个月完成可用版本

## 参考文档

- [详细技术方案](./technical-design.md)
- [核心命令设计](./commands-design.md)
- [个人素材库实现](./materials-system.md)
- [三遍审校机制](./audit-mechanism.md)
- [工作区系统设计](./workspace-system.md)

---

**结论: 基于 novel-writer 开发 Article Writer 不仅可行,而且是高效且有价值的选择。建议尽快启动原型验证!**
