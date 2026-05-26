# Drawer

增强型抽屉组件，在 antd Drawer 基础上增加全屏切换按钮。

## 使用场景

需要在抽屉中全屏查看/编辑内容时。

## 基础用法

```tsx
import Drawer from '@/components/Drawer';

const [open, setOpen] = useState(false);

<Drawer
  title="详情"
  open={open}
  onClose={() => setOpen(false)}
  width={720}
>
  <p>抽屉内容</p>
</Drawer>
```

## Props

完全继承 antd `DrawerProps`，无额外属性。右上角自动增加全屏/退出全屏按钮。

## 依赖

需要安装 `screenfull`：`npm install screenfull`
