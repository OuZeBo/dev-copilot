# dev-copilot（项目研发助手）

全局项目研发调度技能的 Qoder 插件包。自然语言触发需求设计、原型设计、前后端开发、Bug 排查、代码评审、测试验证与项目级记忆。

## 内容

- `skills/dev-copilot/`：主技能（全局研发调度，版本见 `src/frontmatter.yaml`）
- `skills/` 其余目录：dev-copilot 保留的少量强流程依赖副本；需求澄清、领域建模、连续追问、代码评审和分支收尾已内化到主规则

## 安装

```bash
qodercli plugin install --scope user <本项目目录>
```

或在 Qoder 插件面板中选择从本地目录安装。

## 维护

规则的唯一事实来源是 `src/`，产物通过 `node scripts/build.mjs` 生成、`node scripts/validate.mjs` 验收。详见 `AGENTS.md`。

## 来源与许可

除 `skills/dev-copilot/` 外，其余子技能为便于分发而内置的第三方副本，权利归各自原作者（见 `skills/NOTICE.md`）。
