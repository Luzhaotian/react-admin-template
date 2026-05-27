import { memo } from 'react';
import { Card, Statistic } from 'antd';
import type { ReactNode } from 'react';

import * as styles from '../index.module.css';

interface StatCardProps {
  readonly title: string;
  readonly value: number;
  readonly prefix: ReactNode;
  readonly suffix?: ReactNode;
  readonly formatter?: (value: number) => ReactNode;
  readonly footer?: ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, prefix, suffix, formatter, footer }) => {
  return (
    <Card className={styles.statCard}>
      <Statistic
        title={title}
        value={value}
        prefix={<span className={styles.statIcon}>{prefix}</span>}
        suffix={suffix}
        formatter={formatter}
        className={styles.statValue}
      />
      {footer && <div className={styles.statFooter}>{footer}</div>}
    </Card>
  );
};

export default memo(StatCard);
