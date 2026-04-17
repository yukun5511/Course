import { request } from './client';
import { PageResponse } from './config';

// 活动信息
export interface ActivityInfo {
  id: number;
  title: string;
  content?: string;
  image?: string;
  onCarousel: number;
  createdBy?: number;
  creatorName?: string;
  registrationCount?: number;
  createdAt: string;
}

// 活动报名记录
export interface ActivityRegistration {
  id: number;
  activityId: number;
  activityTitle?: string;
  userId: number;
  userName?: string;
  studentId?: string;
  company?: string;
  position?: string;
  registeredAt: string;
}

// 创建活动请求
export interface CreateActivityRequest {
  title: string;
  content?: string;
  image?: string;
  onCarousel?: number;
}

// 更新活动请求
export interface UpdateActivityRequest {
  title?: string;
  content?: string;
  image?: string;
  onCarousel?: number;
}

/**
 * 获取活动列表（分页）
 */
export const getActivityList = (params: {
  page?: number;
  size?: number;
  title?: string;
  onCarousel?: number;
}) => {
  return request.get<PageResponse<ActivityInfo>>('/activities', { params });
};

/**
 * 获取活动详情
 */
export const getActivityById = (id: number) => {
  return request.get<ActivityInfo>(`/activities/${id}`);
};

/**
 * 创建活动
 */
export const createActivity = (data: CreateActivityRequest) => {
  return request.post<ActivityInfo>('/activities', data);
};

/**
 * 更新活动
 */
export const updateActivity = (id: number, data: UpdateActivityRequest) => {
  return request.put<ActivityInfo>(`/activities/${id}`, data);
};

/**
 * 删除活动
 */
export const deleteActivity = (id: number) => {
  return request.delete<void>(`/activities/${id}`);
};

/**
 * 报名活动
 */
export const registerActivity = (activityId: number, userId: number) => {
  return request.post<void>(`/activities/${activityId}/register`, { userId });
};

/**
 * 获取活动报名列表
 */
export const getRegistrationList = (
  activityId: number,
  params?: { page?: number; size?: number }
) => {
  return request.get<PageResponse<ActivityRegistration>>(
    `/activities/${activityId}/registrations`,
    { params }
  );
};

/**
 * 导出报名名单
 */
export const exportRegistrations = (activityId: number) => {
  return request.get<ActivityRegistration[]>(`/activities/${activityId}/export`);
};
