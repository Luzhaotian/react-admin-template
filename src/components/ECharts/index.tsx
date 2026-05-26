import type { CSSProperties } from 'react';
import ReactECharts from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import {
  BarChart,
  PieChart,
  LineChart,
  TreeChart,
  FunnelChart,
  ScatterChart,
  GraphChart,
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  BarChart,
  PieChart,
  LineChart,
  TreeChart,
  FunnelChart,
  ScatterChart,
  GraphChart,

  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,

  CanvasRenderer,
]);

type EChartsOption = any;
type EChartsInstance = any;
type Opts = {
  readonly devicePixelRatio?: number;
  readonly renderer?: 'canvas' | 'svg';
  readonly width?: number | null | undefined | 'auto';
  readonly height?: number | null | undefined | 'auto';
  readonly locale?: string;
};

interface EChartsProps {
  readonly echarts?: any;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly option: EChartsOption;
  readonly theme?: string | Record<string, any>;
  readonly notMerge?: boolean;
  readonly lazyUpdate?: boolean;
  readonly showLoading?: boolean;
  readonly loadingOption?: any;
  readonly opts?: Opts;
  readonly onChartReady?: (instance: EChartsInstance) => void;
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly onEvents?: Record<string, Function>;
  readonly shouldSetOption?: (prevProps: EChartsProps, props: EChartsProps) => boolean;
}

const theme = {
  color: [
    '#5B8FF9',
    '#CDDDFD',
    '#61DDAA',
    '#CDF3E4',
    '#65789B',
    '#CED4DE',
    '#F6BD16',
    '#FCEBB9',
    '#7262fd',
    '#D3CEFD',
    '#78D3F8',
    '#D3EEF9',
    '#9661BC',
    '#DECFEA',
    '#F6903D',
    '#FFE0C7',
    '#008685',
    '#BBDEDE',
    '#F08BB4',
    '#FFE0ED',
  ],
};

const ECharts: React.FC<EChartsProps> = (props) => (
  <ReactECharts echarts={echarts} theme={theme} {...props} />
);

export default ECharts;
