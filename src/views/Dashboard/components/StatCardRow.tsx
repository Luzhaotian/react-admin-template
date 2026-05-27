import { memo } from 'react';
import { UserAddOutlined, UserOutlined, RiseOutlined } from '@ant-design/icons';
import ComparedRate from '@/components/ComparedRate';
import type { UserGrowthDashboardResult } from '@/types/dashboard';

import StatCard from './StatCard';
import * as styles from '../index.module.css';

interface StatCardRowProps {
  readonly data: UserGrowthDashboardResult;
}

const StatCardRow: React.FC<StatCardRowProps> = ({ data }) => {
  return (
    <div className={styles.cardRow}>
      <StatCard
        title="今日新增用户"
        value={data.todayNewUsers}
        prefix={<UserAddOutlined />}
        footer={
          <ComparedRate
            title="日环比"
            value={data.dayOverDayGrowthRate}
          />
        }
      />
      <StatCard
        title="总用户数"
        value={data.totalUsers}
        prefix={<UserOutlined />}
        formatter={(v) => v.toLocaleString()}
        footer={`较昨日 +${data.todayNewUsers}`}
      />
      <StatCard
        title="7日平均日增"
        value={data.avgDailyNewUsers}
        prefix={<RiseOutlined />}
        footer={
          <ComparedRate
            title="周环比"
            value={data.weekOverWeekGrowthRate}
          />
        }
      />
    </div>
  );
};

export default memo(StatCardRow);
