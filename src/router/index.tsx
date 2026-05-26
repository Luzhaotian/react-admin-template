import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import StandardLayout from '@/layouts/StandardLayout';
import AuthGuard from '@/components/AuthGuard';

const Login = lazy(() => import('@/views/Login'));
const Dashboard = lazy(() => import('@/views/Dashboard'));
const UserManagement = lazy(() => import('@/views/UserManagement'));

const lazyLoad = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={<div style={{ padding: 24, textAlign: 'center' }}>加载中...</div>}>
    <Component />
  </Suspense>
);

const routes: RouteObject[] = [
  {
    path: '/login',
    element: lazyLoad(Login),
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <StandardLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        element: lazyLoad(Dashboard),
        handle: { meta: { title: '工作台', pid: 'dashboard' } },
      },
      {
        path: 'users',
        element: lazyLoad(UserManagement),
        handle: { meta: { title: '用户管理', pid: 'users' } },
      },
      // 在此处添加更多业务路由
    ],
  },
];

export default routes;
