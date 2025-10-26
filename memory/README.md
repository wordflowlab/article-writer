# Memory 目录

> **用途**: 存储 AI 运行时状态和会话信息
> **重要性**: 此目录不应提交到 Git（已添加到 .gitignore）

---

## 目录说明

### current-workspace.json

**用途**: 存储当前会话的工作区信息

**文件格式**:
```json
{
  "workspace": "wechat",
  "detected_at": "2025-01-26T10:30:00Z",
  "config_file": "spec/presets/workspaces/wechat.md",
  "project_path": "workspaces/wechat/articles/001-claude-code-review/"
}
```

**字段说明**:
- `workspace`: 工作区类型（wechat/video/general）
- `detected_at`: 检测时间（ISO 8601 格式）
- `config_file`: 加载的配置文件路径
- `project_path`: 当前项目路径（可选）

**使用时机**:
- `/brief-save` 命令检测到工作区后自动创建/更新
- 其他命令可读取此文件获取当前工作区信息

---

### session-context.json（未来功能）

**用途**: 存储会话上下文信息

**可能包含**:
- 最近使用的素材
- 审校历史
- 用户偏好设置

---

## 注意事项

1. **不要手动编辑**: 这些文件由 AI 自动管理
2. **不要提交到 Git**: 已添加到 .gitignore
3. **可以删除**: 删除后会自动重新生成

---

**最后更新**: 2025-01-26
