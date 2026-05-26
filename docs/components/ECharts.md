# ECharts

按需加载的 ECharts 图表封装组件。

## 使用场景

所有需要图表展示的场景，已 Tree Shaking 只加载常用图表类型。

## 基础用法

```tsx
import ECharts from '@/components/ECharts';

const option = {
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
  yAxis: { type: 'value' },
  series: [{ data: [120, 200, 150], type: 'bar' }],
};

<ECharts option={option} style={{ height: 400 }} />
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| option | ECharts 配置项 | `EChartsOption` | **必填** |
| style | 容器样式 | `CSSProperties` | - |
| theme | 主题（已内置 20 色主题） | `string \| object` | 内置主题 |
| notMerge | 是否不合并更新 | `boolean` | `false` |
| showLoading | 显示加载状态 | `boolean` | `false` |
| onChartReady | 图表就绪回调 | `(instance) => void` | - |
| onEvents | 事件绑定 | `Record<string, Function>` | - |

## 已加载的图表/组件

- 图表：Bar, Pie, Line, Tree, Funnel, Scatter, Graph
- 组件：Title, Tooltip, Legend, Grid, DataZoom, Toolbox
- 渲染器：CanvasRenderer

## 依赖

需要安装 `echarts` 和 `echarts-for-react`：`npm install echarts echarts-for-react`
