# JsonViewer

JSON 数据可视化查看器。

## 使用场景

调试接口返回数据、展示配置详情、数据预览等。

## 基础用法

```tsx
import JsonViewer from '@/components/JsonViewer';

<JsonViewer data={{ name: '张三', age: 18, tags: ['vip', 'active'] }} />

// 可空数据
<JsonViewer data={response} />
```

## Props

继承 `@textea/json-viewer` 的 `ReactJsonViewProps`。

| 额外属性 | 说明 | 类型 |
|----------|------|------|
| data | 要展示的 JSON 对象，为 null 时不渲染 | `object \| null` |

默认配置：隐藏根名称、字符串超 20 字符折叠、禁用数据类型显示和复制、最大高度 300px。

## 依赖

需要安装 `@textea/json-viewer`：`npm install @textea/json-viewer`
