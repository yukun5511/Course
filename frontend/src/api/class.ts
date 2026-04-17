import { request } from './client';
import { PageResponse } from './config';

// 班级信息
export interface ClassInfo {
  id: number;
  name: string;
  description?: string;
  teacherId?: string;
  teacherName?: string;
  academicDirectorId?: string;
  academicDirectorName?: string;
  coverImage?: string;
  studentCount?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 创建班级请求
export interface CreateClassRequest {
  name: string;
  description?: string;
  teacherId?: string;
  teacherName?: string;
  academicDirectorId?: string;
  academicDirectorName?: string;
  coverImage?: string;
  status: string;
}

// 更新班级请求
export interface UpdateClassRequest {
  name?: string;
  description?: string;
  teacherId?: string;
  teacherName?: string;
  academicDirectorId?: string;
  academicDirectorName?: string;
  coverImage?: string;
  status?: string;
}

/**
 * 获取班级列表（分页）
 */
export const getClassList = (params: {
  page?: number;
  size?: number;
  keyword?: string;
  status?: string;
}) => {
  return request.get<PageResponse<ClassInfo>>('/classes', { params });
};

/**
 * 获取所有班级（用于下拉选择）
 */
export const getAllClasses = () => {
  return request.get<ClassInfo[]>('/classes/all');
};

/**
 * 获取班级详情
 */
export const getClassById = (id: number) => {
  return request.get<ClassInfo>(`/classes/${id}`);
};

/**
 * 创建班级
 */
export const createClass = (data: CreateClassRequest) => {
  return request.post<ClassInfo>('/classes', data);
};

/**
 * 更新班级
 */
export const updateClass = (id: number, data: UpdateClassRequest) => {
  return request.put<ClassInfo>(`/classes/${id}`, data);
};

/**
 * 删除班级
 */
export const deleteClass = (id: number) => {
  return request.delete(`/classes/${id}`);
};
