# VirtualTable

虚拟滚动大数据表格组件。

## 使用场景

数据量很大（千行以上）需要高性能渲染的表格场景，基于 `react-base-table` 实现。

## 基础用法

```tsx
import VirtualTable from '@/components/VirtualTable';

const columns = [
  { key: 'id', dataKey: 'id', title: 'ID', width: 100 },
  { key: 'name', dataKey: 'name', title: '姓名', width: 200 },
  { key: 'age', dataKey: 'age', title: '年龄', width: 100 },
];

const data = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `用户${i}`,
  age: 20 + (i % 40),
}));

<VirtualTable
  columns={columns}
  data={data}
  rowKey="id"
  style={{ height: 500 }}
  pagination={{ current: 1, pageSize: 50, total: 10000 }}
  onPaginationChange={(page, pageSize) => fetchData({ page, pageSize })}
/>
```

## 带筛选和排序

```tsx
const columns = [
  {
    key: 'name',
    dataKey: 'name',
    title: '姓名',
    width: 200,
    filters: [
      { text: '张三', value: 'zhangsan' },
      { text: '李四', value: 'lisi' },
    ],
  },
  {
    key: 'age',
    dataKey: 'age',
    title: '年龄',
    width: 100,
    sorter: true,
  },
];

<VirtualTable
  columns={columns}
  data={data}
  rowKey="id"
  onFilterChange={(filters) => console.log(filters)}
  onSortChange={(sorter) => console.log(sorter)}
/>
```

## 带行选择

```tsx
<VirtualTable
  columns={columns}
  data={data}
  rowKey="id"
  rowSelection={{
    selectedRowKeys,
    onChange: (keys, rows) => setSelectedRowKeys(keys),
  }}
/>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| columns | 列定义（使用 `dataKey` 替代 `dataIndex`） | `ColumnShape[]` | `[]` |
| data | 数据源 | `readonly RecordType[]` | `[]` |
| rowKey | 行唯一标识 | `string \| number` | `'id'` |
| pagination | 分页配置 | `TablePaginationConfig \| false` | - |
| rowSelection | 行选择配置 | 见上方 | - |
| onFilterChange | 筛选变化回调 | `(filters) => void` | - |
| onSortChange | 排序变化回调 | `(sorter) => void` | - |
| bordered | 是否显示边框 | `boolean` | - |
| className | 容器类名 | `string` | - |
| style | 容器样式（默认高度 440px） | `CSSProperties` | - |

## 依赖

需要安装 `react-base-table` 和 `classnames`：`npm install react-base-table classnames`
