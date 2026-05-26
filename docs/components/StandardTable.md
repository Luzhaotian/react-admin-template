# StandardTable

增强型数据表格组件，自动计算滚动高度、配置默认分页。

## 使用场景

替代原生 `antd Table`，用于需要自动撑满可视区域、自带分页配置的表格场景。

## 基础用法

```tsx
import StandardTable from '@/components/StandardTable';

const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
];

const data = [
  { key: '1', name: '张三', age: 18 },
  { key: '2', name: '李四', age: 22 },
];

<StandardTable
  columns={columns}
  dataSource={data}
  pagination={{ current: 1, pageSize: 10, total: 100 }}
/>
```

## Props

继承 antd `Table` 的所有 Props，无额外参数。

| 属性 | 说明 | 类型 |
|------|------|------|
| scroll | 自动计算 y 轴滚动高度（默认 `innerHeight - 190`） | `TableProps['scroll']` |
| pagination | 自带中文分页显示、页码切换器 | `TablePaginationConfig \| false` |

## 静态成员

透传 antd Table 的静态成员：`Column`、`ColumnGroup`、`Summary`、`SELECTION_COLUMN` 等。
