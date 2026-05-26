# ExpandButton

展开/收起按钮，配合 SearchGroup 使用。

## 使用场景

搜索表单的展开收起控制。

## 基础用法

```tsx
import ExpandButton from '@/components/ExpandButton';

const [expand, setExpand] = useState(false);

<ExpandButton expand={expand} onClick={() => setExpand(!expand)} />
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| expand | 是否展开状态 | `boolean` | - |
| onClick | 点击回调 | `() => void` | - |
