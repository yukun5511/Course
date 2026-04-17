import { request } from './client';
import { PageResponse } from './config';

// 作业信息
export interface AssignmentInfo {
  id: number;
  courseId: number;
  courseName?: string;
  title: string;
  description?: string;
  attachmentUrl?: string;
  deadline: string;
  totalScore?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 创建作业请求
export interface CreateAssignmentRequest {
  courseId: number;
  courseName?: string;
  title: string;
  description?: string;
  attachmentUrl?: string;
  deadline: string;
  totalScore?: number;
  status: string;
}

/**
 * 获取作业列表（分页）
 */
export const getAssignmentList = (params: {
  page?: number;
  size?: number;
  courseId?: number;
  keyword?: string;
  status?: string;
}) => {
  return request.get<PageResponse<AssignmentInfo>>('/assignments', { params });
};

/**
 * 获取课程下的所有作业
 */
export const getAssignmentsByCourseId = (courseId: number) => {
  return request.get<AssignmentInfo[]>(`/assignments/course/${courseId}`);
};

/**
 * 获取作业详情
 */
export const getAssignmentById = (id: number) => {
  return request.get<AssignmentInfo>(`/assignments/${id}`);
};

/**
 * 创建作业
 */
export const createAssignment = (data: CreateAssignmentRequest) => {
  return request.post<AssignmentInfo>('/assignments', data);
};

/**
 * 更新作业
 */
export const updateAssignment = (id: number, data: CreateAssignmentRequest) => {
  return request.put<AssignmentInfo>(`/assignments/${id}`, data);
};

/**
 * 删除作业
 */
export const deleteAssignment = (id: number) => {
  return request.delete(`/assignments/${id}`);
};
