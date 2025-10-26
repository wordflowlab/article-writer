# format-config 快速参考

## 🚀 命令速查

```bash
/format-config                # 交互式配置
/format-config --reset        # 重置为默认
/format-config --save-preset  # 保存预设
/format-config --load-preset  # 加载预设
/format-config --help         # 帮助信息
```

## 🎨 配置选项

### 主题 (3种)
- **default** (经典) - 适合大多数场景
- **grace** (优雅) - 设计/生活类
- **simple** (简洁) - 技术/极简风

### 主题色 (11种预设)
| 颜色 | 色值 | 特点 |
|------|------|------|
| 经典蓝 | `#0F4C81` | 稳重冷静 |
| 翡翠绿 | `#009874` | 自然平衡 |
| 活力橘 | `#FA5151` | 热情活力 |
| 柠檬黄 | `#FECE00` | 明亮温暖 |
| 薰衣紫 | `#92617E` | 优雅神秘 |
| 天空蓝 | `#55C9EA` | 清爽自由 |
| 玫瑰金 | `#B76E79` | 奢华现代 |
| 橄榄绿 | `#556B2F` | 沉稳自然 |
| 石墨黑 | `#333333` | 内敛极简 |
| 雾烟灰 | `#A9A9A9` | 柔和低调 |
| 樱花粉 | `#FFB7C5` | 浪漫甜美 |

### 字号 (5档)
- 14px (更小)
- 15px (稍小)
- **16px** (推荐)
- 17px (稍大)
- 18px (更大)

### 字体 (3种)
- **无衬线** - 现代感强
- **衬线** - 传统正式
- **等宽** - 技术风格

### 开关选项 (5个)
- 首行缩进 (`isUseIndent`)
- 两端对齐 (`isUseJustify`)
- 代码行号 (`isShowLineNumber`)
- 链接转脚注 (`citeStatus`) ⭐ 推荐开启
- 自动预览 (`autoPreview`)

## 📋 常用场景

### 技术文章
```
主题: simple
颜色: 经典蓝 或 石墨黑
字号: 16px
字体: 无衬线
```

### 生活文章
```
主题: grace
颜色: 玫瑰金 或 樱花粉
字号: 16px
字体: 衬线
```

### 通用文章
```
主题: default
颜色: 经典蓝
字号: 16px
字体: 无衬线
```

## 🔄 预设管理

### 保存预设
```bash
/format-config --save-preset
> 命名: tech  # 只能用字母数字下划线连字符
```

### 加载预设
```bash
/format-config --load-preset
> 选择: tech
```

### 预设位置
```
.content/
├── config.json          # 当前配置(已跟踪)
├── config-tech.json     # tech 预设(忽略)
├── config-life.json     # life 预设(忽略)
└── config-*.json        # 其他预设(忽略)
```

## 💡 使用技巧

### 1. 快速跳过
交互时直接按 Enter 保持当前值

### 2. 自定义颜色
必须使用 `#RRGGBB` 格式:
- ✅ `#3f51b5`
- ❌ `3f51b5` (缺少 #)
- ❌ `#3f5` (不足6位)

### 3. 预设切换
经常切换风格时使用预设管理:
```bash
# 技术文章
/format-config --load-preset
> tech

# 生活文章
/format-config --load-preset
> life
```

### 4. 重置恢复
配置混乱时一键重置:
```bash
/format-config --reset
```

## 🔧 故障排查

### 找不到配置文件
```bash
cd workspaces/wechat/articles/你的文章名
ls .content/config.json  # 确认存在
```

### 颜色格式错误
使用 `#` + 6位十六进制:
```bash
#FF5733  # 正确
```

### 配置未生效
```bash
# 删除旧输出
rm publish/wechat.html

# 重新发布
/publish wechat
```

## 📚 三种配置方式

### 1. 交互式配置器 (推荐新手)
```bash
/format-config
```

### 2. AI 对话 (推荐日常)
```
"换成 grace 主题,主题色改为玫瑰金"
```

### 3. 直接编辑 (推荐批量)
```bash
vim .content/config.json
```

## 📖 相关文档

- [完整指南](format-config-guide.md)
- [命令模板](../templates/commands/format-config.md)
- [测试指南](../examples/test-format-config.md)
- [微信格式化](wechat-formatting.md)

---

**提示**: 配置完成后运行 `/publish wechat` 立即查看效果!
