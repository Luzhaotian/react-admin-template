# MultiSelectFilterAll

带全选功能的可搜索多选下拉框。

## 使用场景

选项较多的多选场景，需要"全选/取消全选"操作，且全选仅作用于当前搜索结果。

## 基础用法

```tsx
import MultiSelectFilterAll from '@/components/MultiSelectFilterAll';

const options = [
  { key: '1', value: '选项一' },
  { key: '2', value: '选项二' },
  { key: '3', value: '测试' },
];

<Form.Item name="selected" label="选择">
  <MultiSelectFilterAll
    options={options}
    placeholder="请选择"
    allowClear
  />
</Form.Item>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| options | 选项列表 | `{ key: string \| number; value: string }[]` | **必填** |
| value | 选中值（Form.Item 自动注入） | `(string \| number)[]` | - |
| onChange | 变化回调（Form.Item 自动注入） | `(value) => void` | - |
| allowClear | 允许清除 | `boolean` | - |
| placeholder | 占位符 | `string` | - |
| disabled | 是否禁用 | `boolean` | - |

## 行为

- 底部"全选"复选框仅作用于当前搜索过滤后的选项
- 搜索时全选状态会随过滤结果动态变化
