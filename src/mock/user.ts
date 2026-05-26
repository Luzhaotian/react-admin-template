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