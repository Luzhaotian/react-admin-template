# Exception

异常页面组件，包含 403 和 404 页面。

## 使用场景

路由守卫拦截无权限访问时展示 403，未匹配路由展示 404。

## 基础用法

```tsx
import Forbidden from '@/components/Exception/Forbidden';
import NotFound from '@/components/Exception/NotFound';

// 路由中使用
{
  path: '403',
  element: <Forbidden />,
},
{
  path: '*',
  element: <NotFound />,
}
```

## 403 Forbidden

显示"很抱歉，你没有权限访问此页面"，带"回到首页"按钮。

## 404 NotFound

显示"很抱歉，您访问的页面不存在"，带"回到首页"按钮。
