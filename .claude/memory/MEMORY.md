# react-admin-template 项目记忆

## 项目概要
- React 18 + TypeScript 5.3 后台管理模板
- 构建工具：Rspack 1.1 + SWC
- UI：Ant Design 5.22（中文）
- 路由：React Router DOM 6.13（createBrowserRouter）
- 状态：Zustand 4.3
- HTTP：Axios 1.4（X-Token）
- 样式：CSS Modules + 普通 CSS + CSS 变量

## 关键规范
- 详见 `frontend-architect` Skill 中的完整编码规范
- 所有架构决策记录在 `frontend-decisions.md`

## 架构决策
- （暂无决策记录，使用默认项目规范）

## 角色体系（5 个 Skill）

| 角色 | 命令 | 职责 |
|---|---|---|
| 项目经理 | `/project-manager` | 统筹全流程、任务分配、问题归类、最终验收 |
| 产品经理 | `/product-manager` | 需求梳理、网页分析、需求扩展 |
| 前端架构师 | `/frontend-architect` | 按项目规范编写代码 |
| 测试员 | `/tester` | 编写用例、浏览器自动化测试、报告存档 |
| 审查员 | `/code-reviewer` | 审查需求、测试用例、代码变更 |

### 流程
```
用户需求 → 项目经理 → 产品 → 审查员(需求) → [前端+测试并行] → 审查员(产出) → 项目经理验收
```

### 问题分级处理
- 🟢 低级(1-3分): 直接执行
- 🟡 中级(4-7分): 查 memory 后执行
- 🔴 高级(8-10分): 提交用户决定

## 持久化文件
- 架构决策: `memory/frontend-decisions.md`
- 审查日志: `memory/code-review-log.md`
- 问题流转: `memory/pm-issue-log.md`
- 需求文档: `docs/requirements/`
- 测试报告: `docs/test-reports/`
- 测试截图: `docs/test-screenshots/`
