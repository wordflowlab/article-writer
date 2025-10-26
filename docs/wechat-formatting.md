# 微信公众号格式化功能

Article Writer v0.4.0 新增了微信公众号 Markdown 自动格式化功能,基于 [doocs/md](https://github.com/doocs/md) 的核心渲染引擎。

## 🎯 功能特性

### 零命令增加
- 无需新增斜杠命令
- 在 `/publish` 命令中自动集成
- 保持原有工作流不变

### 配置驱动
- 通过 `.content/config.json` 配置样式
- 支持主题、颜色、字体等自定义
- AI 可通过对话更新配置

### 主题系统
- **default** - 经典样式,适合大多数场景
- **grace** - 优雅样式,圆角阴影效果
- **simple** - 简洁样式,扁平化设计

### 实时预览
- 生成独立的 HTML 文件
- 可在浏览器中预览效果
- 支持自动打开浏览器(可配置)

## 🚀 快速开始

### 1. 初始化项目(交互式选择主题)

```bash
content init my-article
```

**交互式流程**:
1. 选择 AI 助手 (Claude/Cursor/...)
2. 选择工作区类型 (wechat)
3. **选择微信文章主题** (default/grace/simple)
4. **选择主题色** (靛蓝/蓝色/绿色/红色/橙色/黑色)

### 2. 完成写作流程

```bash
/brief-save      # 保存需求
/research        # 调研
/write-draft     # 写初稿
/audit           # 审校
/images          # 配图
/final-check     # 最终检查
```

### 3. 发布并自动格式化

```bash
/publish wechat
```

**自动执行**:
- 读取 `draft.md` Markdown 文件
- 应用配置的主题和颜色
- 生成 `publish/wechat.html` 预览文件
- 可选自动打开浏览器预览

## ⚙️ 配置说明

### 配置文件位置

`.content/config.json`

### 配置示例

```json
{
  "name": "my-article",
  "workspace": "wechat",
  "formatting": {
    "theme": "default",              // 主题: default | grace | simple
    "primaryColor": "#3f51b5",       // 主题色(十六进制)
    "fontSize": "16px",              // 字体大小
    "fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    "isUseIndent": false,            // 首行缩进
    "isUseJustify": false,           // 两端对齐
    "isShowLineNumber": false,       // 代码行号
    "citeStatus": true,              // 脚注
    "autoPreview": false             // 自动打开浏览器预览
  }
}
```

### 配置项说明

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `theme` | string | `"default"` | 主题样式 |
| `primaryColor` | string | `"#3f51b5"` | 主题色 |
| `fontSize` | string | `"16px"` | 基础字体大小 |
| `fontFamily` | string | 系统字体 | 字体族 |
| `isUseIndent` | boolean | `false` | 段落首行缩进 |
| `isUseJustify` | boolean | `false` | 文本两端对齐 |
| `isShowLineNumber` | boolean | `false` | 代码块显示行号 |
| `citeStatus` | boolean | `true` | 链接转为脚注 |
| `autoPreview` | boolean | `false` | 自动打开预览 |

## 🎨 主题对比

### Default 主题
- 经典二级标题(白字+主题色背景)
- 三级标题左侧竖线
- 适合大多数文章类型

### Grace 主题
- 圆角边框和阴影效果
- 优雅的视觉层次
- 适合设计/生活类文章

### Simple 主题
- 扁平化设计
- 简洁的边框样式
- 适合技术/极简风文章

## 📝 手动调整配置

提供 **三种方式** 调整样式配置,满足不同用户需求:

### 方式 1: 交互式配置器(新增 ⭐)

**适合**: 高级用户,需要可视化查看所有选项

```bash
/format-config
```

**功能**:
- 交互式选择主题、颜色、字号、字体
- 实时显示当前配置
- 11种预设颜色 + 自定义颜色
- 所有开关选项一次性配置

详见: `templates/commands/format-config.md`

### 方式 2: 通过 AI 对话调整(推荐)

**适合**: 所有用户,最简单快捷

```
用户: "我想换成 grace 主题,主题色改为蓝色"
AI: 好的,已更新配置文件:
    - theme: "grace"
    - primaryColor: "#1976d2"
    下次运行 /publish 会使用新配置
```

### 方式 3: 直接编辑配置文件

**适合**: 技术用户,批量修改配置

```bash
# 编辑配置
vim .content/config.json

# 修改 formatting 部分
{
  "formatting": {
    "theme": "grace",
    "primaryColor": "#1976d2"
  }
}
```

## 🌐 使用流程

### 1. 在浏览器预览

```bash
# 执行 /publish 后
open workspaces/wechat/articles/my-article/publish/wechat.html
```

### 2. 复制到微信公众号

1. 在浏览器中打开 `wechat.html`
2. 全选内容 (Cmd/Ctrl + A)
3. 复制 (Cmd/Ctrl + C)
4. 粘贴到微信公众号编辑器
5. 检查格式和图片
6. 发布!

## 🛠️ 手动调用格式化脚本

如果需要单独格式化某个 Markdown 文件:

```bash
bash .content/scripts/bash/format-wechat.sh input.md output.html
```

## 🧪 测试示例

项目提供了测试示例:

```bash
# 1. 安装依赖
npm install

# 2. 构建项目
npm run build

# 3. 运行测试
npx tsx examples/test-formatter.ts

# 4. 查看输出
open examples/output-default.html
open examples/output-grace.html
open examples/output-simple.html
```

## 📋 支持的 Markdown 特性

### 基础语法
- ✅ 标题 (H1-H6)
- ✅ 段落
- ✅ 引用块
- ✅ 有序/无序列表
- ✅ 粗体/斜体
- ✅ 行内代码
- ✅ 代码块(支持语法高亮)
- ✅ 链接(自动转脚注)
- ✅ 图片
- ✅ 表格
- ✅ 分隔线

### 代码高亮支持

支持 12+ 常用编程语言:
- JavaScript / TypeScript
- Python / Java / Go / Rust / C++
- Bash / JSON / YAML / SQL
- Markdown

## 💡 最佳实践

### 1. 主题选择建议

- **技术文章** → Simple 主题 + 蓝色/黑色
- **设计/生活** → Grace 主题 + 温暖色调
- **通用文章** → Default 主题 + 品牌色

### 2. 配置建议

```json
{
  "formatting": {
    "theme": "default",
    "primaryColor": "#1976d2",  // 蓝色,通用性好
    "fontSize": "16px",         // 16px 适合移动端阅读
    "isUseIndent": false,       // 微信文章一般不需要首行缩进
    "citeStatus": true          // 启用脚注,避免干扰阅读
  }
}
```

### 3. 图片处理

- 建议先上传到微信公众平台获取 URL
- 或使用稳定的图床服务
- 图片宽度建议 600-900px

## 🔧 故障排查

### 格式化失败

**症状**: 执行 `/publish` 时报错

**解决方案**:
1. 确认已安装依赖: `npm install`
2. 检查配置文件格式是否正确
3. 查看错误日志确定具体问题

### 样式不生效

**症状**: HTML 生成但样式不对

**解决方案**:
1. 检查 `config.json` 中的 `formatting` 配置
2. 确认主题名称正确: `default` / `grace` / `simple`
3. 主题色格式正确: 十六进制如 `#3f51b5`

### 代码高亮不显示

**症状**: 代码块没有语法高亮

**解决方案**:
1. 确认语言标识符正确,如 \`\`\`typescript
2. 检查是否为支持的语言
3. 不支持的语言会显示为 plaintext

## 📚 相关资源

- [Article Writer 主仓库](https://github.com/wordflowlab/article-writer)
- [doocs/md 原项目](https://github.com/doocs/md)
- [Markdown 基础语法](https://www.markdownguide.org/basic-syntax/)

## 🎉 总结

通过集成 doocs/md 的格式化功能,Article Writer 实现了:

1. ✅ **零学习成本** - 保持原有命令,自动集成
2. ✅ **灵活定制** - 主题/颜色/字体全面可配置
3. ✅ **完整闭环** - 从写作到发布的一站式解决方案
4. ✅ **开箱即用** - 默认配置适合大多数场景

Happy Writing! 🚀
