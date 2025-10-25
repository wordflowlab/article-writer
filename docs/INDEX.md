# Article Writer - 文档索引

> 快速导航 - 所有方案文档的入口

---

## 📖 文档结构

```
article-writer/
├── INDEX.md              ← 你在这里
├── SUMMARY.md           ← 执行摘要 (必读)
├── README.md            ← 项目概述
├── technical-design.md  ← 技术设计
├── commands-design.md   ← 命令设计
└── roadmap.md           ← 开发路线图
```

---

## 🎯 按角色阅读指南

### 如果你是决策者
**目标**: 了解项目可行性和价值

**推荐阅读顺序**:
1. **[SUMMARY.md](./SUMMARY.md)** (15分钟) ⭐ 必读
   - 可行性结论
   - 核心创新点
   - 预期价值
   - 资源需求

2. **[README.md](./README.md)** (10分钟)
   - 项目定位
   - 功能特性
   - 与novel-writer的关系

**关键决策点**:
- ✅ 是否启动项目
- ✅ 资源投入(人力/时间)
- ✅ 发布时间表

---

### 如果你是开发者
**目标**: 理解技术实现和开发计划

**推荐阅读顺序**:
1. **[technical-design.md](./technical-design.md)** (30分钟) ⭐ 必读
   - 架构对比分析
   - 核心模块设计
   - 数据流设计
   - 性能优化

2. **[commands-design.md](./commands-design.md)** (20分钟) ⭐ 必读
   - 9个核心命令详细设计
   - 命令模板示例
   - 执行逻辑

3. **[roadmap.md](./roadmap.md)** (20分钟)
   - 5个阶段任务分解
   - 时间估算
   - 风险管理

4. **[README.md](./README.md)** (10分钟)
   - 快速开始
   - 目录结构

**关键技术点**:
- 两层判断机制实现
- 个人素材库搜索(Grep)
- 三遍审校逻辑(AI特征识别)
- 命令模板生成脚本

---

### 如果你是产品经理
**目标**: 了解产品设计和用户体验

**推荐阅读顺序**:
1. **[README.md](./README.md)** (10分钟)
   - 核心特性
   - 九步写作流程
   - 目标场景

2. **[commands-design.md](./commands-design.md)** (20分钟)
   - 每个命令的用户交互
   - 选题讨论机制
   - 审校输出格式

3. **[SUMMARY.md](./SUMMARY.md)** (15分钟)
   - 核心价值主张
   - 差异化优势
   - 成功标准

**关键产品点**:
- 工作区系统(公众号/视频/通用)
- 选题讨论(不自作主张)
- 对比式审校(❌原文 → ✅改后)
- 真实素材融入机制

---

## 📚 按主题阅读指南

### 主题1: 可行性评估
**问题**: 这个项目能做吗?值得做吗?

**阅读**:
- [SUMMARY.md](./SUMMARY.md) - 可行性分析章节
- [README.md](./README.md) - 技术架构对比表
- [technical-design.md](./technical-design.md) - 架构对比分析

**关键数据**:
- 架构复用度: 70-80%
- 开发成本节省: 50-70%
- 预估工期: 6-9周
- 技术风险: 低

---

### 主题2: 核心创新点
**问题**: 和其他AI写作工具有什么不同?

**阅读**:
- [SUMMARY.md](./SUMMARY.md) - 核心创新点章节
- [README.md](./README.md) - 核心特性
- [technical-design.md](./technical-design.md) - 核心模块设计

**创新点**:
1. 个人素材库系统
2. 三遍审校机制
3. 两层判断机制
4. 选题讨论机制

---

### 主题3: 如何降低AI味
**问题**: 三遍审校具体怎么做?

**阅读**:
- [commands-design.md](./commands-design.md) - `/audit` 命令章节
- [technical-design.md](./technical-design.md) - 2.3节 三遍审校机制

**关键技术**:
- 8大类AI套话库
- AI句式识别规则
- 200+书面词汇替换
- 对比输出格式

---

### 主题4: 个人素材库
**问题**: 如何管理和使用个人素材?

**阅读**:
- [technical-design.md](./technical-design.md) - 2.2节 个人素材库系统
- [commands-design.md](./commands-design.md) - `/materials-search` 命令

**核心机制**:
- 导入即刻/微博CSV
- Grep搜索原始数据
- 主题索引管理
- 改写融入规则

---

### 主题5: 开发计划
**问题**: 什么时候能做完?需要什么资源?

**阅读**:
- [roadmap.md](./roadmap.md) - 完整路线图
- [SUMMARY.md](./SUMMARY.md) - 资源需求章节

**关键里程碑**:
- 第1周: CLI改造完成
- 第1个月: P0命令完成
- 第2个月: Beta版发布
- 第3个月: 正式版发布

---

## 🔍 核心概念速查

### 两层判断机制
- **第一层**: 工作区判断(公众号/视频/通用)
- **第二层**: 任务类型识别(新写作/修改/审校/咨询)
- **详见**: [technical-design.md § 2.1](./technical-design.md)

### 九步写作流程
1. `/brief-save` - 保存需求
2. `/research` - 信息搜索
3. `/topic-discuss` - 选题讨论
4. `/collab-doc` - 协作文档
5. `/style-learn` - 风格学习
5.5. `/materials-search` - 素材搜索
6. `/write-draft` - 创作初稿
7.5. `/style-transform` - 风格转换(可选)
8. `/audit` - 三遍审校
9. `/images` - 文章配图

**详见**: [README.md § 九步写作流程](./README.md)

### 三遍审校
- **第一遍**: content - 内容审校(事实/逻辑/结构)
- **第二遍**: style - 风格审校(删套话/改句式/加细节)
- **第三遍**: detail - 细节打磨(标点/排版/节奏)
- **详见**: [commands-design.md § /audit](./commands-design.md)

### 个人素材库
- **raw/**: 原始数据(CSV/JSON)
- **indexed/**: 主题索引(手动整理)
- **archive/**: 历史文章
- **详见**: [technical-design.md § 2.2](./technical-design.md)

---

## 📊 关键数据速查

### 开发工作量
- **总工期**: 6-9周(MVP)
- **P0命令**: 5个,21天
- **插件开发**: 3个,10天
- **测试文档**: 5天

**详见**: [roadmap.md](./roadmap.md)

### 技术指标
- **架构复用度**: 70-80%
- **开发成本节省**: 50-70%
- **AI检测率目标**: <30%(MVP), <20%(正式版)
- **素材搜索准确率**: >70%

**详见**: [SUMMARY.md § 成功标准](./SUMMARY.md)

### 资源需求
- **人力**: 1个全职开发者 + 创始人参与测试
- **API成本**: <$50/月(图片生成,可选)
- **服务器**: 无(纯CLI工具)

**详见**: [SUMMARY.md § 资源需求](./SUMMARY.md)

---

## 🎯 快速决策树

### 是否启动项目?

```
START
  |
  ├─ 技术可行性如何?
  |    └─ 90%复用 → ✅ 可行
  |
  ├─ 市场需求明确吗?
  |    └─ 降AI味是刚需 → ✅ 明确
  |
  ├─ 开发成本可控吗?
  |    └─ 6-9周,成本节省50% → ✅ 可控
  |
  ├─ 有差异化优势吗?
  |    └─ 个人素材库+三遍审校 → ✅ 有
  |
  └─ 决策: ✅ 强烈推荐启动
```

**阅读**: [SUMMARY.md § 最终建议](./SUMMARY.md)

---

### 如何开始?

```
立即行动(Day 1-3)
  ├─ Fork novel-writer仓库
  ├─ 创建article-writer分支
  ├─ 建立项目管理看板
  └─ 配置开发环境
      ↓
第一周目标(Day 1-7)
  ├─ CLI改造完成
  ├─ 目录重构完成
  └─ 第一个命令原型可运行
      ↓
第一个月目标(Day 1-30)
  ├─ P0命令全部完成
  ├─ 公众号工作区可用
  └─ 完成一篇真实文章测试
```

**阅读**: [SUMMARY.md § 下一步行动](./SUMMARY.md)

---

## 🔗 外部资源

### 相关项目
- **novel-writer**: https://github.com/wordflowlab/novel-writer
- **Spec-Kit**: https://github.com/sublayerapp/spec-kit

### 技术参考
- **反AI检测**: 腾讯朱雀标准
- **图片生成**: 火山引擎API
- **命令生成**: Markdown → TOML 转换

---

## 📝 文档更新记录

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v0.1 | 2025-01-15 | 初版完成,包含全部5个核心文档 |

---

## 💡 使用建议

### 如果时间有限 (10分钟)
**只读**: [SUMMARY.md](./SUMMARY.md)

包含:
- 可行性结论
- 核心创新点
- 预期价值
- 最终建议

### 如果要深入了解 (1小时)
**阅读顺序**:
1. [SUMMARY.md](./SUMMARY.md) - 15分钟
2. [README.md](./README.md) - 10分钟
3. [technical-design.md](./technical-design.md) - 20分钟
4. [commands-design.md](./commands-design.md) - 15分钟

### 如果要开始开发 (2小时)
**阅读全部文档**:
1. [SUMMARY.md](./SUMMARY.md) - 15分钟
2. [README.md](./README.md) - 10分钟
3. [technical-design.md](./technical-design.md) - 30分钟
4. [commands-design.md](./commands-design.md) - 20分钟
5. [roadmap.md](./roadmap.md) - 20分钟
6. 开始Fork仓库和环境准备 - 25分钟

---

## 🤝 贡献指南

如果你想参与或改进这个方案:

1. **提出问题** - 在文档中标注疑问点
2. **补充案例** - 添加真实使用场景
3. **优化设计** - 提出改进建议
4. **测试验证** - 用真实需求验证可行性

---

**准备好了吗?从 [SUMMARY.md](./SUMMARY.md) 开始吧!** 🚀

---

*索引生成时间: 2025-01-15*
*基于: 5个核心文档*
