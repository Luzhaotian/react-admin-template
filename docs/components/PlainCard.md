# PlainCard

简约卡片组件，无边框无阴影，只有标题栏和内容区。

## 使用场景

页面分区展示，比 antd Card 更轻量。

## 基础用法

```tsx
import PlainCard from '@/components/PlainCard';

<PlainCard
  title={<span>用户信息</span>}
  extra={<Button type="link">更多</Button>}
>
  <div>卡片内容</div>
</PlainCard>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 标题 | `ReactElement` | - |
| extra | 右侧扩展区域 | `ReactElement` | - |
| children | 内容 | `ReactElement` | - |
