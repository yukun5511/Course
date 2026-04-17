import { request } from './client';
import { PageResponse } from './config';
import { UserInfo } from './auth';

// 用户查询参数
export interface UserQueryParams {
  name?: string;
  studentId?: string;
  role?: string;
  classId?: number;
  status?: string;
  page?: number;
  size?: number;
}

// 创建用户请求
export interface CreateUserRequest {
  studentId: string;
  name: string;
  password?: string;
  avatar?: string;
  company?: string;
  position?: string;
  tags?: string;
  role: string;
  phone?: string;
  email?: string;
  badges?: number;
  points?: number;
  currentPeriod?: number;
  classId?: number;
  status?: string;
}

// 更新用户请求
export interface UpdateUserRequest {
  name?: string;
  avatar?: string;
  company?: string;
  position?: string;
  tags?: string;
  phone?: string;
  email?: string;
  currentPeriod?: number;
  classId?: number;
  status?: string;
}

/**
 * 获取用户列表（分页）
 */
export const getUserList = (params: UserQueryParams) => {
  return request.get<PageResponse<UserInfo>>('/users', { params });
};

/**
 * 获取用户详情
 */
export const getUserById = (id: number) => {
  return request.get<UserInfo>(`/users/${id}`);
};

/**
 * 创建用户
 */
export const createUser = (data: CreateUserRequest) => {
  return request.post<UserInfo>('/users', data);
};

/**
 * 更新用户信息
 */
export const updateUser = (id: number, data: UpdateUserRequest) => {
  return request.put<UserInfo>(`/users/${id}`, data);
};

/**
 * 删除用户
 */
export const deleteUser = (id: number) => {
  return request.delete(`/users/${id}`);
};

/**
 * 更新用户状态
 */
export const updateUserStatus = (id: number, status: string) => {
  return request.patch(`/users/${id}/status`, { status });
};

/**
 * 修改用户积分
 */
export const updateUserPoints = (id: number, points: number) => {
  return request.patch(`/users/${id}/points`, { points });
};

/**
 * 启用/禁用账号
 */
export const updateUserEnabled = (id: number, enabled: number) => {
  return request.patch(`/users/${id}/enabled`, { enabled });
};

/**
 * 重置密码
 */
export const resetPassword = (id: number, newPassword: string) => {
  return request.post(`/users/${id}/reset-password`, { newPassword });
};
