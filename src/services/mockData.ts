/**
 * Mock数据服务
 * 用于在没有后端API时模拟数据
 */

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock用户数据
export const mockUsers = {
  teacher: {
    id: 't001',
    name: '张老师',
    email: 'teacher@example.com',
    role: 'teacher',
    avatar: '',
  },
  student: {
    id: 's001',
    name: '李同学',
    email: 'student@example.com',
    role: 'student',
    avatar: '',
  }
};

// Mock班级数据
export const mockClasses = [
  {
    id: 'c001',
    name: '2024级应用物理1班',
    description: '大一应用物理专业',
    teacherId: 't001',
    studentCount: 45,
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'c002',
    name: '2024级应用物理2班',
    description: '大一应用物理专业',
    teacherId: 't001',
    studentCount: 42,
    createdAt: '2024-01-15T08:00:00Z',
  },
];

// Mock学生数据
export const mockStudents = [
  { id: 's001', name: '李同学', email: 'student1@example.com', studentId: '2024001' },
  { id: 's002', name: '王同学', email: 'student2@example.com', studentId: '2024002' },
  { id: 's003', name: '张同学', email: 'student3@example.com', studentId: '2024003' },
];

// Mock题目数据
export const mockQuestions = [
  {
    id: 'q001',
    title: '牛顿第一定律应用',
    content: { text: '一个物体在光滑水平面上运动...' },
    type: '计算题' as const,
    chapter: '力学' as const,
    difficulty: '中等' as const,
    answer: { result: 'F=ma' },
    analysis: '根据牛顿第二定律...',
    usedCount: 15,
    isVerified: true,
    source: 'local' as const,
  },
  {
    id: 'q002',
    title: '电磁感应定律',
    content: { text: '一个导体在磁场中运动...' },
    type: '选择题' as const,
    chapter: '电磁学' as const,
    difficulty: '困难' as const,
    answer: { result: 'B' },
    analysis: '根据法拉第电磁感应定律...',
    usedCount: 8,
    isVerified: true,
    source: 'cloud' as const,
  },
];

// Mock作业数据
export const mockAssignments = [
  {
    id: 'a001',
    title: '力学基础作业',
    description: '完成课本第3章习题',
    classId: 'c001',
    dueDate: '2024-12-31',
    status: 'published',
    questionCount: 10,
    submittedCount: 35,
  },
];

// Mock统计数据
export const mockStats = {
  weeklyAssignments: { value: 5, detail: '+2', color: 'brand' },
  pendingGrading: { value: 12, detail: '待处理', color: 'amber' },
  passRate: { value: '85%', detail: '+5%', color: 'green' },
  errorRate: { value: '15%', detail: '-2%', color: 'indigo' },
};

// Mock API响应
export const mockAPI = {
  // 登录
  async login(email: string, _password: string) {
    await delay(500);
    if (email.includes('teacher')) {
      return {
        token: 'mock-teacher-token',
        user: mockUsers.teacher,
      };
    }
    return {
      token: 'mock-student-token',
      user: mockUsers.student,
    };
  },

  // 获取班级列表
  async getClasses() {
    await delay(300);
    return { classes: mockClasses };
  },

  // 获取班级详情
  async getClassDetail(id: string) {
    await delay(300);
    const cls = mockClasses.find(c => c.id === id);
    if (!cls) {
      throw new Error('班级不存在');
    }
    return {
      class: { 
        id: cls.id,
        name: cls.name,
        description: cls.description,
        teacherId: cls.teacherId,
        studentCount: cls.studentCount,
        createdAt: cls.createdAt,
        teacherName: '张老师' 
      },
      students: mockStudents.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        studentId: s.studentId,
        joinedAt: '2024-01-15T08:00:00Z',
      })),
    };
  },

  // 获取题目列表
  async getQuestions() {
    await delay(300);
    return mockQuestions;
  },

  // 获取作业列表
  async getAssignments() {
    await delay(300);
    return { assignments: mockAssignments };
  },

  // 获取统计数据
  async getDashboardStats() {
    await delay(300);
    return {
      stats: mockStats,
      todos: {
        pendingAssignments: 12,
        aiReports: 3,
      },
    };
  },

  // 获取系统配置
  async getSystemConfig() {
    await delay(200);
    return {
      system: {
        name: '阅小师',
        logo: '🦖',
        version: '1.0.0',
      },
      teacher: {
        title: 'Teacher Pro',
        menu: [
          { id: 'homepage', label: '首页', icon: 'LayoutDashboard' },
          { id: 'classes', label: '班级管理', icon: 'Users' },
          { id: 'question-bank', label: '题库管理', icon: 'BookOpen' },
          { id: 'assignment', label: '作业管理', icon: 'FileEdit' },
          { id: 'analysis', label: '学习分析', icon: 'BarChart2' },
          { id: 'settings', label: '设置', icon: 'Settings' },
        ],
      },
      ai: {
        modules: [
          { type: 'generation', title: '智能组卷', description: '基于章节、难度、题型自动生成' },
          { type: 'correction', title: '专业批改', description: 'OCR扫描与分步逻辑校验' },
          { type: 'analysis', title: '学情分析', description: '班级薄弱知识点精准画像' },
        ],
      },
    };
  },
};

export default mockAPI;
