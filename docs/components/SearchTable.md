# SearchTable

搜索表格布局组件，组合搜索区 + 工具栏 + StandardTable。

## 使用场景

需要"顶部搜索表单 + 中间操作栏 + 底部表格"的标准列表页。

## 基础用法

```tsx
import SearchTable, { useSearchTable } from '@/components/SearchTable';
import { Form, Input, Button } from 'antd';

const fetchList = async (params) => {
  const res = await fetch('/api/list', { method: 'POST', body: JSON.stringify(params) });
  return res.json();
};

function UserList() {
  const [form] = Form.useForm();
  const { state, search, searchProps, tableProps } = useSearchTable(fetchList);

  return (
    <SearchTable
      search={
        <Form form={form} onFinish={searchProps.onSubmit} layout="inline">
          <Form.Item name="name"><Input placeholder="姓名" /></Form.Item>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form>
      }
      toolbar={<Button type="primary">新增</Button>}
      columns={columns}
      {...tableProps}
    />
  );
}
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| search | 搜索区域内容 | `ReactNode` | - |
| toolbar | 工具栏左侧操作按钮 | `ReactNode` | - |
| extra | 工具栏右侧扩展内容 | `ReactNode` | - |

其余属性继承 `StandardTable`（即 antd Table）。

## useSearchTable

| 返回值 | 说明 |
|--------|------|
| state | 分页、数据、loading 等状态 |
| search | 触发查询 |
| refresh | 刷新当前页 |
| searchProps | `{ onSubmit, onReset, defaultValues }` |
| tableProps | `{ loading, onChange, dataSource, pagination }` |
