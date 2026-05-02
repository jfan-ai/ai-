/**
 * ============================================
 * 学情分析模块 API 服务
 * ============================================
 * 处理班级学习分析、知识点掌握度、AI洞察等
 * 
 * 【Java后端需提供的接口】：
 * GET /api/analytics/class/:classId       - 班级学习分析
 * GET /api/analytics/knowledge-mastery    - 知识点掌握度
 * GET /api/analytics/ai-insight           - AI教学洞察
 * GET /api/analytics/class-activity       - 班级活跃度
 * GET /api/analytics/student/:studentId   - 学生个人分析
 */

import api from './api';
import type { KnowledgeMastery, AIInsight, ClassActivity } from '../types';

/**
 * 获取班级学习分析数据
 * @param classId - 班级ID
 * @returns 班级整体学习情况分析
 * 
 * 【后端接口要求】：
 * GET /api/analytics/class/{classId}
 * Response: {
 *   overview: {
 *     totalStudents: number,
 *     averageScore: number,
 *     completionRate: number
 *   },
 *   chapterStats: Array<{
 *     chapter: string,
 *     averageScore: number,
 *     masteryRate: number
 *   }>
 * }
 */
export const getClassAnalytics = async (classId: string) => {
  return api.get<{
    overview: {
      totalStudents: number;
      averageScore: number;
      completionRate: number;
    };
    chapterStats: Array<{
      chapter: string;
      averageScore: number;
      masteryRate: number;
    }>;
  }>(`/analytics/class/${classId}`);
};

/**
 * 获取知识点掌握度分析
 * @param params - 查询参数（班级ID或学生ID）
 * @returns 各章节知识点掌握情况
 * 
 * 【后端接口要求】：
 * GET /api/analytics/knowledge-mastery?classId=xxx 或 studentId=xxx
 * Response: { mastery: KnowledgeMastery[] }
 */
export const getKnowledgeMastery = async (params?: {
  classId?: string;
  studentId?: string;
}) => {
  return api.get<{ mastery: KnowledgeMastery[] }>(
    '/analytics/knowledge-mastery',
    { params }
  );
};

/**
 * 获取AI教学洞察
 * @param classId - 班级ID
 * @returns AI生成的教学建议和预警
 * 
 * 【后端接口要求】：
 * GET /api/analytics/ai-insight?classId=xxx
 * Response: { insights: AIInsight[] }
 */
export const getAIInsight = async (classId: string) => {
  return api.get<{ insights: AIInsight[] }>('/analytics/ai-insight', {
    params: { classId },
  });
};

/**
 * 获取班级活跃度数据
 * @param classId - 班级ID
 * @param days - 统计天数（默认7天）
 * @returns 每日活跃度数据
 * 
 * 【后端接口要求】：
 * GET /api/analytics/class-activity?classId=xxx&days=7
 * Response: { activities: ClassActivity[] }
 */
export const getClassActivity = async (classId: string, days: number = 7) => {
  return api.get<{ activities: ClassActivity[] }>('/analytics/class-activity', {
    params: { classId, days },
  });
};

/**
 * 获取学生个人学习分析
 * @param studentId - 学生ID
 * @returns 学生个人学习情况
 * 
 * 【后端接口要求】：
 * GET /api/analytics/student/{studentId}
 * Response: {
 *   overview: {
 *     totalAssignments: number,
 *     averageScore: number,
 *     studyHours: number
 *   },
 *   weakPoints: string[],
 *   recentTrend: 'up' | 'down' | 'stable'
 * }
 */
export const getStudentAnalytics = async (studentId: string) => {
  return api.get<{
    overview: {
      totalAssignments: number;
      averageScore: number;
      studyHours: number;
    };
    weakPoints: string[];
    recentTrend: 'up' | 'down' | 'stable';
  }>(`/analytics/student/${studentId}`);
};

/**
 * 获取错题分布统计
 * @param params - 查询参数
 * @returns 错题类型分布
 * 
 * 【后端接口要求】：
 * GET /api/analytics/error-distribution?classId=xxx 或 studentId=xxx
 * Response: {
 *   distribution: Array<{
 *     type: string,
 *     count: number,
 *     percentage: number
 *   }>
 * }
 */
export const getErrorDistribution = async (params: {
  classId?: string;
  studentId?: string;
}) => {
  return api.get<{
    distribution: Array<{
      type: string;
      count: number;
      percentage: number;
    }>;
  }>('/analytics/error-distribution', { params });
};

/**
 * 获取学生薄弱知识点（用于复习模式）
 * @param studentId - 学生ID
 * @returns 薄弱知识点列表和复习建议
 * 
 * 【后端接口要求】：
 * GET /api/analytics/student/{studentId}/weak-points
 * Response: {
 *   topics: Array<{
 *     id: string;
 *     title: string;
 *     errorCount: number;
 *     mastery: number;
 *   }>,
 *   aiDiagnosis: {
 *     summary: string;
 *     strengths: string[];
 *     weaknesses: string[];
 *   },
 *   reviewTasks: Array<{
 *     id: number;
 *     title: string;
 *     duration: string;
 *     description: string;
 *   }>
 * }
 */
export const getStudentWeakPoints = async (studentId: string) => {
  return api.get<{
    topics: Array<{
      id: string;
      title: string;
      errorCount: number;
      mastery: number;
    }>;
    aiDiagnosis: {
      summary: string;
      strengths: string[];
      weaknesses: string[];
    };
    reviewTasks: Array<{
      id: number;
      title: string;
      duration: string;
      description: string;
    }>;
  }>(`/analytics/student/${studentId}/weak-points`);
};
