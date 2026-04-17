// 用户类型
export type UserRole = 'student' | 'academic_director' | 'admin'

export interface User {
  id: string
  studentId?: string
  name: string
  avatar: string
  company: string
  position: string
  tags: string[]
  role: UserRole
  phone?: string
  email?: string
  badges: number
  points: number
  currentPeriod?: number
  classId?: string
  status: 'active' | 'graduated' | 'dropped'
}

// 课程相关
export type CourseStatus = 'ended' | 'ongoing' | 'pending'

export interface Course {
  id: string
  name: string
  period: number
  startDate: string
  endDate: string
  location: string
  instructor: string
  instructorId: string
  credits?: number
  status: CourseStatus
  description: string
  image: string
  classId?: string
  representative?: string
}

export interface SingleCourse {
  id: string
  courseId: string
  courseName: string
  date: string
  startTime: string
  endTime: string
  location: string
  instructor: string
  students: StudentRecord[]
}

export interface StudentRecord {
  studentId: string
  name: string
  avatar: string
  attendance: 'present' | 'late' | 'absent' | 'leave'
}

// 班级相关
export type ClassStatus = 'not_started' | 'ongoing' | 'graduated'

export interface Class {
  id: string
  name: string
  director: string
  directorId: string
  monitor: string
  monitorId: string
  committee: { name: string; role: string }[]
  status: ClassStatus
  students: ClassStudent[]
  period: number
}

export interface ClassStudent {
  id: string
  name: string
  avatar: string
  company: string
  position: string
  isExcellent: boolean
}

// 评价相关
export interface Evaluation {
  id: string
  courseId: string
  courseName: string
  questions: EvaluationQuestion[]
  submitted: boolean
  result?: EvaluationResult
}

export interface EvaluationQuestion {
  id: string
  question: string
  type: 'rating' | 'text'
  answer?: number | string
}

export interface EvaluationResult {
  averageScore: number
  totalResponses: number
  details: { question: string; average: number }[]
}

// 作业相关
export interface Assignment {
  id: string
  courseId: string
  courseName: string
  title: string
  content: string
  deadline: string
  status: 'pending' | 'submitted' | 'graded'
  score?: number
  feedback?: string
  submittedAt?: string
  attachment?: string
}

// 班级圈动态
export interface ClassMoment {
  id: string
  author: {
    id: string
    name: string
    avatar: string
  }
  content: string
  images: string[]
  likes: string[]
  comments: MomentComment[]
  createdAt: string
}

export interface MomentComment {
  id: string
  author: {
    id: string
    name: string
    avatar: string
  }
  content: string
  createdAt: string
}

// 待办事项
export interface TodoItem {
  id: string
  title: string
  description: string
  dueDate: string
  completed: boolean
  type: 'course' | 'assignment' | 'evaluation' | 'other'
}

// 行程确认
export interface TravelConfirmation {
  id: string
  courseId: string
  courseName: string
  attending: boolean
  roomCount?: number
  roomNumber?: string
  arrivalTime?: string
  transport?: 'plane' | 'train' | 'car' | 'other'
  tripNumber?: string
  submitted: boolean
}

// 请假记录
export interface LeaveRecord {
  id: string
  courseId: string
  courseName: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
}

export interface AttendanceStats {
  totalCourses: number
  attended: number
  late: number
  absent: number
  leave: number
}

// 积分商城
export interface ShopItem {
  id: string
  name: string
  type: 'course' | 'activity'
  image: string
  badgeCost: number
  stock: number
  available: boolean
  description: string
}

export interface ExchangeRecord {
  id: string
  itemId: string
  itemName: string
  badgeCost: number
  exchangedAt: string
}

// 弹窗消息
export interface PopupMessage {
  id: string
  title: string
  content: string
  image?: string
  published: boolean
  createdAt: string
}

// 考勤打卡
export interface CheckIn {
  id: string
  classId: string
  className: string
  courseId: string
  courseName: string
  location: {
    latitude: number
    longitude: number
    radius: number
    name: string
  }
  qrCode: string
  createdAt: string
  expiresAt: string
}

// 活动
export interface Activity {
  id: string
  title: string
  content: string
  image: string
  onCarousel: boolean
  registrations: ActivityRegistration[]
  createdAt: string
}

export interface ActivityRegistration {
  id: string
  userId: string
  userName: string
  userAvatar: string
  registeredAt: string
}

// 导师
export interface Instructor {
  id: string
  name: string
  avatar: string
  title: string
  bio: string
  courses: string[]
  enabled: boolean
}

// 统计数据
export interface DashboardStats {
  totalStudents: number
  totalClasses: number
  totalCourses: number
  attendanceRate: number
  assignmentCompletionRate: number
  courseOccupancyRate: number
  instructorData: { name: string; rating: number; courses: number }[]
}

// 积分日志
export interface PointsLog {
  id: string
  userId: string
  userName: string
  classId: string
  className: string
  points: number
  reason: string
  createdAt: string
}

// 徽章排行
export interface BadgeRanking {
  userId: string
  name: string
  avatar: string
  badges: number
  rank: number
}
