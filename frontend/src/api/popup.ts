import { request } from './client';
import { PageResponse } from './config';

// 弹窗消息
export interface PopupMessage {
  id: number;
  title: string;
  content: string;
  image?: string;
  published: number;
  createdBy?: number;
  creatorName?: string;
  publishedBy?: number;
  publisherName?: string;
  publishedAt?: string;
  revokedAt?: string;
  createdAt: string;
}

// 创建弹窗请求
export interface CreatePopupRequest {
  title: string;
  content: string;
  image?: string;
}

// 更新弹窗请求
export interface UpdatePopupRequest {
  title?: string;
  content?: string;
  image?: string;
}

/**
 * 获取弹窗列表（分页）
 */
export const getPopupList = (params: {
  page?: number;
  size?: number;
  title?: string;
  published?: number;
}) => {
  return request.get<PageResponse<PopupMessage>>('/popups', { params });
};

/**
 * 获取弹窗详情
 */
export const getPopupById = (id: number) => {
  return request.get<PopupMessage>(`/popups/${id}`);
};

/**
 * 创建弹窗
 */
export const createPopup = (data: CreatePopupRequest) => {
  return request.post<PopupMessage>('/popups', data);
};

/**
 * 更新弹窗
 */
export const updatePopup = (id: number, data: UpdatePopupRequest) => {
  return request.put<PopupMessage>(`/popups/${id}`, data);
};

/**
 * 删除弹窗
 */
export const deletePopup = (id: number) => {
  return request.delete<void>(`/popups/${id}`);
};

/**
 * 发布弹窗
 */
export const publishPopup = (id: number, userId: number) => {
  return request.post<void>(`/popups/${id}/publish`, { userId });
};

/**
 * 撤销弹窗
 */
export const revokePopup = (id: number) => {
  return request.post<void>(`/popups/${id}/revoke`);
};

/**
 * 获取已发布弹窗（小程序端）
 */
export const getPublishedPopups = (params?: { page?: number; size?: number }) => {
  return request.get<PageResponse<PopupMessage>>('/popups/published', { params });
};
