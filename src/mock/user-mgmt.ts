import type { UserQueryParams, UserFormData, UserInfo, UserListResult, CreateUserResult, UpdateUserResult, DeleteUserResult } from '@/types/user';

// Mock user data
const mockUsers: UserInfo[] = [
  {
    userId: '1',
    username: 'admin',
    email: 'admin@example.com',
    roles: ['admin'],
    permissions: ['users', 'dashboard', 'settings'],
  },
  {
    userId: '2',
    username: 'user',
    email: 'user@example.com',
    roles: ['user'],
    permissions: ['dashboard'],
  },
  {
    userId: '3',
    username: 'editor',
    email: 'editor@example.com',
    roles: ['editor'],
    permissions: ['dashboard', 'editor'],
  },
  {
    userId: '4',
    username: 'viewer',
    email: 'viewer@example.com',
    roles: ['viewer'],
    permissions: ['dashboard'],
  },
  {
    userId: '5',
    username: 'manager',
    email: 'manager@example.com',
    roles: ['manager', 'user'],
    permissions: ['dashboard', 'users'],
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Check if username exists
export const checkUsernameExists = async (username: string, excludeId?: string): Promise<boolean> => {
  await delay(200); // Simulate API delay
  return mockUsers.some(user => user.username === username && user.id !== excludeId);
};

// Check if email exists
export const checkEmailExists = async (email: string, excludeId?: string): Promise<boolean> => {
  await delay(200); // Simulate API delay
  return mockUsers.some(user => user.email === email && user.id !== excludeId);
};

// Get user list with pagination, search, and filter
export const mockGetUserList = async (params: UserQueryParams): Promise<UserListResult> => {
  await delay(500); // Simulate API delay

  let filteredUsers = [...mockUsers];

  // Apply filters
  if (params.username) {
    filteredUsers = filteredUsers.filter(user =>
      user.username.toLowerCase().includes(params.username!.toLowerCase())
    );
  }

  if (params.email) {
    filteredUsers = filteredUsers.filter(user =>
      user.email.toLowerCase().includes(params.email!.toLowerCase())
    );
  }

  if (params.role) {
    filteredUsers = filteredUsers.filter(user =>
      user.roles.includes(params.role!)
    );
  }

  // Apply sorting
  if (params.sortBy) {
    filteredUsers.sort((a, b) => {
      const aValue = (a as any)[params.sortBy!];
      const bValue = (b as any)[params.sortBy!];

      if (params.orderBy === 'desc') {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });
  }

  // Apply pagination
  const total = filteredUsers.length;
  const startIndex = (params.pageIndex! - 1) * params.pageSize!;
  const endIndex = startIndex + params.pageSize!;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return {
    total,
    records: paginatedUsers,
  };
};

// Create new user
export const mockCreateUser = async (userData: UserFormData): Promise<CreateUserResult> => {
  await delay(800); // Simulate API delay

  // Check if username already exists
  const usernameExists = await checkUsernameExists(userData.username);
  if (usernameExists) {
    return {
      success: false,
      message: '用户名已存在',
    };
  }

  // Check if email already exists
  const emailExists = await checkEmailExists(userData.email);
  if (emailExists) {
    return {
      success: false,
      message: '邮箱已存在',
    };
  }

  // Create new user
  const newUser: UserInfo = {
    userId: String(mockUsers.length + 1),
    username: userData.username,
    email: userData.email,
    roles: userData.roles,
    permissions: [], // Default permissions
  };

  mockUsers.push(newUser);

  return {
    success: true,
    message: '用户创建成功',
    user: newUser,
  };
};

// Update user
export const mockUpdateUser = async (userId: string, userData: UserFormData): Promise<UpdateUserResult> => {
  await delay(800); // Simulate API delay

  const userIndex = mockUsers.findIndex(user => user.userId === userId);
  if (userIndex === -1) {
    return {
      success: false,
      message: '用户不存在',
    };
  }

  const existingUser = mockUsers[userIndex];

  // Check if username already exists (excluding current user)
  if (userData.username !== existingUser.username) {
    const usernameExists = await checkUsernameExists(userData.username, userId);
    if (usernameExists) {
      return {
        success: false,
        message: '用户名已存在',
      };
    }
  }

  // Check if email already exists (excluding current user)
  if (userData.email !== existingUser.email) {
    const emailExists = await checkEmailExists(userData.email, userId);
    if (emailExists) {
      return {
        success: false,
        message: '邮箱已存在',
      };
    }
  }

  // Update user
  mockUsers[userIndex] = {
    ...existingUser,
    username: userData.username,
    email: userData.email,
    roles: userData.roles,
  };

  return {
    success: true,
    message: '用户更新成功',
    user: mockUsers[userIndex],
  };
};

// Delete user
export const mockDeleteUser = async (userId: string): Promise<DeleteUserResult> => {
  await delay(500); // Simulate API delay

  const userIndex = mockUsers.findIndex(user => user.userId === userId);
  if (userIndex === -1) {
    return {
      success: false,
      message: '用户不存在',
    };
  }

  mockUsers.splice(userIndex, 1);

  return {
    success: true,
    message: '用户删除成功',
  };
};

// Batch delete users
export const mockBatchDeleteUsers = async (userIds: string[]): Promise<DeleteUserResult> => {
  await delay(800); // Simulate API delay

  let deletedCount = 0;
  let errorMessage = '';

  for (const userId of userIds) {
    const userIndex = mockUsers.findIndex(user => user.userId === userId);
    if (userIndex !== -1) {
      mockUsers.splice(userIndex, 1);
      deletedCount++;
    } else {
      errorMessage = `用户 ${userId} 不存在`;
    }
  }

  if (deletedCount === 0) {
    return {
      success: false,
      message: errorMessage || '没有可删除的用户',
    };
  }

  return {
    success: true,
    message: `成功删除 ${deletedCount} 个用户`,
  };
};