import { request } from './client';
import { PageResponse } from './config';

// 打卡任务信息
export interface CheckinInfo {
  id: number;
  courseId: number;
  courseName?: string;
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 打卡记录信息
export interface CheckinRecordInfo {
  id: number;
  checkinId: number;
  userId: number;
  userName?: string;
  checkinTime: string;
  location?: string;
  imageUrl?: string;
  remark?: string;
  status: string;
  createdAt: string;
}

// 请假记录信息
export interface LeaveRecordInfo {
  id: number;
  userId: number;
  userName?: string;
  reason: string;
  startTime: string;
  endTime: string;
  attachmentUrl?: string;
  status: string; // pending, approved, rejected
  approverId?: string;
  approverName?: string;
  rejectReason?: string;
  approveTime?: string;
  createdAt: string;
  updatedAt: string;
}

// 创建打卡任务请求
export interface CreateCheckinRequest {
  courseId: number;
  courseName?: string;
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  status: string;
}

// 打卡请求
export interface DoCheckinRequest {
  location?: string;
  imageUrl?: string;
  remark?: string;
}

// 请假申请请求
export interface LeaveRequest {
  reason: string;
  startTime: string;
  endTime: string;
  attachmentUrl?: string;
}

// 审批请假请求
export interface ApproveLeaveRequest {
  status: string; // approved, rejected
  rejectReason?: string;
}

/**
 * 获取打卡任务列表（分页）
 */
export const getCheckinList = (params: {
  page?: number;
  size?: number;
  courseId?: number;
  status?: string;
}) => {
  return request.get<PageResponse<CheckinInfo>>('/attendance/checkins', { params });
};

/**
 * 获取打卡任务详情
 */
export const getCheckinById = (id: number) => {
  return request.get<CheckinInfo>(`/attendance/checkins/${id}`);
};

/**
 * 创建打卡任务
 */
export const createCheckin = (data: CreateCheckinRequest) => {
  return request.post<CheckinInfo>('/attendance/checkins', data);
};

/**
 * 更新打卡任务
 */
export const updateCheckin = (id: number, data: CreateCheckinRequest) => {
  return request.put<CheckinInfo>(`/attendance/checkins/${id}`, data);
};

/**
 * 删除打卡任务
 */
export const deleteCheckin = (id: number) => {
  return request.delete(`/attendance/checkins/${id}`);
};

/**
 * 执行打卡
 */
export const doCheckin = (checkinId: number, data: DoCheckinRequest) => {
  return request.post(`/attendance/checkins/${checkinId}/do`, data);
};

/**
 * 获取请假记录列表（分页）
 */
export const getLeaveRecords = (params: {
  page?: number;
  size?: number;
  userId?: number;
  status?: string;
}) => {
  return request.get<PageResponse<LeaveRecordInfo>>('/attendance/leave', { params });
};

/**
 * 提交请假申请
 */
export const applyLeave = (data: LeaveRequest) => {
  return request.post<LeaveRecordInfo>('/attendance/leave', data);
};

/**
 * 审批请假
 */
export const approveLeave = (leaveId: number, data: ApproveLeaveRequest) => {
  return request.put(`/attendance/leave/${leaveId}/approve`, data);
};
