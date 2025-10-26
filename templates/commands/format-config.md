---
description: 交互式微信格式化配置器(主题/颜色/字号/预设管理)
argument-hint: [--reset|--save-preset|--load-preset|--help]
allowed-tools: Read(//.content/config.json, //.content/config-*.json), Write(//.content/config.json, //.content/config-*.json), Bash({SCRIPT})
scripts:
  sh: node .content/../../dist/commands/format-config.js $ARGUMENTS
---

# 微信格式化配置器

## 📋 命令说明

`/format-config` 命令提供交互式界面,用于定制微信公众号 Markdown 格式化样式。

### 命令用法

```bash
/format-config                # 交互式配置样式
/format-config --reset        # 重置为默认配置
/format-config --save-preset  # 保存当前配置为预设
/format-config --load-preset  # 加载已保存的预设
/format-config --help         # 显示帮助信息
```

高级用户可以通过这个命令精细调整:
- 主题(经典/优雅/简洁)
- 主题色(11种预设或自定义)
- 字号(14px-18px)
- 字体(无衬线/衬线/等宽)
- 各种开关选项
- 配置预设管理

## 🎯 适用场景

### 何时使用

- 需要频繁切换不同样式风格
- 想要可视化查看所有配置选项
- 不熟悉 JSON 配置文件格式
- 需要快速预览不同主题效果

### 替代方案

如果你只想**简单调整样式**,也可以:

1. **通过 AI 对话调整**(推荐)
   ```
   "我想换成 grace 主题,主题色改为翡翠绿"
   ```
   AI 会自动更新 `.content/config.json`

2. **直接编辑配置文件**
   ```bash
   vim .content/config.json
   ```
   修改 `formatting` 部分

## 🚀 使用流程

### 1. 启动配置器

```bash
/format-config
```

### 2. 查看当前配置

配置器会首先显示当前配置:
```
📋 当前配置:
  主题: default
  主题色: 经典蓝 (稳重冷静)
  字号: 16px
  字体: -apple-system...
  首行缩进: 否
  两端对齐: 否
  代码行号: 否
  链接转脚注: 是
  自动预览: 否
```

### 3. 交互式选择

**主题选择**
```
? 选择主题 ›
  ○ 经典 - 经典样式,适合大多数场景
  ● 优雅 - 圆角阴影效果,适合设计/生活类文章
  ○ 简洁 - 扁平化设计,适合技术/极简风文章
```

**主题色选择**
```
? 选择主题色 ›
  ○ 经典蓝 (稳重冷静)
  ● 翡翠绿 (自然平衡)
  ○ 活力橘 (热情活力)
  ○ 柠檬黄 (明亮温暖)
  ○ 薰衣紫 (优雅神秘)
  ○ 天空蓝 (清爽自由)
  ○ 玫瑰金 (奢华现代)
  ○ 橄榄绿 (沉稳自然)
  ○ 石墨黑 (内敛极简)
  ○ 雾烟灰 (柔和低调)
  ○ 樱花粉 (浪漫甜美)
  ○ 自定义(输入十六进制)
```

**字号选择**
```
? 选择字号 ›
  ○ 14px (更小)
  ○ 15px (稍小)
  ● 16px (推荐)
  ○ 17px (稍大)
  ○ 18px (更大)
```

**字体选择**
```
? 选择字体 ›
  ● 无衬线 - 适合现代感强的文章
  ○ 衬线 - 适合传统、正式的文章
  ○ 等宽 - 适合技术类文章
```

**开关选项**
```
? 段落首行缩进? › no
? 文本两端对齐? › no
? 代码块显示行号? › no
? 链接转为脚注? › yes
? 自动打开浏览器预览? › no
```

### 4. 确认并保存

```
✨ 新配置预览:
  主题: grace
  主题色: 翡翠绿 (自然平衡)
  字号: 16px
  字体: -apple-system...
  首行缩进: 否
  两端对齐: 否
  代码行号: 否
  链接转脚注: 是
  自动预览: 否

? 确认保存此配置? › yes

✓ 配置已保存到 .content/config.json
✓ 下次运行 /publish 时将使用新配置
```

## 📋 配置项说明

### 主题 (theme)

| 选项 | 说明 | 适用场景 |
|------|------|----------|
| **default**(经典) | 二级标题白字+主题色背景,三级标题左侧竖线 | 大多数文章类型 |
| **grace**(优雅) | 圆角边框和阴影效果,优雅的视觉层次 | 设计/生活类文章 |
| **simple**(简洁) | 扁平化设计,简洁的边框样式 | 技术/极简风文章 |

### 主题色 (primaryColor)

用于标题、加粗文字、链接等元素的颜色。提供 11 种预设:

- 经典蓝 `#0F4C81` - 稳重冷静
- 翡翠绿 `#009874` - 自然平衡
- 活力橘 `#FA5151` - 热情活力
- 柠檬黄 `#FECE00` - 明亮温暖
- 薰衣紫 `#92617E` - 优雅神秘
- 天空蓝 `#55C9EA` - 清爽自由
- 玫瑰金 `#B76E79` - 奢华现代
- 橄榄绿 `#556B2F` - 沉稳自然
- 石墨黑 `#333333` - 内敛极简
- 雾烟灰 `#A9A9A9` - 柔和低调
- 樱花粉 `#FFB7C5` - 浪漫甜美

或输入自定义十六进制颜色值(如 `#3f51b5`)

### 字号 (fontSize)

基础字体大小,影响正文和标题的相对大小:
- `14px` - 更小
- `15px` - 稍小
- `16px` - 推荐(默认)
- `17px` - 稍大
- `18px` - 更大

### 字体 (fontFamily)

- **无衬线** - 现代感强,适合大多数场景
- **衬线** - 传统正式,适合严肃内容
- **等宽** - 代码风格,适合技术文章

### 开关选项

- **首行缩进** (`isUseIndent`) - 段落首行缩进 2 个字符
- **两端对齐** (`isUseJustify`) - 文本两端对齐
- **代码行号** (`isShowLineNumber`) - 代码块显示行号
- **链接转脚注** (`citeStatus`) - 将外部链接转为文末脚注
- **自动预览** (`autoPreview`) - 格式化后自动打开浏览器

## 💡 使用技巧

### 快速切换主题

```bash
# 运行配置器
/format-config

# 只修改主题,其他保持默认
# 快速按 Enter 跳过不需要修改的选项
```

### 保存和使用配置预设(推荐)

**场景**: 经常在技术文章和生活文章间切换

**步骤**:

1. 配置技术文章样式
   ```bash
   /format-config
   # 选择 simple 主题, 蓝色, 16px等
   ```

2. 保存为预设
   ```bash
   /format-config --save-preset
   > 为此预设命名: tech
   ✓ 已保存预设: tech
   ```

3. 配置生活文章样式
   ```bash
   /format-config
   # 选择 grace 主题, 玫瑰金, 16px等
   ```

4. 保存为另一个预设
   ```bash
   /format-config --save-preset
   > 为此预设命名: life
   ✓ 已保存预设: life
   ```

5. 快速切换
   ```bash
   # 写技术文章时
   /format-config --load-preset
   > 选择: tech

   # 写生活文章时
   /format-config --load-preset
   > 选择: life
   ```

### 手动备份配置(不推荐)

不推荐手动复制文件,请使用上面的预设功能。

如果你确实需要手动备份:

```bash
# 备份
cp .content/config.json .content/config-tech.json

# 恢复
cp .content/config-tech.json .content/config.json
```

### 预览效果

配置完成后,可以立即预览:

```bash
# 1. 运行 publish 命令
/publish wechat

# 2. 打开生成的 HTML 文件
open workspaces/wechat/articles/项目名/publish/wechat.html
```

## 🎯 高级功能

### 重置为默认配置

如果配置混乱,可以一键重置:

```bash
/format-config --reset

🔄 重置微信格式化配置

⚠️  将恢复为默认配置:
  主题: default
  主题色: 靛蓝色
  字号: 16px
  ...

? 确认重置为默认配置? no
```

### 配置预设管理

#### 保存预设

将当前配置保存为预设,方便后续快速切换:

```bash
/format-config --save-preset

💾 保存配置预设

📋 当前配置:
  主题: grace
  主题色: 玫瑰金 (奢华现代)
  ...

? 为此预设命名(如 tech, life, design): my-preset
✓ 已保存预设: my-preset
✓ 文件位置: .content/config-my-preset.json
```

**预设命名规则**:
- 只能包含字母、数字、下划线和连字符
- ✅ 正确: `tech`, `life-style`, `design_2024`
- ❌ 错误: `我的预设`, `tech!`, `life style`

#### 加载预设

从已保存的预设中快速加载配置:

```bash
/format-config --load-preset

📂 加载配置预设

找到 3 个预设:

? 选择要加载的预设:
  ○ tech
  ○ life
  ○ design
  ○ 取消

> 选择: tech

预设配置:
  主题: simple
  主题色: 经典蓝 (稳重冷静)
  ...

? 确认加载此预设? yes
✓ 已加载预设配置
✓ 下次运行 /publish 时将使用此配置
```

#### 预设文件管理

预设文件保存在 `.content/` 目录:

```bash
.content/
├── config.json              # 当前使用的配置
├── config-tech.json         # "tech" 预设
├── config-life.json         # "life" 预设
└── config-design.json       # "design" 预设
```

可以手动删除不需要的预设:

```bash
rm .content/config-old-preset.json
```

## 🔧 故障排查

### 配置器无法启动

**症状**: 运行 `/format-config` 报错"未找到 .content/config.json"

**原因**: 不在项目根目录

**解决方案**:
```bash
# 切换到项目根目录
cd workspaces/wechat/articles/你的文章名

# 确认 .content/ 目录存在
ls -la .content/
```

### 自定义颜色无效

**症状**: 输入颜色后提示"无效的颜色格式"

**原因**: 颜色格式不正确

**解决方案**: 使用标准十六进制格式 `#RRGGBB`
- ✅ 正确: `#3f51b5`
- ❌ 错误: `3f51b5`(缺少 #)
- ❌ 错误: `#3f5`(不足 6 位)

### 配置未生效

**症状**: 修改配置后,运行 `/publish` 样式没变

**原因**: 可能修改了错误的配置文件,或缓存问题

**解决方案**:
```bash
# 1. 确认配置文件位置
cat .content/config.json | grep formatting

# 2. 删除旧的输出文件
rm -rf publish/wechat.html

# 3. 重新运行 publish
/publish wechat
```

## 📚 相关文档

- [微信格式化功能文档](../docs/wechat-formatting.md)
- [配置文件说明](../docs/wechat-formatting.md#配置说明)
- [主题对比](../docs/wechat-formatting.md#主题对比)

## 🎯 下一步

配置完成后:

1. 运行 `/publish wechat` 生成格式化的 HTML
2. 在浏览器中预览效果
3. 复制内容粘贴到微信公众号编辑器
4. 发布!

---

**提示**: 这是高级功能,日常使用推荐直接通过 AI 对话调整样式。
