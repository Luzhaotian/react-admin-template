import memoizeOne from 'memoize-one';
import type {{ TableColumnsType }} from 'antd';
import type {{ GlobalState }} from '@/stores/global';
import type {{ 用户管理Record }} from './types';

function createColumns({{  }}) {{
  return [
        {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
        {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
    },
        {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
    },
        {
      title: '手机号',
      dataIndex: 'phone',
      width: 150,
    },
        {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (text: any, record: any) => (text: number) => text === 1 ? '启用' : '禁用',
    },
        {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
    },
        {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 180,
    },
  ] as TableColumnsType<用户管理Record>;
}}

export default memoizeOne(createColumns);
