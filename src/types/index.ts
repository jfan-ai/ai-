// 用户相关类型
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'student';
  avatar?: string;
  createdAt?: string;
}

export interface Teacher extends User {
  role: 'teacher';
  department?: string;
  title?: string;
  isVerified?: boolean;
  idCard?: string;
}

export interface Student extends User {
  role: 'student';
  studentId?: string;
  className?: string;
  grade?: string;
  physicsLevel?: string;
}

// 题目相关类型
export type QuestionType = '选择题' | '填空题' | '计算题' | '简答题';
export type Difficulty = '简单' | '中等' | '困难';
export type Chapter = '力学' | '热学' | '电磁学' | '光学' | '近代物理';
export type Source = 'local' | 'cloud';

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  difficulty: Difficulty;
  chapter: Chapter;
  content: {
    text: string;
    images?: string[];
  };
  answer: {
    result: string;
    steps?: string[];
  };
  analysis?: string;
  source: Source;
  usedCount: number;
  isVerified: boolean;
  createdBy?: string;
  creatorName?: string;
  createdAt?: string;
}

// 作业相关类型
export type AssignmentStatus = 'draft' | 'active' | 'finished' | 'graded';
export type GradingType = 'AI' | '人工' | 'AI+人工';

export interface Assignment {
  id: string;
  title: string;
  teacherId: string;
  teacherName?: string;
  className: string;
  deadline: string;
  gradingType: GradingType;
  status: AssignmentStatus;
  questionIds: string[];
  questions?: Question[];
  submissionsCount?: number;
  createdAt?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName?: string;
  answers: Record<string, string>;
  score?: number;
  aiFeedback?: AIFeedback;
  status: 'submitted' | 'graded';
  submittedAt?: string;
  gradedAt?: string;
}

export interface AIFeedback {
  score: number;
  isCorrect: boolean;
  errorPoints: string[];
  feedback: string;
  suggestions: string[];
}

// 错题本类型
export interface ErrorQuestion {
  id: string;
  studentId: string;
  questionId: string;
  question?: Question;
  errorType?: string;
  errorCount: number;
  lastReviewedAt?: string;
  createdAt?: string;
}

// 学习分析类型
export interface KnowledgeMastery {
  chapter: Chapter;
  mastery: number;
  attempts: number;
  status: 'success' | 'normal' | 'warning' | 'danger';
}

export interface AIInsight {
  type: 'warning' | 'success' | 'info';
  title: string;
  content: string;
}

export interface ClassActivity {
  day: string;
  count: number;
}

// 成长报告类型
export interface GrowthReport {
  studentId: string;
  overview: {
    totalAssignments: number;
    averageScore: string;
    highestScore: string;
    lowestScore: string;
    totalErrors: number;
  };
  recentSubmissions: Submission[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

export interface WeeklyStats {
  week: string;
  minutes: number;
  activities: number;
}

export interface DailyStats {
  day: string;
  minutes: number;
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 表单类型
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  name: string;
  role: 'teacher' | 'student';
}

export interface CreateQuestionForm {
  title: string;
  type: QuestionType;
  difficulty: Difficulty;
  chapter: Chapter;
  content: string;
  answer: string;
  analysis?: string;
}

export interface CreateAssignmentForm {
  title: string;
  className: string;
  deadline: string;
  gradingType: GradingType;
  questionIds: string[];
}

// 组件 Props 类型
export interface AIModuleProps {
  type: 'generation' | 'correction' | 'analysis';
  title: string;
  description: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

// 导入 React 类型
import type { ComponentType } from 'react';

// 菜单项类型
export interface MenuItem {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

// 统计数据类型
export interface StatCard {
  label: string;
  value: string | number;
  unit?: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  color: string;
  trend?: string;
}

// 通知类型
export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}
