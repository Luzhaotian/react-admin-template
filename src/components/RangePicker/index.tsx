import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { type RangePickerProps } from 'antd/es/date-picker';

const { RangePicker: AntdRangePicker } = DatePicker;
const today = dayjs();
const yesterday = today.subtract(1, 'day');
const sevenday = today.subtract(6, 'day');
const lastMonth = today.subtract(1, 'month').add(1, 'day');
const lastThreeMonth = today.subtract(3, 'month').add(1, 'day');

const defaultPresets: RangePickerProps['presets'] = [
  {
    label: '今天',
    value: [today.startOf('day'), today.endOf('day')],
  },
  {
    label: '昨天',
    value: [yesterday.startOf('day'), yesterday.endOf('day')],
  },
  {
    label: '近7天',
    value: [sevenday.startOf('day'), today.endOf('day')],
  },
  {
    label: '近1个月',
    value: [lastMonth.startOf('day'), today.endOf('day')],
  },
  {
    label: '近3个月',
    value: [lastThreeMonth.startOf('day'), today.endOf('day')],
  },
];

const RangePicker: React.FC<RangePickerProps> = ({ presets, ...restProps }) => (
  <AntdRangePicker
    {...restProps}
    placeholder={restProps.showTime ? ['开始时间', '结束时间'] : ['开始日期', '结束日期']}
    presets={presets ?? defaultPresets}
  />
);

export default RangePicker;
