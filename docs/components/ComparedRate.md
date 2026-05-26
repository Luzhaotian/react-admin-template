# ComparedRate

变化率展示组件，带方向指示箭头。

## 使用场景

数据看板中展示同比/环比变化率。

## 基础用法

```tsx
import ComparedRate from '@/components/ComparedRate';

<ComparedRate title="同比" value={12.5} />   // 红色上箭头
<ComparedRate title="环比" value={-3.2} />   // 绿色下箭头
<ComparedRate value={0} />                    // 无箭头
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 前缀标题 | `string` | - |
| value | 变化率数值（正值=上升红色，负值=下降绿色） | `number` | - |
