import React, { useState } from 'react';
import { Form, Input, Select, Button, Space, message } from 'antd';
import type { FormProps } from 'antd';
import type { UserFormData } from '@/types/user';
import { checkUsernameExists, checkEmailExists } from '@/mock/user-mgmt';

const { Option } = Select;

interface UserFormProps {
  initialValues?: any;
  onFinish: (values: UserFormData) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialValues, onFinish, onCancel }) => {
  const [form] = Form.useForm();
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Custom validator for username uniqueness
  const validateUsername = async (rule: any, value: string) => {
    if (!value) {
      return Promise.reject('请输入用户名');
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
      return Promise.reject('用户名只能包含字母、数字和下划线，长度3-20位');
    }

    setCheckingUsername(true);
    try {
      const exists = await checkUsernameExists(value, initialValues?.userId);
      if (exists) {
        return Promise.reject('用户名已存在');
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject('验证用户名失败');
    } finally {
      setCheckingUsername(false);
    }
  };

  // Custom validator for email uniqueness
  const validateEmail = async (rule: any, value: string) => {
    if (!value) {
      return Promise.reject('请输入邮箱');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return Promise.reject('请输入有效的邮箱地址');
    }

    setCheckingEmail(true);
    try {
      const exists = await checkEmailExists(value, initialValues?.userId);
      if (exists) {
        return Promise.reject('邮箱已存在');
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject('验证邮箱失败');
    } finally {
      setCheckingEmail(false);
    }
  };

  // Custom validator for password
  const validatePassword = (rule: any, value: string) => {
    if (!initialValues && !value) {
      return Promise.reject('请输入密码');
    }

    if (value && value.length < 6) {
      return Promise.reject('密码长度不能少于6位');
    }

    if (value && value.length > 20) {
      return Promise.reject('密码长度不能超过20位');
    }

    if (value && !/^[a-zA-Z0-9_!@#$%^&*()]+$/.test(value)) {
      return Promise.reject('密码只能包含字母、数字和特殊字符 _!@#$%^&*()');
    }

    return Promise.resolve();
  };

  // Custom validator for confirm password
  const validateConfirmPassword = (rule: any, value: string) => {
    const password = form.getFieldValue('password');
    if (value && password !== value) {
      return Promise.reject('两次输入的密码不一致');
    }
    return Promise.resolve();
  };

  const handleSubmit: FormProps<UserFormData>['onFinish'] = (values) => {
    onFinish(values);
  };

  return (
    <Form
      form={form}
      initialValues={{
        username: initialValues?.username || '',
        email: initialValues?.email || '',
        roles: initialValues?.roles || [],
        password: '',
        confirmPassword: '',
      }}
      onFinish={handleSubmit}
      layout="vertical"
      style={{ maxWidth: '100%' }}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          { required: true, message: '请输入用户名' },
          { validator: validateUsername },
        ]}
      >
        <Input
          placeholder="请输入用户名"
          disabled={checkingUsername}
          addonAfter={checkingUsername ? '检查中...' : undefined}
        />
      </Form.Item>

      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' },
          { validator: validateEmail },
        ]}
      >
        <Input
          placeholder="请输入邮箱"
          disabled={checkingEmail}
          addonAfter={checkingEmail ? '检查中...' : undefined}
        />
      </Form.Item>

      <Form.Item
        name="roles"
        label="角色"
        rules={[{ required: true, message: '请选择角色' }]}
      >
        <Select
          mode="multiple"
          placeholder="请选择角色"
          options={[
            { value: 'admin', label: '管理员' },
            { value: 'user', label: '普通用户' },
            { value: 'editor', label: '编辑' },
            { value: 'viewer', label: '查看者' },
            { value: 'manager', label: '经理' },
          ]}
        />
      </Form.Item>

      {!initialValues && (
        <>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ validator: validatePassword }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[{ validator: validateConfirmPassword }]}
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>
        </>
      )}

      <Form.Item>
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>
            取消
          </Button>
          <Button type="primary" htmlType="submit">
            {initialValues ? '更新' : '创建'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UserForm;