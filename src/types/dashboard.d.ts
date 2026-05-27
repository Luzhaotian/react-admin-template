/** 单日用户增长数据 */
export interface DailyGrowthItem {
  /** 日期，格式 YYYY-MM-DD，如 "2026-05-27" */
  date: string;
  /** 当日新增用户数 */
  newUsers: number;
}

/** 用户增长看板响应数据 */
export interface UserGrowthDashboardResult {
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
