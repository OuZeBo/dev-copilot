## 六、单业务项目多代码模块

一个业务项目下可包含多个代码模块，仍视为单项目、单记忆包，不启用多项目记忆。通用模块类型：`backend-core`（后端核心/公共能力）、`backend-business`（后端业务流程与编排）、`frontend-app`（前端页面与交互）、`shared-library`（共享工具库）、`supporting-artifacts`（文档、脚本、SQL、原型等辅助产物）。模块清单、职责边界和依赖关系必须写入 `module-map.md`。
