# ContentContainer

带返回按钮和标题的内容卡片。

## 使用场景

详情页、编辑页等需要标题和返回导航的页面容器。

## 基础用法

```tsx
import ContentContainer from '@/components/ContentContainer';

<ContentContainer title="用户详情">
  <Descriptions>
    <Descriptions.Item label="姓名">张三</Descriptions.Item>
  </Descriptions>
</ContentContainer>
```

## Props

继承 antd `CardProps`。

| 额外属性 | 说明 | 类型 |
|----------|------|------|
| title | 标题（左侧有返回按钮，仅在有浏览器历史时显示） | `ReactNode` |
