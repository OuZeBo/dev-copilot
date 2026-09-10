# AGENTS.md

本仓库是 `dev-copilot` 全局研发技能的模板工程，负责技能规则的持续迭代、构建、验收与分发。

## 仓库结构

- `src/frontmatter.yaml` — SKILL.md 元数据唯一来源（name/version/dependencies 等）
- `src/chapters/` — 运行时章节源文件；`00-positioning.md` 为架构定位共享段
- `src/template-only/` — 只进模板不进 SKILL.md 的章节（版本定位、验收规则）
- `skills/` — 分发单元：`dev-copilot/` 为构建产物加配置，其余为依赖子技能副本（含传递依赖 `grilling`）
- `scripts/build.mjs` — 由 src 组装 `skills/dev-copilot/SKILL.md` 与根目录版本模板文件
- `scripts/validate.mjs` — 产物验收（必备规则、元数据唯一性、项目中立、编号连续、依赖完整性）
- `scripts/install.mjs` — 把 skills/ 平铺部署到目标技能目录（默认 `~/.codex/skills`）
- `.qoder-plugin/plugin.json` — Qoder 插件清单，使项目根可直接作为 Qoder 插件安装（`qodercli plugin install <项目目录>`，用户级全局生效）
- `项目技能模板V*.md` — 版本模板（构建产物，勿手工编辑）
- `CHANGELOG.md` — 版本演进脉络（V2.0.3 起）

## 迭代流程

1. 改规则只改 `src/` 下对应章节文件，不直接编辑 `skills/dev-copilot/SKILL.md`。
2. 运行 `node scripts/build.mjs` 重新生成产物。
3. 运行 `node scripts/validate.mjs`，全部 PASS 才算完成。
4. 部署：`node scripts/install.mjs [目标技能目录]`。
5. 升版本时同步更新 `src/frontmatter.yaml` 的 version 与 `CHANGELOG.md`。

## 约束

- skill 名固定为 `dev-copilot`，与仓库/工作区目录名无关。
- 规则的唯一事实来源是 `src/`；验收以 `validate.mjs` 结果为准。
- 脚本仅依赖 Node.js（>=18），无第三方包。
