# 用户增长趋势数据看板 产品需求文档

| 字段 | 内容 |
|------|------|
| 文档编号 | PRD-Dashboard-2026-05-27 |
| 版本 | v1.0 |
| 创建日期 | 2026-05-27 |
| 作者 | PM |
| 状态 | Draft |

---

## 1. 需求概述

### 1.1 背景

当前 Dashboard 页面（`/dashboard`）仅展示四个静态统计卡片（用户总数、今日订单、待处理工单、今日交易额），数据为硬编码常量，无图表展示，无法反映数据的时序变化趋势。业务方需要一个能够直观观察用户增长动态的数据看板。

### 1.2 目标

替换现有 Dashboard 页面内容，构建一个面向运营/管理层的用户增长数据看板。通过折线图展示近 7 天用户增长趋势，通过数据卡片呈现关键指标，帮助用户快速掌握用户规模及增长态势。

### 1.3 数据来源

本期使用 Mock 数据，数据结构需与未来真实 API 保持一致，便于后续无缝切换。

---

## 2. 用户场景

### 场景 1：运营人员每日晨间查看

> 运营人员登录后台管理系统后，直接进入工作台（/dashboard），快速查看今日新增用户数、总用户规模以及增长率，判断当前运营活动是否有效。

### 场景 2：管理层周报数据采集

> 管理层需要汇总近一周的用户增长数据，通过看板中的折线图观察增长趋势是否平稳、是否存在异常波动，辅助决策。

---

## 3. 功能需求

### 3.1 页面布局

页面采用垂直布局，从上到下依次为：

1. 页面标题栏
2. 数据指标卡片行（一行三列）
3. 用户增长趋势折线图（整行）

### 3.2 数据指标卡片

共三个卡片，使用 Ant Design `Card` + `Statistic` 组件封装（不使用 PlainCard），一行排列，等宽分布。每个卡片头部带图标，底部带 `ComparedRate` 辅助指标。

#### 卡片 1：今日新增用户

| 属性 | 定义 |
|------|------|
| 标题 | 今日新增用户 |
| 主指标 | 当日新增注册用户数，整数，如 `128` |
| 辅助指标 | 日环比增长率，使用 `ComparedRate` 组件展示。计算公式：`(今日新增 - 昨日新增) / 昨日新增 * 100`，正值=增长（红色上箭头），负值=下降（绿色下箭头） |
| 图标 | `UserAddOutlined`（Ant Design 图标） |
| 示例值 | `128`，日环比 `+12.5%` |

#### 卡片 2：总用户数

| 属性 | 定义 |
|------|------|
| 标题 | 总用户数 |
| 主指标 | 平台累计注册用户总数，整数，如 `24,580` |
| 辅助指标 | 较昨日净增数，如 `较昨日 +128` |
| 图标 | `UserOutlined` |
| 示例值 | `24,580` |

#### 卡片 3：7日平均日增

| 属性 | 定义 |
|------|------|
| 标题 | 7日平均日增 |
| 主指标 | 近 7 天每日新增用户的算术平均值，保留整数，如 `96` |
| 辅助指标 | 周环比增长率（与上一个 7 天周期对比） |
| 图标 | `RiseOutlined` |
| 示例值 | `96`，周环比 `+8.3%` |

### 3.3 用户增长趋势折线图

使用项目已封装的 `ECharts` 组件（路径：`src/components/ECharts/index.tsx`），图表类型为 `LineChart`（已在 ECharts 实例中注册）。

#### 3.3.1 坐标轴定义

| 轴 | 类型 | 定义 |
|----|------|------|
| X 轴（类目轴） | `category` | 近 7 天日期，格式 `MM-DD`（如 `05-21`、`05-22` ... `05-27`）。从左到右按时间升序排列，最右侧为今日 |
| Y 轴（数值轴） | `value` | 每日新增用户数，整数。最小值从 0 开始，最大值根据数据自动适配 |

#### 3.3.2 数据系列

单系列折线图：

| 系列名称 | 数据 | 样式 |
|----------|------|------|
| 新增用户数 | 近 7 天每日新增用户数值数组，长度为 7，如 `[85, 102, 78, 96, 110, 120, 128]` | 平滑曲线（`smooth: true`），带圆形数据点（`symbol: 'circle'`，`symbolSize: 6`），主色 `#5B8FF9`（主题色板第一色） |

#### 3.3.3 图表配置

| 配置项 | 值 |
|--------|-----|
| 标题 | `用户增长趋势`，`left: 'center'`，文字大小 `16px` |
| Tooltip | 触发方式 `axis`；内容格式：`{b}<br/>{a}: {c} 人`（b 为日期，a 为系列名，c 为数值） |
| 图例 | 不显示（单系列无需图例） |
| 网格 | `left: '3%'`，`right: '4%'`，`bottom: '3%'`，`containLabel: true` |
| 线条样式 | 线宽 `2px`，颜色渐变（区域填充渐变，从 `rgba(91,143,249,0.3)` 到 `rgba(91,143,249,0.02)`） |
| Y 轴分割线 | 显示，样式为虚线，颜色 `#E8E8E8` |

#### 3.3.4 交互行为

| 交互 | 行为 |
|------|------|
| Hover 折线 | 显示 tooltip 浮层，包含日期和新增用户数；对应数据点放大（`symbolSize: 10`） |
| 图表自适应 | 监听窗口 `resize` 事件，自动重绘（ECharts 默认行为） |

### 3.4 Mock 数据规范

#### 3.4.1 接口定义

新增服务函数 `getUserGrowthDashboard`，路径：`src/services/user.ts`（扩展现有服务文件）。

```
请求: GET /user/growth-dashboard
响应: UserGrowthDashboardResult
```

#### 3.4.2 数据结构

```typescript
/** 单日用户增长数据 */
interface DailyGrowthItem {
  /** 日期，格式 YYYY-MM-DD，如 "2026-05-27" */
  date: string;
  /** 当日新增用户数 */
  newUsers: number;
}

/** 用户增长看板响应数据 */
interface UserGrowthDashboardResult {
  /** 近 7 天每日新增数据，按日期升序排列 */
  dailyGrowth: DailyGrowthItem[];
  /** 今日新增用户数（等于 dailyGrowth 最后一项的 newUsers） */
  todayNewUsers: number;
  /** 总用户数 */
  totalUsers: number;
  /** 日环比增长率，百分比，如 12.5 表示 +12.5% */
  dayOverDayGrowthRate: number;
  /** 7 日平均日增用户数 */
  avgDailyNewUsers: number;
  /** 周环比增长率，百分比 */
  weekOverWeekGrowthRate: number;
}
```

#### 3.4.3 Mock 数据要求

| 要求 | 说明 |
|------|------|
| 数据合理性 | 新增用户数范围 `50 ~ 200`，总用户数 `20000 ~ 30000` |
| 趋势合理性 | 7 天数据整体呈微增长趋势，允许单日小幅回落，避免全部单调递增 |
| 日期动态性 | Mock 函数内部根据当前系统日期动态生成，确保每天打开页面显示的 7 天范围正确 |
| 文件位置 | `src/mock/user.ts`（扩展现有 Mock 文件） |
| Mock 关联 | 按现有模式：rspack dev server 中间件拦截 `/api/v1/user/*` 路由，`MOCK=true` 时返回 mock 数据 |

### 3.5 页面组件拆分

| 组件 | 职责 | 文件路径 |
|------|------|----------|
| `Dashboard`（页面容器） | 数据获取、状态管理、布局编排 | `src/views/Dashboard/index.tsx`（替换现有内容） |
| `StatCardRow` | 指标卡片行布局，接收数据并分发给子卡片 | `src/views/Dashboard/components/StatCardRow.tsx`（新增） |
| `StatCard` | 单个指标卡片，封装 `Card` + `Statistic` + `ComparedRate` | `src/views/Dashboard/components/StatCard.tsx`（新增） |
| `GrowthTrendChart` | 折线图，封装 `ECharts` 组件和 option 配置 | `src/views/Dashboard/components/GrowthTrendChart.tsx`（新增） |

### 3.6 数据流

```
Dashboard (useEffect)
  -> getUserGrowthDashboard()  (service 调用，Mock 模式返回 Mock 数据)
  -> setState(result)
  -> 传递给 StatCardRow 和 GrowthTrendChart
```

页面加载时自动请求一次数据，无轮询、无手动刷新。

---

## 4. 非功能需求

| 维度 | 要求 |
|------|------|
| 响应式 | 数据卡片：`<768px` 垂直堆叠，`768px~1024px` 两列排列，`>=1024px` 三列排列。折线图宽度自适应，最小高度 `300px` |
| 国际化 | 所有文案使用中文，日期格式 `MM-DD` |
| 加载体验 | 数据请求期间显示 Ant Design `Skeleton` 占位（卡片区域和图表区域各一个） |
| 错误处理 | 请求失败时显示 Ant Design `Empty` 组件，并提供"重新加载"按钮 |
| 代码规范 | TypeScript 严格模式，组件使用 `React.FC` + `memo`，遵循项目现有编码风格 |
| 样式方案 | CSS Modules（`*.module.css`），与 `Login` 页面风格一致 |
| 依赖复用 | 不引入新的第三方依赖，仅使用项目已有依赖（Ant Design、ECharts、dayjs） |

---

## 5. 文件变更清单

| 操作 | 文件路径 | 说明 |
|------|----------|------|
| 修改 | `src/views/Dashboard/index.tsx` | 替换为新的看板页面 |
| 新增 | `src/views/Dashboard/components/StatCardRow.tsx` | 指标卡片行组件 |
| 新增 | `src/views/Dashboard/components/StatCard.tsx` | 单指标卡片组件 |
| 新增 | `src/views/Dashboard/components/GrowthTrendChart.tsx` | 折线图组件 |
| 新增 | `src/views/Dashboard/index.module.css` | 页面样式 |
| 修改 | `src/services/user.ts` | 新增 `getUserGrowthDashboard` 接口函数 |
| 修改 | `src/mock/user.ts` | 新增 Mock 数据生成函数 |
| 新增 | `src/types/dashboard.d.ts` | 看板相关类型定义 |

无需修改路由配置，现有 `/dashboard` 路径保持不变。

---

## 6. 优先级与排期建议

| 优先级 | 说明 |
|--------|------|
| P1 | 本期核心需求，替换现有 Dashboard 页面 |

| 步骤 | 内容 | 预估工时 |
|------|------|----------|
| 1 | 类型定义 + Mock 数据 + Service 函数 | 0.5h |
| 2 | StatCard 组件开发 | 0.5h |
| 3 | GrowthTrendChart 组件开发 | 1h |
| 4 | Dashboard 页面组装 + 联调 | 1h |
| 5 | 样式适配 + 响应式 + 自测 | 0.5h |
| **合计** | | **3.5h** |

---

## 7. 验收标准

- [ ] 页面加载后三个卡片数值与 Mock 数据一致
- [ ] 折线图 X 轴显示近 7 天日期（MM-DD），Y 轴从 0 开始
- [ ] Hover 折线显示 Tooltip，格式为 `{日期}<br/>新增用户数: {n} 人`
- [ ] 小屏（<768px）卡片垂直堆叠，图表最小高度 300px
- [ ] 请求失败显示 Empty 组件 + "重新加载"按钮
- [ ] Loading 状态显示 Skeleton 占位
- [ ] 代码遵循项目规范（TypeScript strict、CSS Modules、React.FC + memo）

---

## 8. 后续迭代方向（本期不做）

- 接入真实 API，替换 Mock 数据
- 支持时间范围选择（7天 / 30天 / 自定义）
- 增加更多维度卡片（活跃用户数、留存率等）
- 图表支持多系列对比（如注册用户 vs 活跃用户）
