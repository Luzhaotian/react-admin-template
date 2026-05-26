# Scrollbar

自定义滚动条组件。

## 使用场景

需要自定义滚动条样式、自动隐藏滚动条的区域。

## 基础用法

```tsx
import Scrollbar from '@/components/Scrollbar';

<Scrollbar style={{ height: 300 }}>
  <div style={{ height: 1000 }}>很长的内容</div>
</Scrollbar>
```

## Props

完全继承 `react-custom-scrollbars-2` 的 `ScrollbarProps`。

## 依赖

需要安装 `react-custom-scrollbars-2`：`npm install react-custom-scrollbars-2`
