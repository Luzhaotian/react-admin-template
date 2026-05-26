import type { UserInfo } from '@/stores/user';

export { UserInfo };

export interface UserQueryParams {
  username?: string;
  email?: string;
  role?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  orderBy?: 'asc' | 'desc';
}

export interface UserFormData {
  username: string;
  email: string;
  roles: string[];
  password?: string;
  confirmPassword?: string;
}

export interface UserListResult {
  total: number;
  records: UserInfo[];
}

export interface CreateUserResult {
  success: boolean;
  message: string;
  user?: UserInfo;
}

export interface UpdateUserResult {
  success: boolean;
  message: string;
  user?: UserInfo;
}

export interface DeleteUserResult {
  success: boolean;
  message: string;
}