import { memo } from 'react';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

interface ComparedRateProps {
  title?: string;
  value: number;
}

const ComparedRate: React.FC<ComparedRateProps> = ({ title, value }) => {
  if (value == null) return null;

  return (
    <div>
      <span style={{ marginRight: 5 }}>
        {title} {value < 0 ? String(value).slice(1) : value}%
      </span>
      {value > 0 && <CaretUpOutlined style={{ color: '#ff4d4f' }} />}
      {value < 0 && <CaretDownOutlined style={{ color: '#53c419' }} />}
    </div>
  );
};

export default memo(ComparedRate);
