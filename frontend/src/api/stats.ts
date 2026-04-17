import { request } from './client';

/**
 * 获取仪表盘统计数据
 */
export const getDashboardStats = () => {
  return request.get<any>('/stats/dashboard');
};

/**
 * 获取出勤率统计
 */
export const getAttendanceRateStats = (params?: {
  classId?: number;
  courseId?: number;
}) => {
  return request.get<any>('/stats/attendance-rate', { params });
};

/**
 * 获取作业完成率统计
 */
export const getAssignmentCompletionStats = (params?: {
  classId?: number;
  courseId?: number;
}) => {
  return request.get<any>('/stats/assignment-completion', { params });
};

/**
 * 获取课程上座率统计
 */
export const getCourseOccupancyStats = (params?: {
  classId?: number;
  courseId?: number;
}) => {
  return request.get<any>('/stats/course-occupancy', { params });
};

/**
 * 获取导师数据统计
 */
export const getInstructorStats = (instructorId: number) => {
  return request.get<any>('/stats/instructor-data', {
    params: { instructorId },
  });
};
