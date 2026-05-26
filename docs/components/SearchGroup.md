# SearchGroup

可展开/收起的搜索表单布局组件。

## 使用场景

搜索条件较多时，用 `ellipsis` 控制哪些字段可折叠隐藏。

## 基础用法

```tsx
import SearchGroup from '@/components/SearchGroup';
import { Form, Input, Select } from 'antd';

const [form] = Form.useForm();

<Form form={form} onFinish={() => search()}>
  <SearchGroup onReset={() => form.resetFields()}>
    <SearchGroup.Item>
      <Form.Item name="name" label="姓名"><Input /></Form.Item>
    </SearchGroup.Item>
    <SearchGroup.Item>
      <Form.Item name="status" label="状态"><Select /></Form.Item>
    </SearchGroup.Item>
    <SearchGroup.Item ellipsis>
      <Form.Item name="phone" label="手机号"><Input /></Form.Item>
    </SearchGroup.Item>
  </SearchGroup>
</Form>
```

## Props

### SearchGroup

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| defaultExpand | 是否默认展开 | `boolean` | `false` |
| extra | 额外操作按钮 | `ReactNode` | - |
| onReset | 重置回调（显示重置按钮） | `() => void` | - |

### SearchGroup.Item

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| ellipsis | 是否支持展开/收起 | `boolean` | `false` |

其余属性继承 antd `Col`。
