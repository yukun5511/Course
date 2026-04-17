import { User, Course, Class, ClassStudent, CourseStatus, ClassStatus, Evaluation, Assignment, ClassMoment, TodoItem, TravelConfirmation, LeaveRecord, AttendanceStats, ShopItem, PopupMessage, Activity, Instructor, DashboardStats, PointsLog, BadgeRanking, SingleCourse } from './types'

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: '1',
    studentId: 'S001',
    name: '张三',
    avatar: '',
    company: '华为技术有限公司',
    position: '技术总监',
    tags: ['技术专家', '行业领袖'],
    role: 'student',
    phone: '138****1234',
    email: 'zhangsan@example.com',
    badges: 156,
    points: 2340,
    currentPeriod: 2,
    classId: 'c1',
    status: 'active'
  },
  {
    id: '2',
    studentId: 'S002',
    name: '李四',
    avatar: '',
    company: '阿里巴巴集团',
    position: '产品总监',
    tags: ['产品专家'],
    role: 'student',
    badges: 98,
    points: 1560,
    currentPeriod: 3,
    classId: 'c1',
    status: 'active'
  },
  {
    id: '3',
    name: '王教授',
    avatar: '',
    company: '北京大学',
    position: '教授',
    tags: ['学术主任'],
    role: 'academic_director',
    badges: 0,
    points: 0,
    status: 'active'
  },
  {
    id: '4',
    name: '管理员',
    avatar: '',
    company: '系统管理',
    position: '超级管理员',
    tags: ['管理员'],
    role: 'admin',
    badges: 0,
    points: 0,
    status: 'active'
  }
]

// 模拟课程数据
export const mockCourses: Course[] = [
  {
    id: 'course1',
    name: '数字化转型战略',
    period: 1,
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    location: '北京·中关村',
    instructor: '王教授',
    instructorId: '3',
    credits: 3,
    status: 'ended',
    description: '深入探讨企业数字化转型的核心战略与实施路径',
    image: '',
    classId: 'c1'
  },
  {
    id: 'course2',
    name: '人工智能与商业应用',
    period: 2,
    startDate: '2024-03-10',
    endDate: '2024-03-12',
    location: '上海·浦东',
    instructor: '李教授',
    instructorId: '5',
    credits: 4,
    status: 'ongoing',
    description: 'AI技术在商业场景中的落地实践',
    image: '',
    classId: 'c1'
  },
  {
    id: 'course3',
    name: '领导力与组织变革',
    period: 2,
    startDate: '2024-04-05',
    endDate: '2024-04-07',
    location: '深圳·南山',
    instructor: '陈教授',
    instructorId: '6',
    credits: 3,
    status: 'pending',
    description: '新时代领导力的塑造与组织变革管理',
    image: '',
    classId: 'c1'
  },
  {
    id: 'course4',
    name: '创新思维与方法',
    period: 3,
    startDate: '2024-05-20',
    endDate: '2024-05-22',
    location: '杭州·西湖',
    instructor: '张教授',
    instructorId: '7',
    credits: 3,
    status: 'pending',
    description: '培养创新思维，掌握创新方法论',
    image: '',
    classId: 'c1'
  }
]

// 模拟单课数据
export const mockSingleCourses: SingleCourse[] = [
  {
    id: 'sc1',
    courseId: 'course2',
    courseName: '人工智能与商业应用',
    date: '2024-03-10',
    startTime: '09:00',
    endTime: '12:00',
    location: '上海·浦东 A301',
    instructor: '李教授',
    students: [
      { studentId: '1', name: '张三', avatar: '', attendance: 'present' },
      { studentId: '2', name: '李四', avatar: '', attendance: 'present' },
    ]
  },
  {
    id: 'sc2',
    courseId: 'course2',
    courseName: '人工智能与商业应用',
    date: '2024-03-10',
    startTime: '14:00',
    endTime: '17:00',
    location: '上海·浦东 A301',
    instructor: '李教授',
    students: []
  },
  {
    id: 'sc3',
    courseId: 'course2',
    courseName: '人工智能与商业应用',
    date: '2024-03-11',
    startTime: '09:00',
    endTime: '12:00',
    location: '上海·浦东 A302',
    instructor: '李教授',
    students: []
  }
]

// 模拟班级数据
export const mockClasses: Class[] = [
  {
    id: 'c1',
    name: '2024春季高管班',
    director: '王教授',
    directorId: '3',
    monitor: '张三',
    monitorId: '1',
    committee: [
      { name: '李四', role: '学习委员' },
      { name: '赵六', role: '生活委员' },
      { name: '钱七', role: '文艺委员' }
    ],
    status: 'ongoing',
    period: 2,
    students: [
      { id: '1', name: '张三', avatar: '', company: '华为', position: '技术总监', isExcellent: true },
      { id: '2', name: '李四', avatar: '', company: '阿里', position: '产品总监', isExcellent: false },
      { id: '5', name: '赵六', avatar: '', company: '腾讯', position: '运营总监', isExcellent: true },
      { id: '6', name: '钱七', avatar: '', company: '百度', position: '研发总监', isExcellent: false },
      { id: '7', name: '孙八', avatar: '', company: '字节', position: '市场总监', isExcellent: false },
    ]
  },
  {
    id: 'c2',
    name: '2024秋季精英班',
    director: '陈教授',
    directorId: '8',
    monitor: '周九',
    monitorId: '9',
    committee: [],
    status: 'not_started',
    period: 3,
    students: []
  }
]

// 模拟评价数据
export const mockEvaluations: Evaluation[] = [
  {
    id: 'e1',
    courseId: 'course1',
    courseName: '数字化转型战略',
    questions: [
      { id: 'q1', question: '课程内容实用性', type: 'rating', answer: 5 },
      { id: 'q2', question: '导师授课水平', type: 'rating', answer: 4 },
      { id: 'q3', question: '组织安排满意度', type: 'rating', answer: 5 },
      { id: 'q4', question: '改进建议', type: 'text', answer: '希望增加案例分析环节' }
    ],
    submitted: true,
    result: {
      averageScore: 4.5,
      totalResponses: 28,
      details: [
        { question: '课程内容实用性', average: 4.6 },
        { question: '导师授课水平', average: 4.4 },
        { question: '组织安排满意度', average: 4.5 }
      ]
    }
  },
  {
    id: 'e2',
    courseId: 'course2',
    courseName: '人工智能与商业应用',
    questions: [
      { id: 'q1', question: '课程内容实用性', type: 'rating' },
      { id: 'q2', question: '导师授课水平', type: 'rating' },
      { id: 'q3', question: '组织安排满意度', type: 'rating' },
      { id: 'q4', question: '改进建议', type: 'text' }
    ],
    submitted: false
  }
]

// 模拟作业数据
export const mockAssignments: Assignment[] = [
  {
    id: 'a1',
    courseId: 'course2',
    courseName: '人工智能与商业应用',
    title: 'AI应用案例分析',
    content: '请选择一个AI在商业场景中的应用案例进行分析，不少于2000字',
    deadline: '2024-03-15',
    status: 'pending'
  },
  {
    id: 'a2',
    courseId: 'course1',
    courseName: '数字化转型战略',
    title: '企业数字化成熟度评估',
    content: '对您所在企业进行数字化成熟度评估，并提出改进建议',
    deadline: '2024-01-20',
    status: 'graded',
    score: 92,
    feedback: '分析深入，建议具体可行',
    submittedAt: '2024-01-18'
  }
]

// 模拟班级圈动态
export const mockMoments: ClassMoment[] = [
  {
    id: 'm1',
    author: { id: '1', name: '张三', avatar: '' },
    content: '今天的AI课程太精彩了！李教授的讲解深入浅出，收获满满 🎉',
    images: [],
    likes: ['2', '5', '6'],
    comments: [
      {
        id: 'c1',
        author: { id: '2', name: '李四', avatar: '' },
        content: '同感！特别是关于AI伦理的讨论很有启发',
        createdAt: '2024-03-10T18:30:00'
      }
    ],
    createdAt: '2024-03-10T17:00:00'
  },
  {
    id: 'm2',
    author: { id: '5', name: '赵六', avatar: '' },
    content: '分享一张今天的课堂照片，学习氛围真好！',
    images: [''],
    likes: ['1', '2'],
    comments: [],
    createdAt: '2024-03-10T16:00:00'
  }
]

// 模拟待办事项
export const mockTodos: TodoItem[] = [
  {
    id: 't1',
    title: '提交AI课程作业',
    description: '完成AI应用案例分析作业',
    dueDate: '2024-03-15',
    completed: false,
    type: 'assignment'
  },
  {
    id: 't2',
    title: '课程评价',
    description: '完成人工智能与商业应用课程评价',
    dueDate: '2024-03-13',
    completed: false,
    type: 'evaluation'
  },
  {
    id: 't3',
    title: '行程确认',
    description: '确认下周深圳课程的行程安排',
    dueDate: '2024-04-01',
    completed: false,
    type: 'other'
  }
]

// 模拟行程确认
export const mockTravelConfirmations: TravelConfirmation[] = [
  {
    id: 'tc1',
    courseId: 'course2',
    courseName: '人工智能与商业应用',
    attending: true,
    roomCount: 1,
    roomNumber: '808',
    arrivalTime: '2024-03-09 18:00',
    transport: 'plane',
    tripNumber: 'CA1234',
    submitted: true
  },
  {
    id: 'tc2',
    courseId: 'course3',
    courseName: '领导力与组织变革',
    attending: true,
    submitted: false
  }
]

// 模拟请假记录
export const mockLeaveRecords: LeaveRecord[] = [
  {
    id: 'l1',
    courseId: 'course2',
    courseName: '人工智能与商业应用',
    reason: '临时有重要会议冲突',
    status: 'approved',
    submittedAt: '2024-03-08'
  }
]

// 模拟考勤统计
export const mockAttendanceStats: AttendanceStats = {
  totalCourses: 12,
  attended: 10,
  late: 1,
  absent: 0,
  leave: 1
}

// 模拟商城商品
export const mockShopItems: ShopItem[] = [
  {
    id: 'si1',
    name: '数字化转型战略（二期）',
    type: 'course',
    image: '',
    badgeCost: 50,
    stock: 10,
    available: true,
    description: '旁听二期数字化转型战略课程'
  },
  {
    id: 'si2',
    name: '年度论坛VIP席位',
    type: 'activity',
    image: '',
    badgeCost: 100,
    stock: 5,
    available: true,
    description: '获得年度论坛VIP席位及晚宴邀请'
  },
  {
    id: 'si3',
    name: '导师一对一咨询',
    type: 'activity',
    image: '',
    badgeCost: 80,
    stock: 3,
    available: true,
    description: '30分钟导师一对一深度咨询'
  }
]

// 模拟弹窗消息
export const mockPopups: PopupMessage[] = [
  {
    id: 'p1',
    title: '新学期开始通知',
    content: '2024春季学期将于3月10日正式开始，请同学们做好课前准备。',
    image: '',
    published: true,
    createdAt: '2024-03-01'
  },
  {
    id: 'p2',
    title: '课程评价提醒',
    content: '人工智能与商业应用课程即将结束，请及时完成课程评价。',
    published: true,
    createdAt: '2024-03-11'
  }
]

// 模拟活动数据
export const mockActivities: Activity[] = [
  {
    id: 'act1',
    title: '年度行业峰会',
    content: '2024年度数字化转型峰会，汇聚行业精英，共同探讨未来趋势',
    image: '',
    onCarousel: true,
    registrations: [
      { id: 'r1', userId: '1', userName: '张三', userAvatar: '', registeredAt: '2024-03-01' },
      { id: 'r2', userId: '2', userName: '李四', userAvatar: '', registeredAt: '2024-03-02' }
    ],
    createdAt: '2024-02-15'
  }
]

// 模拟导师数据
export const mockInstructors: Instructor[] = [
  {
    id: '3',
    name: '王教授',
    avatar: '',
    title: '北京大学 教授',
    bio: '数字化转型领域资深专家，出版多部专著',
    courses: ['数字化转型战略'],
    enabled: true
  },
  {
    id: '5',
    name: '李教授',
    avatar: '',
    title: '清华大学 教授',
    bio: '人工智能与机器学习领域专家',
    courses: ['人工智能与商业应用'],
    enabled: true
  },
  {
    id: '6',
    name: '陈教授',
    avatar: '',
    title: '复旦大学 教授',
    bio: '组织行为学与领导力研究专家',
    courses: ['领导力与组织变革'],
    enabled: true
  }
]

// 模拟仪表盘数据
export const mockDashboardStats: DashboardStats = {
  totalStudents: 156,
  totalClasses: 8,
  totalCourses: 24,
  attendanceRate: 94.5,
  assignmentCompletionRate: 87.3,
  courseOccupancyRate: 96.2,
  instructorData: [
    { name: '王教授', rating: 4.8, courses: 6 },
    { name: '李教授', rating: 4.6, courses: 4 },
    { name: '陈教授', rating: 4.7, courses: 5 },
    { name: '张教授', rating: 4.5, courses: 3 }
  ]
}

// 模拟积分日志
export const mockPointsLogs: PointsLog[] = [
  {
    id: 'pl1',
    userId: '1',
    userName: '张三',
    classId: 'c1',
    className: '2024春季高管班',
    points: 10,
    reason: '按时提交作业',
    createdAt: '2024-03-15'
  },
  {
    id: 'pl2',
    userId: '1',
    userName: '张三',
    classId: 'c1',
    className: '2024春季高管班',
    points: 20,
    reason: '课堂积极互动',
    createdAt: '2024-03-10'
  },
  {
    id: 'pl3',
    userId: '2',
    userName: '李四',
    classId: 'c1',
    className: '2024春季高管班',
    points: 15,
    reason: '优秀作业',
    createdAt: '2024-03-14'
  }
]

// 模拟徽章排行
export const mockBadgeRankings: BadgeRanking[] = [
  { userId: '1', name: '张三', avatar: '', badges: 156, rank: 1 },
  { userId: '5', name: '赵六', avatar: '', badges: 142, rank: 2 },
  { userId: '2', name: '李四', avatar: '', badges: 98, rank: 3 },
  { userId: '6', name: '钱七', avatar: '', badges: 87, rank: 4 },
  { userId: '7', name: '孙八', avatar: '', badges: 76, rank: 5 }
]

// 默认导出所有模拟数据
export default {
  users: mockUsers,
  courses: mockCourses,
  classes: mockClasses,
  evaluations: mockEvaluations,
  assignments: mockAssignments,
  moments: mockMoments,
  todos: mockTodos,
  travelConfirmations: mockTravelConfirmations,
  leaveRecords: mockLeaveRecords,
  attendanceStats: mockAttendanceStats,
  shopItems: mockShopItems,
  popups: mockPopups,
  activities: mockActivities,
  instructors: mockInstructors,
  dashboardStats: mockDashboardStats,
  pointsLogs: mockPointsLogs,
  badgeRankings: mockBadgeRankings,
  singleCourses: mockSingleCourses
}
