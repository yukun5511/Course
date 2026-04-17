import { request } from './client';
import { PageResponse } from './config';

// 课程信息
export interface CourseInfo {
  id: number;
  classId: number;
  className?: string;
  name: string;
  description?: string;
  teacherId?: string;
  teacherName?: string;
  coverImage?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  totalHours?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 创建课程请求
export interface CreateCourseRequest {
  classId: number;
  className?: string;
  name: string;
  description?: string;
  teacherId?: string;
  teacherName?: string;
  coverImage?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  totalHours?: number;
  status: string;
}

// 更新课程请求
export interface UpdateCourseRequest {
  name?: string;
  description?: string;
  teacherId?: string;
  teacherName?: string;
  coverImage?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  totalHours?: number;
  status?: string;
}

/**
 * 获取课程列表（分页）
 */
export const getCourseList = (params: {
  page?: number;
  size?: number;
  classId?: number;
  keyword?: string;
  status?: string;
}) => {
  return request.get<PageResponse<CourseInfo>>('/courses', { params });
};

/**
 * 获取班级下的所有课程
 */
export const getCoursesByClassId = (classId: number) => {
  return request.get<CourseInfo[]>(`/courses/class/${classId}`);
};

/**
 * 获取课程详情
 */
export const getCourseById = (id: number) => {
  return request.get<CourseInfo>(`/courses/${id}`);
};

/**
 * 创建课程
 */
export const createCourse = (data: CreateCourseRequest) => {
  return request.post<CourseInfo>('/courses', data);
};

/**
 * 更新课程
 */
export const updateCourse = (id: number, data: UpdateCourseRequest) => {
  return request.put<CourseInfo>(`/courses/${id}`, data);
};

/**
 * 删除课程
 */
export const deleteCourse = (id: number) => {
  return request.delete(`/courses/${id}`);
};
