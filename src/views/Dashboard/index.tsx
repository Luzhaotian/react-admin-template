import { useEffect, useState, useCallback, memo } from 'react';
import { Typography, Skeleton, Empty, Button, Card } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { getUserGrowthDashboard } from '@/services/user';
import type { UserGrowthDashboardResult } from '@/types/dashboard';

import StatCardRow from './components/StatCardRow';
import GrowthTrendChart from './components/GrowthTrendChart';
import * as styles from './index.module.css';

const { Title } = Typography;

type LoadingState = 'loading' | 'success' | 'error';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<UserGrowthDashboardResult | null>(null);
  const [status, setStatus] = useState<LoadingState>('loading');

  const fetchData = useCallback(async () => {
    setStatus('loading');
    try {
      const result = await getUserGrowthDashboard();
      setData(result);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className={styles.dashboard}>
      <Title level={4} className={styles.pageTitle}>
        工作台
      </Title>

      {status === 'loading' && (
        <>
          <div className={styles.cardRow}>
            <Skeleton.Input active block style={{ height: 120 }} />
            <Skeleton.Input active block style={{ height: 120 }} />
            <Skeleton.Input active block style={{ height: 120 }} />
          </div>
          <Card>
            <Skeleton.Input active block style={{ height: 300 }} />
          </Card>
        </>
      )}

      {status === 'error' && (
        <div className={styles.errorWrapper}>
          <Empty description="数据加载失败" />
          <Button type="primary" icon={<ReloadOutlined />} onClick={fetchData}>
            重新加载
          </Button>
        </div>
      )}

      {status === 'success' && data && (
        <>
          <StatCardRow data={data} />
          <Card>
            <GrowthTrendChart dailyGrowth={data.dailyGrowth} />
          </Card>
        </>
      )}
    </div>
  );
};

export default memo(Dashboard);
