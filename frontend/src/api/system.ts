import { request } from './client';
import { PageResponse } from './config';

// 角色信息
export interface RoleInfo {
  id: number;
  name: string;
  code: string;
  description?: string;
  permissions?: string;
  createdAt: string;
}

// 菜单信息
export interface MenuInfo {
  id: number;
  parentId?: number;
  name: string;
  path?: string;
  icon?: string;
  sortOrder: number;
  createdAt: string;
}

// 系统配置
export interface SystemConfig {
  id: number;
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
}

// 操作日志
export interface OperationLog {
  id: number;
  userId?: number;
  userName: string;
  action: string;
  targetType?: string;
  targetId?: string;
  ipAddress?: string;
  createdAt: string;
}

// ==================== 角色管理 ====================

/**
 * 获取角色列表
 */
export const getRoleList = () => {
  return request.get<RoleInfo[]>('/system/roles');
};

/**
 * 创建角色
 */
export const createRole = (data: Partial<RoleInfo>) => {
  return request.post<RoleInfo>('/system/roles', data);
};

/**
 * 更新角色
 */
export const updateRole = (id: number, data: Partial<RoleInfo>) => {
  return request.put<RoleInfo>(`/system/roles/${id}`, data);
};

/**
 * 删除角色
 */
export const deleteRole = (id: number) => {
  return request.delete<void>(`/system/roles/${id}`);
};

// ==================== 菜单管理 ====================

/**
 * 获取菜单列表
 */
export const getMenuList = () => {
  return request.get<MenuInfo[]>('/system/menus');
};

/**
 * 创建菜单
 */
export const createMenu = (data: Partial<MenuInfo>) => {
  return request.post<MenuInfo>('/system/menus', data);
};

/**
 * 更新菜单
 */
export const updateMenu = (id: number, data: Partial<MenuInfo>) => {
  return request.put<MenuInfo>(`/system/menus/${id}`, data);
};

/**
 * 删除菜单
 */
export const deleteMenu = (id: number) => {
  return request.delete<void>(`/system/menus/${id}`);
};

// ==================== 系统配置 ====================

/**
 * 获取系统配置列表
 */
export const getConfigList = () => {
  return request.get<SystemConfig[]>('/system/configs');
};

/**
 * 更新系统配置
 */
export const updateConfig = (key: string, data: { value: string; description?: string }) => {
  return request.put<SystemConfig>(`/system/configs/${key}`, data);
};

// ==================== 操作日志 ====================

/**
 * 获取操作日志列表（分页）
 */
export const getOperationLogs = (params: {
  page?: number;
  size?: number;
  userId?: number;
  action?: string;
}) => {
  return request.get<PageResponse<OperationLog>>('/system/logs', { params });
};

/**
 * 记录操作日志
 */
export const createOperationLog = (data: Partial<OperationLog>) => {
  return request.post<OperationLog>('/system/logs', data);
};
