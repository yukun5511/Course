import { request } from './client';
import { PageResponse } from './config';

// ============================================
// 学员信息相关
// ============================================

export interface StudentInfo {
  id: number;
  studentId: string;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  position?: string;
  avatar?: string;
  classId?: number;
  className?: string;
  badges: number;
  points: number;
  role: string;
  status: string;
  createdAt: string;
}

/**
 * 获取当前学员信息
 */
export const getStudentInfo = () => {
  return request.get<StudentInfo>('/student/info');
};

/**
 * 更新学员信息
 */
export const updateStudentInfo = (data: Partial<StudentInfo>) => {
  return request.put<StudentInfo>('/student/info', data);
};

// ============================================
// 课程/课表相关
// ============================================

export interface StudentCourse {
  id: number;
  name: string;
  teacherName: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  status: string;
  period?: number;
  progress?: number;
}

/**
 * 获取学员的课表列表
 */
export const getStudentCourses = (params?: {
  page?: number;
  size?: number;
  status?: string;
  period?: number;
}) => {
  return request.get<PageResponse<StudentCourse>>('/student/courses', { params });
};

/**
 * 获取课程详情
 */
export const getStudentCourseDetail = (courseId: number) => {
  return request.get<StudentCourse>(`/student/courses/${courseId}`);
};

// ============================================
// 作业相关
// ============================================

export interface StudentAssignment {
  id: number;
  courseId: number;
  courseName: string;
  title: string;
  description?: string;
  deadline: string;
  status: string; // pending, submitted, graded, overdue
  score?: number;
  feedback?: string;
  submittedAt?: string;
  createdAt: string;
}

/**
 * 获取学员的作业列表
 */
export const getStudentAssignments = (params?: {
  page?: number;
  size?: number;
  courseId?: number;
  status?: string;
}) => {
  return request.get<PageResponse<StudentAssignment>>('/student/assignments', { params });
};

/**
 * 提交作业
 */
export const submitAssignment = (assignmentId: number, data: {
  content?: string;
  attachmentUrl?: string;
}) => {
  return request.post(`/student/assignments/${assignmentId}/submit`, data);
};

// ============================================
// 课程评价相关
// ============================================

export interface CourseEvaluation {
  id: number;
  courseId: number;
  courseName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

/**
 * 获取学员的评价列表
 */
export const getStudentEvaluations = (params?: {
  page?: number;
  size?: number;
}) => {
  return request.get<PageResponse<CourseEvaluation>>('/student/evaluations', { params });
};

/**
 * 提交课程评价
 */
export const submitCourseEvaluation = (data: {
  courseId: number;
  rating: number;
  comment?: string;
}) => {
  return request.post<CourseEvaluation>('/student/evaluations', data);
};

// ============================================
// 班级相关
// ============================================

export interface StudentClass {
  id: number;
  name: string;
  director: string;
  period: number;
  studentCount: number;
  status: string;
  startDate?: string;
  endDate?: string;
}

export interface ClassMember {
  id: number;
  studentId: string;
  name: string;
  company?: string;
  position?: string;
  avatar?: string;
}

export interface ClassMoment {
  id: string;
  userId: number;
  userName: string;
  userAvatar?: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  liked: boolean;
  createdAt: string;
}

/**
 * 获取学员所在班级信息
 */
export const getStudentClass = () => {
  return request.get<StudentClass>('/student/class');
};

/**
 * 获取班级成员列表
 */
export const getClassMembers = (classId: number, params?: {
  page?: number;
  size?: number;
}) => {
  return request.get<PageResponse<ClassMember>>(`/student/class/${classId}/members`, { params });
};

/**
 * 获取班级圈动态
 */
export const getClassMoments = (classId: number, params?: {
  page?: number;
  size?: number;
}) => {
  return request.get<PageResponse<ClassMoment>>(`/student/class/${classId}/moments`, { params });
};

/**
 * 发布班级圈动态
 */
export const createClassMoment = (classId: number, data: {
  content: string;
  images?: string[];
}) => {
  return request.post<ClassMoment>(`/student/class/${classId}/moments`, data);
};

/**
 * 点赞动态
 */
export const likeMoment = (momentId: string) => {
  return request.post(`/student/moments/${momentId}/like`);
};

// ============================================
// 考勤相关
// ============================================

export interface CheckinRecord {
  id: number;
  courseId: number;
  courseName: string;
  checkinTime: string;
  status: string; // normal, late, absent, leave
  location?: string;
}

export interface AttendanceStats {
  total: number;
  normal: number;
  late: number;
  absent: number;
  leave: number;
  rate: number;
}

/**
 * 打卡签到
 */
export const checkin = (data: {
  courseId: number;
  latitude: number;
  longitude: number;
  location?: string;
}) => {
  return request.post('/student/attendance/checkin', data);
};

/**
 * 获取打卡记录
 */
export const getCheckinRecords = (params?: {
  page?: number;
  size?: number;
  courseId?: number;
}) => {
  return request.get<PageResponse<CheckinRecord>>('/student/attendance/records', { params });
};

/**
 * 获取出勤统计
 */
export const getAttendanceStats = () => {
  return request.get<AttendanceStats>('/student/attendance/stats');
};

// ============================================
// 请假相关
// ============================================

export interface LeaveRecord {
  id: number;
  courseId: number;
  courseName: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: string; // pending, approved, rejected
  createdAt: string;
}

/**
 * 申请请假
 */
export const applyStudentLeave = (data: {
  courseId: number;
  reason: string;
  startDate: string;
  endDate: string;
}) => {
  return request.post<LeaveRecord>('/student/leave', data);
};

/**
 * 获取请假记录
 */
export const getStudentLeaveRecords = (params?: {
  page?: number;
  size?: number;
  status?: string;
}) => {
  return request.get<PageResponse<LeaveRecord>>('/student/leave', { params });
};

// ============================================
// 积分相关
// ============================================

export interface PointsInfo {
  totalPoints: number;
  availablePoints: number;
  usedPoints: number;
  badges: number;
}

export interface PointsLog {
  id: number;
  points: number;
  reason: string;
  createdAt: string;
}

/**
 * 获取积分信息
 */
export const getPointsInfo = () => {
  return request.get<PointsInfo>('/student/points');
};

/**
 * 获取积分流水
 */
export const getPointsLogs = (params?: {
  page?: number;
  size?: number;
}) => {
  return request.get<PageResponse<PointsLog>>('/student/points/logs', { params });
};

// ============================================
// 待办事项相关
// ============================================

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  completed: boolean;
  type: string; // assignment, checkin, evaluation, etc.
  relatedId?: number;
}

/**
 * 获取待办事项列表
 */
export const getTodos = (params?: {
  page?: number;
  size?: number;
  completed?: boolean;
}) => {
  return request.get<PageResponse<TodoItem>>('/student/todos', { params });
};

/**
 * 完成待办事项
 */
export const completeTodo = (todoId: string) => {
  return request.put(`/student/todos/${todoId}/complete`);
};

// ============================================
// 行程确认相关
// ============================================

export interface TravelConfirmation {
  id: number;
  courseId: number;
  courseName: string;
  location: string;
  startDate: string;
  endDate: string;
  submitted: boolean;
  notes?: string;
}

/**
 * 获取行程确认列表
 */
export const getTravelConfirmations = (params?: {
  page?: number;
  size?: number;
  submitted?: boolean;
}) => {
  return request.get<PageResponse<TravelConfirmation>>('/student/travel', { params });
};

/**
 * 提交行程确认
 */
export const submitTravelConfirmation = (travelId: number, data: {
  notes?: string;
}) => {
  return request.put(`/student/travel/${travelId}`, data);
};

// ============================================
// 通知公告相关
// ============================================

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'high' | 'medium' | 'low';
  createdAt: string;
}

/**
 * 获取待办事项列表
 */
export const getStudentTodos = (params?: {
  page?: number;
  size?: number;
  completed?: boolean;
}) => {
  return request.get<PageResponse<Todo>>('/student/todos', { params });
};

/**
 * 更新待办事项状态
 */
export const updateTodoStatus = (todoId: string, completed: boolean) => {
  return request.put(`/student/todos/${todoId}`, { completed });
};

export interface Announcement {
  id: string;
  title: string;
  content: string;
  image?: string;
  published: boolean;
  createdAt: string;
}

/**
 * 获取通知公告列表
 */
export const getAnnouncements = (params?: {
  page?: number;
  size?: number;
}) => {
  return request.get<PageResponse<Announcement>>('/student/announcements', { params });
};

/**
 * 获取弹窗消息
 */
export const getPopups = () => {
  return request.get<Announcement[]>('/student/popups');
};
