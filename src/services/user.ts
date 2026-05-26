import axios from '@/shared/axios';
import type { UserInfo } from '@/stores/user';
import type { UserQueryParams, UserFormData, UserListResult, CreateUserResult, UpdateUserResult, DeleteUserResult } from '@/types/user';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  userInfo: UserInfo;
}

/** 登录 */
export async function login(params: LoginParams): Promise<LoginResult> {
  return axios.post('/user/login', params) as unknown as LoginResult;
}

/** 获取用户信息 */
export async function fetchUserInfo(): Promise<UserInfo> {
  return axios.get('/user/info') as unknown as UserInfo;
}

/** 获取用户权限 */
export async function fetchPermissions(): Promise<string[]> {
  return axios.get('/user/permissions') as unknown as string[];
}

// 用户管理相关接口

/** 获取用户列表 */
export async function getUserList(params: UserQueryParams): Promise<UserListResult> {
  return axios.get('/user/list', { params }) as unknown as UserListResult;
}

/** 创建用户 */
export async function createUser(userData: UserFormData): Promise<CreateUserResult> {
  return axios.post('/user/create', userData) as unknown as CreateUserResult;
}

/** 更新用户 */
export async function updateUser(userId: string, userData: UserFormData): Promise<UpdateUserResult> {
  return axios.put(`/user/${userId}`, userData) as unknown as UpdateUserResult;
}

/** 删除用户 */
export async function deleteUser(userId: string): Promise<DeleteUserResult> {
  return axios.delete(`/user/${userId}`) as unknown as DeleteUserResult;
}

/** 批量删除用户 */
export async function batchDeleteUsers(userIds: string[]): Promise<DeleteUserResult> {
  return axios.post('/user/batch-delete', { userIds }) as unknown as DeleteUserResult;
}
