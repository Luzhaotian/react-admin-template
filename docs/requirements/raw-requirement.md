# 原始需求记录

## 基本信息
- **记录时间**: 2026-05-13
- **需求来源**: 用户直接提出
- **需求描述**: 新建一个用户管理菜单

## 项目背景
- **项目类型**: React + Ant Design 后台管理系统模板
- **当前状态**:
  - 已有登录功能
  - 已有工作台（Dashboard）菜单
  - 使用 react-router-dom 路由
  - 使用 Zustand 状态管理
  - 菜单配置在 `src/layouts/StandardLayout/index.tsx`
  - 路由配置在 `src/router/index.tsx`
  - 页面放在 `src/views/` 目录

## 当前菜单配置
```typescript
const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '工作台' },
];
```

## 当前路由配置
- `/login` - 登录页
- `/dashboard` - 工作台（默认首页）

## 用户确认结果

**确认时间**: 2026-05-13

| 问题 | 用户选择 |
|------|----------|
| 功能范围 | A. 用户列表 + 增删改查 |
| 数据来源 | A. Mock 数据 |

## 需求范围确认
- ✅ 用户列表展示
- ✅ 用户新增
- ✅ 用户编辑
- ✅ 用户删除
- ✅ 使用 Mock 数据
- ❌ 用户详情页（不做）
- ❌ 多级菜单结构（不做）
- ❌ 真实 API 对接（不做）
