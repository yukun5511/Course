import { request } from './client';
import { PageResponse } from './config';

// 评价信息
export interface EvaluationInfo {
  id: number;
  courseId: number;
  courseName?: string;
  title: string;
  description?: string;
  questions?: string; // JSON 字符串
  startTime?: string;
  endTime?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 创建评价请求
export interface CreateEvaluationRequest {
  courseId: number;
  courseName?: string;
  title: string;
  description?: string;
  questions?: string;
  startTime?: string;
  endTime?: string;
  status: string;
}

// 提交评价回答请求
export interface SubmitEvaluationRequest {
  answers: string; // JSON 字符串
}

/**
 * 获取评价列表（分页）
 */
export const getEvaluationList = (params: {
  page?: number;
  size?: number;
  courseId?: number;
  keyword?: string;
  status?: string;
}) => {
  return request.get<PageResponse<EvaluationInfo>>('/evaluations', { params });
};

/**
 * 获取课程下的所有评价
 */
export const getEvaluationsByCourseId = (courseId: number) => {
  return request.get<EvaluationInfo[]>(`/evaluations/course/${courseId}`);
};

/**
 * 获取评价详情
 */
export const getEvaluationById = (id: number) => {
  return request.get<EvaluationInfo>(`/evaluations/${id}`);
};

/**
 * 创建评价
 */
export const createEvaluation = (data: CreateEvaluationRequest) => {
  return request.post<EvaluationInfo>('/evaluations', data);
};

/**
 * 更新评价
 */
export const updateEvaluation = (id: number, data: CreateEvaluationRequest) => {
  return request.put<EvaluationInfo>(`/evaluations/${id}`, data);
};

/**
 * 删除评价
 */
export const deleteEvaluation = (id: number) => {
  return request.delete(`/evaluations/${id}`);
};

/**
 * 提交评价回答
 */
export const submitEvaluation = (id: number, data: SubmitEvaluationRequest) => {
  return request.post(`/evaluations/${id}/submit`, data);
};
