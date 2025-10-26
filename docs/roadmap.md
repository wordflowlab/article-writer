# Article Writer - 开发路线图

## 项目里程碑

```
阶段1      阶段2        阶段3      阶段4       阶段5
基础架构    核心命令     工作区系统   插件开发     测试发布
(1-2周)    (2-3周)     (1周)      (1-2周)     (1周)
   |          |           |          |           |
   ▼          ▼           ▼          ▼           ▼
 Fork      P0命令      工作区判断   3个插件    完整测试
 重构      开发完成     模板完成    开发完成    用户文档
 CLI改造
```

**总工期: 6-9周 (MVP版本)**

---

## 阶段1: 基础架构搭建 (1-2周)

### Week 1: 仓库准备与CLI改造

**任务清单:**
- [x] Fork novel-writer仓库
- [ ] 创建 `article-writer` 分支
- [ ] 重命名项目
  - [ ] package.json: `article-writer-cn`
  - [ ] CLI命令: `novel` → `content`
  - [ ] 显示文本: "Novel Writer" → "Article Writer"
- [ ] 清理小说特定代码
  - [ ] 删除追踪系统(plot-tracker, relationships等)
  - [ ] 删除六种写作方法预设
  - [ ] 保留核心架构(CLI、插件、命令生成)
- [ ] 重构目录结构
  - [ ] `stories/` → `workspaces/`
  - [ ] 新增 `materials/`、`_knowledge_base/`、`_briefs/`
  - [ ] 更新 `spec/` 结构

**测试标准:**
```bash
✅ content init test-project 成功运行
✅ 生成正确的目录结构(workspaces/materials等)
✅ 命令生成脚本正常工作(13个平台)
```

**预计工作量:** 5天

---

### Week 2: 核心配置文件改造

**任务清单:**
- [ ] 改造根目录 CLAUDE.md
  - [ ] 工作区路由逻辑
  - [ ] 任务类型判断提示
- [ ] 创建工作区模板
  - [ ] `templates/workspaces/wechat.yaml`
  - [ ] `templates/workspaces/video.yaml`
  - [ ] `templates/workspaces/general.yaml`
- [ ] 改造 memory 文件
  - [ ] `constitution.md` → 写作原则
  - [ ] 删除小说特定内容
- [ ] 更新 spec/presets/
  - [ ] 保留 `anti-ai-detection.md`
  - [ ] 新增 `audit-checklist.md`

**测试标准:**
```bash
✅ content init my-article --workspace wechat 创建公众号工作区
✅ 工作区CLAUDE.md正确加载
✅ 任务类型判断提示词准确
```

**预计工作量:** 5天

---

## 阶段2: 核心命令开发 (2-3周)

### Week 3-4: P0命令开发

**优先级P0命令**(关键路径):
1. `/specify` (1天)
2. `/research` (3天) ⭐
3. `/topic` (2天)
4. `/collect` (2天) ⭐
5. `/write` (2天)

**开发顺序:**

#### Day 1-2: `/specify`
```markdown
任务:
- [ ] 编写命令模板 `templates/commands/specify.md`
- [ ] 创建支持脚本 `scripts/bash/init-brief.sh`
- [ ] 实现brief标准格式
- [ ] 测试: 从用户描述生成brief

测试用例:
✅ 用户输入需求 → 生成brief.md
✅ 上传文件 → 解析生成brief.md
✅ brief保存到 _briefs/ 目录
✅ 自动创建项目目录结构
```

#### Day 3-5: `/research` ⭐ (关键)
```markdown
任务:
- [ ] 编写命令模板 `templates/commands/research.md`
- [ ] 实现信息源优先级逻辑
- [ ] 集成 WebSearch/WebFetch
- [ ] 实现知识库保存格式
- [ ] 创建支持脚本 `scripts/bash/check-network.sh`

测试用例:
✅ 搜索新产品(Claude Code) → 获取官方信息
✅ 搜索技术概念 → 多渠道验证
✅ 保存到 _knowledge_base/主题-日期.md
✅ 元信息完整(时间、来源、可信度)
✅ 缓存检查 - 避免重复搜索
```

#### Day 6-7: `/topic`
```markdown
任务:
- [ ] 编写命令模板 `templates/commands/topic.md`
- [ ] 实现选题生成逻辑
- [ ] 设计选题格式(标题/角度/大纲)
- [ ] 实现"等待用户选择"机制

测试用例:
✅ 读取brief+调研 → 生成3-4个选题
✅ 每个选题包含完整信息(大纲/工作量/优劣势)
✅ 不会自动选择,等待用户确认
✅ 用户选择后继续流程
```

#### Day 8-9: `/collect` ⭐ (关键)
```markdown
任务:
- [ ] 编写命令模板 `templates/commands/collect.md`
- [ ] 实现CSV搜索逻辑(Grep)
- [ ] 实现主题索引读取(Read)
- [ ] 创建素材展示格式
- [ ] 实现改写融入机制

测试用例:
✅ 从CSV搜索关键词 → 返回匹配动态
✅ 从indexed/读取主题素材
✅ 展示素材并说明使用场景
✅ 提供改写示例(禁止直接复制)
```

#### Day 10-11: `/write`
```markdown
任务:
- [ ] 改造 `/write` 命令模板
- [ ] 调整查询协议顺序(constitution → brief → materials)
- [ ] 移除小说特定内容(角色追踪等)
- [ ] 保留反AI检测规范引用

测试用例:
✅ 读取全部上下文(brief/knowledge/materials)
✅ 基于真实数据写作
✅ 符合anti-ai-detection规范
✅ 输出到 articles/*/draft.md
```

---

### Week 5: P0命令 - `/review` (4天)

**最重要的命令,需要重点打磨**

```markdown
任务:
- [ ] 扩展 `/analyze` 命令为三模式
- [ ] 实现 content 模式(事实/逻辑验证)
- [ ] 实现 style 模式(降AI味核心) ⭐⭐⭐
  - [ ] 内置8大类套话库
  - [ ] AI句式识别规则
  - [ ] 200+书面词汇替换库
  - [ ] 对比输出格式
- [ ] 实现 detail 模式(句长/段长/标点优化)
- [ ] 实现 all 模式(依次执行三遍)

测试用例:
✅ content模式 - 发现事实错误/逻辑矛盾
✅ style模式 - 识别并替换AI套话
✅ style模式 - 输出对比格式(❌原文 → ✅改后)
✅ detail模式 - 统计句长/段长并给出优化建议
✅ all模式 - 三遍审校降低AI检测率到30%以下
```

**关键难点:**
- AI套话库的完整性(需要收集真实案例)
- 句式识别的准确性(避免误判)
- 对比输出的可读性(清晰展示修改点)

---

## 阶段3: 工作区系统 (1周)

### Week 6: 工作区判断与模板

**任务清单:**
- [ ] 实现工作区检测逻辑
  - [ ] 根目录CLAUDE.md - 工作区路由
  - [ ] 检测当前目录位置(pwd)
  - [ ] 动态加载工作区配置
- [ ] 创建公众号工作区模板
  - [ ] `workspaces/wechat/CLAUDE.md`
  - [ ] 配图需求、降AI味要求
  - [ ] 任务类型判断逻辑
- [ ] 创建视频工作区模板
  - [ ] `workspaces/video/CLAUDE.md`
  - [ ] 口播时长、口语化要求
  - [ ] 分镜说明(替代配图)
- [ ] 创建通用工作区模板
  - [ ] `workspaces/general/CLAUDE.md`
  - [ ] 灵活配置

**测试用例:**
```bash
✅ 在根目录运行命令 → 询问选择工作区
✅ 在 workspaces/wechat/ → 自动加载公众号配置
✅ 在 workspaces/video/ → 自动加载视频配置
✅ 不同工作区执行不同流程(公众号需配图,视频不需要)
```

**预计工作量:** 5天

---

## 阶段4: 插件开发 (1-2周)

### Week 7: materials-manager 插件

**任务清单:**
- [ ] 创建插件目录结构
  ```
  plugins/materials-manager/
  ├── config.yaml
  ├── commands/
  │   ├── materials-init.md
  │   ├── materials-import.md
  │   └── materials-index.md
  └── README.md
  ```
- [ ] 实现 `/materials-init` 命令
  - [ ] 创建目录结构(raw/indexed/archive)
  - [ ] 生成示例索引文件
- [ ] 实现 `/materials-import` 命令
  - [ ] 支持CSV导入(即刻/微博)
  - [ ] 支持JSON导入
  - [ ] 数据验证和格式化
- [ ] 实现 `/materials-index` 命令
  - [ ] 辅助建立主题索引
  - [ ] 从raw/提取关键词
  - [ ] 生成indexed/模板

**测试用例:**
```bash
✅ content plugins add materials-manager 安装成功
✅ /materials-init 创建目录结构
✅ /materials-import ~/jike.csv 导入成功
✅ /materials-index ai-tools 生成主题索引
```

**预计工作量:** 3天

---

### Week 7-8: image-generator 插件

**任务清单:**
- [ ] 创建插件目录结构
- [ ] 实现图片来源选择逻辑
  - [ ] 公共领域搜索(Wikimedia)
  - [ ] AI生成(火山引擎API集成)
  - [ ] 免费图库(Unsplash API集成)
- [ ] 实现图片保存和管理
  - [ ] 保存到 articles/*/images/
  - [ ] 生成图片清单(README.md)
- [ ] 实现Markdown图片插入
  - [ ] 分析文章配图位置
  - [ ] 插入图片引用
  - [ ] 添加图片说明

**测试用例:**
```bash
✅ content plugins add image-generator 安装成功
✅ /images 分析文章并生成配图
✅ 图片保存到正确目录
✅ Markdown正确插入图片引用
✅ 生成图片清单(含来源/授权信息)
```

**预计工作量:** 4天

---

### Week 8: research-assistant 插件 (可选)

**任务清单:**
- [ ] 创建插件目录结构
- [ ] 增强 `/research` 命令
  - [ ] 自动提取关键词
  - [ ] 并行搜索多渠道
  - [ ] 信息源可信度评分
- [ ] 实现缓存机制
  - [ ] 检查已有调研结果
  - [ ] 判断freshness(fresh/stale/expired)
  - [ ] 自动更新过期数据

**预计工作量:** 3天(如时间充裕)

---

## 阶段5: 测试与文档 (1周)

### Week 9: 完整测试与文档编写

**测试任务:**
- [ ] **单元测试**
  - [ ] 每个命令的独立测试
  - [ ] 边界条件测试
- [ ] **集成测试**
  - [ ] 完整流程测试(brief → 发布)
  - [ ] 工作区切换测试
  - [ ] 插件安装/卸载测试
- [ ] **真实场景测试** ⭐ 最重要
  - [ ] 用真实公众号文章需求测试
  - [ ] 用真实视频脚本需求测试
  - [ ] 邀请早期用户测试

**文档任务:**
- [ ] **用户文档**
  - [ ] README.md - 快速开始
  - [ ] 安装指南(installation.md)
  - [ ] 命令参考(commands-reference.md)
  - [ ] 最佳实践(best-practices.md)
  - [ ] 常见问题(FAQ.md)
- [ ] **开发文档**
  - [ ] 架构说明(architecture.md)
  - [ ] 插件开发指南(plugin-development.md)
  - [ ] 贡献指南(CONTRIBUTING.md)
- [ ] **迁移文档**
  - [ ] 从novel-writer迁移(migration-from-novel-writer.md)
  - [ ] 案例研究(case-studies.md)

**修复与优化:**
- [ ] 修复测试中发现的bug
- [ ] 优化命令提示词
- [ ] 优化用户体验(提示信息、错误处理)

**预计工作量:** 5天

---

## 发布计划

### Beta版本发布 (Week 9结束)

**发布清单:**
- [ ] npm包发布
  ```bash
  npm version 0.1.0-beta
  npm publish --tag beta
  ```
- [ ] GitHub Release
  - [ ] 创建 v0.1.0-beta tag
  - [ ] 编写 Release Notes
  - [ ] 附带使用示例
- [ ] 社区宣传
  - [ ] 少数派/V2EX发布帖
  - [ ] Twitter/即刻宣布
  - [ ] 邀请早期用户试用

**Beta版功能列表:**
- ✅ 核心9步流程(P0命令全部完成)
- ✅ 公众号工作区(完整支持)
- ✅ 个人素材库系统
- ✅ 三遍审校降AI味
- ✅ 自动配图
- ⚠️ 视频工作区(基础支持,待完善)
- ❌ 高级插件(图床上传、AI检测API - 待开发)

---

### 正式版本发布 (Beta后2-4周)

**基于Beta反馈迭代:**
- [ ] 修复用户反馈的bug
- [ ] 优化命令提示词(基于真实使用场景)
- [ ] 补充视频工作区功能
- [ ] 开发高级插件(根据需求)
- [ ] 完善文档和案例

**正式版发布:**
```bash
npm version 1.0.0
npm publish
```

---

## 资源分配

### 人力需求

**方案A: 单人开发**
- 1个全职开发者
- 创始人参与测试和反馈
- 工期: 9周

**方案B: 双人协作**
- 1个后端/架构开发(负责CLI、插件系统、命令逻辑)
- 1个前端/提示词工程师(负责命令模板、工作区配置、文档)
- 工期: 6周

**推荐:** 方案A(早期MVP单人即可,降低沟通成本)

---

### 时间分配

| 阶段 | 任务 | 工作量 | 占比 |
|-----|------|--------|------|
| 1 | 基础架构 | 10天 | 22% |
| 2 | 核心命令 | 15天 | 33% |
| 3 | 工作区系统 | 5天 | 11% |
| 4 | 插件开发 | 10天 | 22% |
| 5 | 测试文档 | 5天 | 11% |
| **总计** | **MVP完成** | **45天** | **100%** |

**缓冲时间:** 建议预留10-15天应对意外(bug修复、需求调整)

**实际工期:** 6-9周

---

## 风险管理

### 高风险项

#### 1. `/review` 命令的降AI味效果 (P0)

**风险:** 三遍审校后AI检测率仍>30%

**缓解措施:**
- 提前收集真实AI生成文章案例
- 建立套话库和AI句式规则
- 用腾讯朱雀API实测验证
- 准备多轮迭代优化

**应急方案:**
- 如果效果不达标,考虑集成第三方降AI味服务
- 或提供手动审校checklist,由用户参与

---

#### 2. 个人素材库搜索质量 (P0)

**风险:** CSV搜索返回不相关结果,或遗漏关键素材

**缓解措施:**
- 提供关键词建议(从brief自动提取)
- 双路径搜索(原始CSV + 主题索引)
- 搜索结果排序优化
- 让用户确认是否使用

**应急方案:**
- 如果搜索质量不佳,优先推荐用户手动整理主题索引
- 提供更友好的索引管理工具

---

#### 3. AI理解两层判断机制 (P1)

**风险:** AI误判工作区或任务类型

**缓解措施:**
- 命令frontmatter强制声明allowed-tools
- 脚本预检验证环境
- 提供明确的fallback逻辑
- 多次测试不同场景

**应急方案:**
- 提供手动指定工作区的CLI选项: `content --workspace wechat`
- 命令中增加任务类型确认环节

---

### 中风险项

#### 4. 图片生成/获取成本 (P1)

**风险:** 火山引擎API成本较高,或免费额度不足

**缓解措施:**
- 优先使用公共领域和免费图库
- AI生成作为补充,不作为主要来源
- 提供配额管理和成本预估

**应急方案:**
- 移除AI生成功能,仅保留搜索公共资源
- 或让用户自行配置API密钥

---

#### 5. 跨平台命令格式兼容性 (P1)

**风险:** 13个AI平台的命令格式差异导致问题

**缓解措施:**
- 复用novel-writer的成熟方案
- 重点测试Claude Code、Cursor、Gemini(主流平台)
- 其他平台作为额外支持,问题优先级较低

**应急方案:**
- 先支持3-5个主流平台
- 其他平台根据用户需求逐步添加

---

## 成功标准

### MVP版本成功标准

**技术指标:**
- ✅ 完整9步流程可用(P0命令全部实现)
- ✅ 三遍审校降AI检测率至30%以下(80%案例达标)
- ✅ 个人素材库搜索准确率>70%
- ✅ 支持至少3个主流AI平台(Claude/Cursor/Gemini)
- ✅ 无critical bug(阻塞核心流程的bug)

**用户体验指标:**
- ✅ 从初始化到生成初稿<30分钟(不含测试任务)
- ✅ 命令提示清晰,用户知道每一步在做什么
- ✅ 错误提示友好,能指导用户解决问题
- ✅ 有完整的使用文档和案例

**早期用户反馈:**
- ✅ 至少5个早期用户试用
- ✅ 用户反馈"比纯AI生成更真实"
- ✅ 用户愿意推荐给他人使用

---

### 正式版成功标准

**技术指标:**
- ✅ 三遍审校降AI检测率至20%以下(90%案例达标)
- ✅ 支持至少8个AI平台
- ✅ 视频工作区功能完善
- ✅ 高级插件可用(图床上传、AI检测API)

**社区指标:**
- ✅ GitHub Stars >100
- ✅ npm周下载量>50
- ✅ 至少2篇第三方评测/教程文章

---

## 下一步行动

如果决定启动项目:

### 立即行动 (Day 1-3)
1. **Fork仓库** - 创建 `article-writer` 分支
2. **建立项目管理** - GitHub Projects 或 Notion Board
3. **细化任务** - 将Roadmap分解为每日任务
4. **环境准备** - 安装依赖、配置开发环境

### 第一周目标
- ✅ CLI改造完成(`content init`可用)
- ✅ 目录结构重构完成
- ✅ 第一个命令原型(`/specify`)可运行

### 第一个月目标
- ✅ P0命令全部完成
- ✅ 公众号工作区可用
- ✅ 完成一篇真实文章测试

---

**Roadmap制定完成!准备好开始了吗?** 🚀
