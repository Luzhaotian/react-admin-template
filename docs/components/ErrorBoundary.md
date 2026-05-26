# ErrorBoundary

React 错误边界组件，捕获子组件 JS 错误和 Chunk 加载失败。

## 使用场景

包裹路由页面或懒加载组件，防止整个应用白屏。

## 基础用法

```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

<ErrorBoundary pathname={location.pathname}>
  <Outlet />
</ErrorBoundary>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| pathname | 当前路由路径，变化时自动重置错误状态 | `string` | - |
| children | 子组件 | `ReactElement` | - |

## 行为

- 检测 Chunk 加载失败（懒加载网络错误），显示"页面加载异常，请刷新重试"
- 其他错误显示"系统故障，请联系网站管理员"
- `pathname` 变化时自动重置错误状态
