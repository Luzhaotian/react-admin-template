import type { LoginParams } from '@/services/user';
import type { UserInfo } from '@/stores/user';

const mockUsers: Record<string, { password: string; userInfo: UserInfo }> = {
  admin: {
    password: 'admin',
    userInfo: {
      userId: '1',
      username: 'admin',
      email: 'admin@example.com',
      roles: ['admin'],
      permissions: [],
    },
  },
  user: {
    password: 'user',
    userInfo: {
      userId: '2',
      username: 'user',
      email: 'user@example.com',
      roles: ['user'],
      permissions: [],
    },
  },
};

export const mockLogin = (params: LoginParams) => {
  const user = mockUsers[params.username];
  if (user && user.password === params.password) {
    return {
      token: `mock-token-${params.username}-${Date.now()}`,
      userInfo: user.userInfo,
    };
  }
  throw new Error('用户名或密码错误');
};

export const mockFetchUserInfo = (token: string) => {
  const username = token.split('-')[2];
  const user = mockUsers[username];
  if (user) {
    return user.userInfo;
  }
  throw new Error('用户不存在');
};

export const mockFetchPermissions = () => {
  return ['dashboard', 'users', 'settings'];
};

export const mockGetGrowthDashboard = () => {
  const today = new Date();
  const dailyGrowth: { date: string; newUsers: number }[] = [];

  // 生成近 7 天数据，整体微增长趋势，允许单日小幅回落
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);
    const base = 90 + Math.floor((6 - i) * 8);
    const jitter = Math.floor(Math.random() * 30) - 15;
    const newUsers = Math.max(50, Math.min(200, base + jitter));
    dailyGrowth.push({ date: dateStr, newUsers });
  }

  const todayNewUsers = dailyGrowth[6].newUsers;
  const yesterdayNewUsers = dailyGrowth[5].newUsers;
  const totalUsers = 24000 + Math.floor(Math.random() * 1000);
  const dayOverDayGrowthRate = yesterdayNewUsers
    ? Number((((todayNewUsers - yesterdayNewUsers) / yesterdayNewUsers) * 100).toFixed(1))
    : 0;

  const avgDailyNewUsers = Math.round(
    dailyGrowth.reduce((sum, item) => sum + item.newUsers, 0) / 7
  );

  const prev7DaysNewUsers = 75 + Math.floor(Math.random() * 20);
  const prev7DaysAvg = prev7DaysNewUsers;
  const weekOverWeekGrowthRate = prev7DaysAvg
    ? Number((((avgDailyNewUsers - prev7DaysAvg) / prev7DaysAvg) * 100).toFixed(1))
    : 0;

  return {
    dailyGrowth,
    todayNewUsers,
    totalUsers,
    dayOverDayGrowthRate,
    avgDailyNewUsers,
    weekOverWeekGrowthRate,
  };
};