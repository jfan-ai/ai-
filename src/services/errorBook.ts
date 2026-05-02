/**
 * ============================================
 * 错题本模块 API 服务
 * ============================================
 * 处理错题的查看、分类、AI推荐复练等
 * 
 * 【Java后端需提供的接口】：
 * GET    /api/error-book              - 获取错题列表
 * GET    /api/error-book/:id          - 获取错题详情
 * POST   /api/error-book/:id/practice - AI推荐复练题目
 * DELETE /api/error-book/:id          - 删除错题记录
 */

import api from './api';
import type { ErrorQuestion, Question } from '../types';

/**
 * 获取学生的错题列表
 * @param params - 查询参数（章节、错误类型等）
 * @returns 错题列表
 * 
 * 【后端接口要求】：
 * GET /api/error-book?chapter=力学&type=概念模糊
 * Response: { errors: ErrorQuestion[] }
 */
export const getErrorQuestions = async (params?: {
  chapter?: string;
  type?: string;
  page?: number;
  limit?: number;
}) => {
  return api.get<{
    errors: ErrorQuestion[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>('/error-book', { params });
};

/**
 * 获取错题详情
 * @param id - 错题记录ID
 * @returns 错题详细信息
 * 
 * 【后端接口要求】：
 * GET /api/error-book/{id}
 * Response: { error: ErrorQuestion }
 */
export const getErrorQuestionById = async (id: string) => {
  return api.get<{ error: ErrorQuestion }>(`/error-book/${id}`);
};

/**
 * AI推荐复练题目
 * @param errorId - 错题ID
 * @returns 推荐的练习题目
 * 
 * 【后端接口要求】：
 * POST /api/error-book/{id}/practice
 * Response: { 
 *   recommendations: Question[],
 *   analysis: {
 *     weakPoint: string,
 *     suggestion: string
 *   }
 * }
 */
export const getPracticeRecommendations = async (errorId: string) => {
  return api.post<{
    recommendations: Question[];
    analysis: {
      weakPoint: string;
      suggestion: string;
    };
  }>(`/error-book/${errorId}/practice`);
};

/**
 * 删除错题记录
 * @param id - 错题记录ID
 * @returns 删除结果
 * 
 * 【后端接口要求】：
 * DELETE /api/error-book/{id}
 * Response: { message: string }
 */
export const deleteErrorQuestion = async (id: string) => {
  return api.delete<{ message: string }>(`/error-book/${id}`);
};

/**
 * 标记错题已复习
 * @param id - 错题记录ID
 * @returns 更新结果
 * 
 * 【后端接口要求】：
 * PUT /api/error-book/{id}/review
 * Response: { message: string }
 */
export const markErrorAsReviewed = async (id: string) => {
  return api.put<{ message: string }>(`/error-book/${id}/review`);
};

/**
 * 获取错题统计
 * @returns 错题统计数据
 * 
 * 【后端接口要求】：
 * GET /api/error-book/stats
 * Response: {
 *   totalErrors: number,
 *   reviewedCount: number,
 *   byChapter: Array<{ chapter: string, count: number }>,
 *   byType: Array<{ type: string, count: number }>
 * }
 */
export const getErrorStats = async () => {
  return api.get<{
    totalErrors: number;
    reviewedCount: number;
    byChapter: Array<{ chapter: string; count: number }>;
    byType: Array<{ type: string; count: number }>;
  }>('/error-book/stats');
};
