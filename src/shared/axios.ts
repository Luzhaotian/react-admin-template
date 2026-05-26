import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { message } from 'antd';
import useUserStore from '@/stores/user';

interface ApiResponse<T = any> {
  status: string;
  data: T;
  msg?: string;
}

const instance = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
}) as AxiosInstance & {
  post<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T>;
  get<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
};

instance.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;
  if (token) {
    config.headers['X-Token'] = token;
  }
  return config;
});

instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;
    if (data.status !== 'SUCCESS') {
      message.error(data.msg || '请求失败');
      return Promise.reject(data);
    }
    return data.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      useUserStore.getState().logout();
      window.location.href = '/login';
    }
    message.error(error.message || '网络异常');
    return Promise.reject(error);
  }
);

export default instance;
