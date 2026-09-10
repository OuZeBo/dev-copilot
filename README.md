# dev-copilot（项目研发助手）

全局项目研发调度技能的 Qoder 插件包。自然语言触发需求设计、原型设计、前后端开发、Bug 排查、代码评审、测试验证与项目级记忆。

## 内容

- `skills/dev-copilot/`：主技能（全局研发调度，版本见 `src/frontmatter.yaml`）
- `skills/` 其余目录：dev-copilot 调度所需的依赖子技能副本（含传递依赖 `grilling`），随插件一并安装，避免调度时缺失

## 安装

```bash
qodercli plugin install --scope user <本项目目录>
```

或在 Qoder 插件面板中选择从本地目录安装。

## 维护

规则的唯一事实来源是 `src/`，产物通过 `node scripts/build.mjs` 生成、`node scripts/validate.mjs` 验收。详见 `AGENTS.md`。

## 来源与许可

除 `skills/dev-copilot/` 外，其余子技能为便于分发而内置的第三方副本，权利归各自原作者（见 `skills/NOTICE.md`）。
