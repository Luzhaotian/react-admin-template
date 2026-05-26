import {{ request }} from '@/shared/axios';

// API 接口
export const get用户管理List = (params: any) => {{
  return request({{
    url: '/api/user/list',
    method: 'get',
    params,
  }});
}};


