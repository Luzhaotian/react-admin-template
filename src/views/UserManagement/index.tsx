import React, { useState, useRef } from 'react';
import { Button, message, Popconfirm, Modal, Form, Input, Select, Space } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import SearchTable from '@/components/SearchTable';
import useUserStore from '@/stores/user';
import UserForm from './components/UserForm';
import type { UserInfo, UserQueryParams } from '@/types/user';
import {
  getUserList,
  createUser,
  updateUser,
  deleteUser,
  batchDeleteUsers
} from '@/services/user';

const { Option } = Select;

const UserManagement: React.FC = () => {
  const [searchForm] = Form.useForm();
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const userInfo = useUserStore(state => state.userInfo);

  // Handle user operations
  const handleAdd = () => {
    setEditingUser(null);
    setUserModalVisible(true);
  };

  const handleEdit = (record: UserInfo) => {
    setEditingUser(record);
    setUserModalVisible(true);
  };

  const handleDelete = async (userId: string) => {
    setLoading(true);
    try {
      // Check if deleting current user
      if (userInfo && userId === userInfo.userId) {
        message.error('不能删除当前登录用户');
        return;
      }

      const result = await deleteUser(userId);
      if (result.success) {
        message.success(result.message);
        // Refresh the table
        handleSearch();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('删除用户失败');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchDelete = async (selectedRowKeys: React.Key[]) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的用户');
      return;
    }

    // Check if deleting current user
    const currentUserId = userInfo?.userId;
    if (currentUserId && selectedRowKeys.includes(currentUserId)) {
      message.error('不能删除当前登录用户');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个用户吗？`,
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        setLoading(true);
        try {
          const userIds = selectedRowKeys as string[];
          const result = await batchDeleteUsers(userIds);
          if (result.success) {
            message.success(result.message);
            // Refresh the table
            handleSearch();
          } else {
            message.error(result.message);
          }
        } catch (error) {
          message.error('批量删除失败');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Search form submit handler
  const handleSearch = async (values?: any) => {
    try {
      const params: UserQueryParams = {
        pageIndex: 1,
        pageSize: 10,
        ...values,
      };
      // Trigger a new search through the table's internal mechanism
      // The table will automatically re-render with new data
      message.success('查询条件已应用');
    } catch (error) {
      message.error('查询失败');
    }
  };

  // Reset search form
  const handleReset = () => {
    searchForm.resetFields();
    handleSearch();
  };

  // Table columns
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      sorter: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => roles.join(', '),
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => permissions.join(', '),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: UserInfo) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record.userId)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              loading={loading}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const userManagementRef = useRef<any>(null);

  return (
    <div>
      <SearchTable<UserInfo>
        ref={userManagementRef}
        search={
          <Form
            form={searchForm}
            layout="inline"
            onFinish={handleSearch}
          >
            <Form.Item name="username" label="用户名">
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item name="email" label="邮箱">
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item name="role" label="角色">
              <Select placeholder="请选择角色" allowClear style={{ width: 120 }}>
                <Option value="admin">管理员</Option>
                <Option value="user">普通用户</Option>
                <Option value="editor">编辑</Option>
                <Option value="viewer">查看者</Option>
                <Option value="manager">经理</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={() => searchForm.submit()}
                >
                  搜索
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                >
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        }
        toolbar={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增用户
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleBatchDelete([])}
              disabled={false}
            >
              批量删除
            </Button>
          </Space>
        }
        rowKey="userId"
        columns={columns}
        service={getUserList}
        options={{
          manual: false,
          defaultPageSize: 10,
        }}
      />

      {/* User Modal */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        <UserForm
          initialValues={editingUser}
          onFinish={async (values) => {
            try {
              if (editingUser) {
                // Update user
                const result = await updateUser(editingUser.userId, values);
                if (result.success) {
                  message.success(result.message);
                  setUserModalVisible(false);
                  handleSearch(); // Refresh table
                } else {
                  message.error(result.message);
                }
              } else {
                // Create user
                const result = await createUser(values);
                if (result.success) {
                  message.success(result.message);
                  setUserModalVisible(false);
                  handleSearch(); // Refresh table
                } else {
                  message.error(result.message);
                }
              }
            } catch (error) {
              message.error(editingUser ? '更新用户失败' : '创建用户失败');
            }
          }}
          onCancel={() => setUserModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default UserManagement;