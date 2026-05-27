import { memo, useMemo } from 'react';
import ECharts from '@/components/ECharts';
import type { DailyGrowthItem } from '@/types/dashboard';

import * as styles from '../index.module.css';

interface GrowthTrendChartProps {
  readonly dailyGrowth: DailyGrowthItem[];
}

const GrowthTrendChart: React.FC<GrowthTrendChartProps> = ({ dailyGrowth }) => {
  const option = useMemo(() => {
    const dates = dailyGrowth.map((item) => item.date.slice(5));
    const values = dailyGrowth.map((item) => item.newUsers);

    return {
      title: {
        text: '用户增长趋势',
        left: 'center',
        textStyle: { fontSize: 16 },
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: Array<{ name: string; seriesName: string; value: number }>) => {
          const p = params[0];
          return `${p.name}<br/>${p.seriesName}: ${p.value} 人`;
        },
      },
      legend: { show: false },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        min: 0,
        splitLine: {
          lineStyle: { type: 'dashed', color: '#E8E8E8' },
        },
      },
      series: [
        {
          name: '新增用户数',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            itemStyle: { symbolSize: 10 },
          },
          itemStyle: { color: '#5B8FF9' },
          lineStyle: { width: 2 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(91,143,249,0.3)' },
                { offset: 1, color: 'rgba(91,143,249,0.02)' },
              ],
            },
          },
          data: values,
        },
      ],
    };
  }, [dailyGrowth]);

  return (
    <div className={styles.chartWrapper}>
      <ECharts option={option} style={{ height: '100%', minHeight: 300 }} />
    </div>
  );
};

export default memo(GrowthTrendChart);
