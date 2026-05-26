# TextButton

文字按钮组件，无边框无背景，样式类似链接文字。

## 使用场景

表格操作列、轻量级交互按钮，比 antd Button 更紧凑。

## 基础用法

```tsx
import TextButton from '@/components/TextButton';
import { EditOutlined } from '@ant-design/icons';

<TextButton icon={<EditOutlined />} onClick={() => edit(record)}>编辑</TextButton>
<TextButton danger onClick={() => del(record)}>删除</TextButton>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| icon | 图标 | `ReactNode` | - |
| danger | 危险样式（红色） | `boolean` | `false` |
| htmlType | 按钮类型 | `'button' \| 'submit' \| 'reset'` | `'button'` |

其余属性继承原生 `button`。
