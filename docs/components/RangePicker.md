# RangePicker

预设快捷选项的日期范围选择器。

## 使用场景

筛选表单中的日期区间选择，自带"今天、昨天、近7天、近1个月、近3个月"快捷选项。

## 基础用法

```tsx
import RangePicker from '@/components/RangePicker';

<Form.Item name="dateRange" label="日期">
  <RangePicker />
</Form.Item>

// 显示时间
<RangePicker showTime />

// 自定义预设
<RangePicker presets={[
  { label: '本月', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
]} />
```

## Props

完全继承 antd `RangePickerProps`。

| 额外行为 | 说明 |
|----------|------|
| placeholder | 根据 `showTime` 自动切换为中文占位符 |
| presets | 默认提供 5 个常用快捷选项，可通过 props 覆盖 |
