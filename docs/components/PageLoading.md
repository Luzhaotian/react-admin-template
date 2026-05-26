# PageLoading

页面级加载状态组件。

## 使用场景

`React.lazy` 懒加载的 `Suspense` fallback，或数据加载中的占位。

## 基础用法

```tsx
import PageLoading from '@/components/PageLoading';

// 作为 Suspense fallback
<Suspense fallback={<PageLoading />}>
  <LazyComponent />
</Suspense>
```

## Props

无参数，纯展示组件。
