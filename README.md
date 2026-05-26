# React Admin Template

基于 React 18 + TypeScript + Ant Design 5 的后台管理系统模板，使用 Rspack 作为构建工具。

## 技术栈

| 技术 | 版本 |
|------|------|
| React | ^18.3 |
| TypeScript | ^5.3 |
| Ant Design | ^5.22 |
| React Router | ^6 |
| Zustand | ^4.3 |
| ECharts | ^6.0 |
| Rspack | ^1.1 |
| Axios | ^1.4 |

## 功能特性

- 🚀 **Rspack 构建** — 极速开发体验，替代 Webpack
- 🎨 **Ant Design 5** — 企业级 UI 组件库
- 📊 **ECharts 图表** — 数据可视化支持
- 🔐 **路由守卫** — 权限控制
- 📦 **Zustand 状态管理** — 轻量级状态管理
- 🔄 **Mock 数据** — 独立 Mock 服务，前后端分离开发
- 📄 **通用组件** — 搜索表格、虚拟列表、抽屉等开箱即用组件
- 🌐 **国际化** — 内置中文支持

## PMGR 智能体

本项目内置 **PMGR 项目经理智能体**，可自动统筹从需求到交付的完整开发流程：

```
用户需求 → 产品经理(写需求) → 审查员(审查) → 前端架构师(编码) + 测试员(写用例) → 审查员(审查) → 项目经理(验收)
```

- 🧑‍💼 **角色协作** — 产品经理、前端架构师、测试员、审查员 4 个子角色分工协作
- 🔍 **双重审查** — 需求审查 + 产出审查，每个环节质量把关
- 📋 **问题分级** — 低级自动处理、中级查记忆、高级问用户
- 📊 **进度管控** — 阶段汇报、验收报告、全流程透明

详见 [PMGR 智能体完整使用指南](.claude/skills/PMGR/SKILL.md)

## 环境要求

- Node.js >= 24.14.0
- npm >= 9

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 启动开发服务器（Mock 模式）
npm run dev:mock

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

- 开发服务器：`http://localhost:8080`
- Mock 服务器：`http://localhost:8081`

## 目录结构

```
react-admin-template/
├── src/
│   ├── components/        # 通用组件
│   │   ├── SearchTable/    # 搜索表格
│   │   ├── VirtualTable/   # 虚拟列表表格
│   │   ├── StandardTable/  # 标准表格
│   │   ├── ECharts/        # 图表组件
│   │   ├── SearchGroup/    # 搜索组件组
│   │   ├── Drawer/         # 抽屉组件
│   │   └── ...
│   ├── layouts/           # 布局组件
│   ├── pages/             # 页面
│   ├── views/             # 业务视图
│   ├── router/            # 路由配置
│   ├── stores/            # 状态管理
│   ├── services/          # API 服务
│   ├── mock/              # Mock 数据
│   ├── shared/            # 公共工具
│   └── styles/            # 全局样式
├── docs/                  # 组件文档
├── rspack.config.ts       # Rspack 配置
└── tsconfig.json          # TypeScript 配置
```

## 内置组件

| 组件 | 说明 |
|------|------|
| `SearchTable` | 带搜索栏和分页的表格 |
| `VirtualTable` | 虚拟滚动大列表表格 |
| `StandardTable` | 标准表格组件 |
| `ECharts` | 图表组件封装 |
| `SearchGroup` | 搜索条件组合组件 |
| `Drawer` | 抽屉组件封装 |
| `ContentContainer` | 内容区容器 |
| `JsonViewer` | JSON 数据查看器 |
| `ErrorBoundary` | 错误边界组件 |
| `AuthGuard` | 路由权限守卫 |

## 许可证

MIT
