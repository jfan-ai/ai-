/**
 * ============================================
 * 题库模块 API 服务
 * ============================================
 * 处理题目的增删改查、AI生成题目等操作
 * 
 * 【Java后端需提供的接口】：
 * GET    /api/questions          - 获取题库列表
 * GET    /api/questions/local    - 获取校本题库
 * GET    /api/questions/cloud    - 获取云端题库
 * GET    /api/questions/:id      - 获取题目详情
 * POST   /api/questions          - 创建题目
 * PUT    /api/questions/:id      - 更新题目
 * DELETE /api/questions/:id      - 删除题目
 * POST   /api/questions/generate - AI生成题目
 */

import api from './api';
import type { Question, PaginatedResponse, CreateQuestionForm } from '../types';

// 查询参数接口
interface QuestionsParams extends Record<string, string | number | undefined> {
  chapter?: string;      // 章节筛选：力学、热学、电磁学、光学、近代物理
  difficulty?: string;   // 难度筛选：简单、中等、困难
  type?: string;         // 题型筛选：选择题、填空题、计算题、简答题
  source?: string;       // 来源筛选：local、cloud
  search?: string;       // 搜索关键词
  page?: number;         // 页码
  limit?: number;        // 每页数量
}

/**
 * 获取题库列表（支持分页和筛选）
 * @param params - 查询参数
 * @returns 分页的题目列表
 * 
 * 【后端接口要求】：
 * GET /api/questions?page=1&limit=10&chapter=力学&difficulty=中等
 * Response: { 
 *   questions: Question[], 
 *   pagination: { page, limit, total, totalPages } 
 * }
 */
export const getQuestions = async (
  params?: QuestionsParams
): Promise<PaginatedResponse<Question>> => {
  const response = await api.get<{
    questions: Question[];
    pagination: PaginatedResponse<Question>['pagination'];
  }>('/questions', { params });
  return {
    data: response.questions,
    pagination: response.pagination,
  };
};

/**
 * 获取校本题库（教师自己创建的题目）
 * @returns 题目列表
 * 
 * 【后端接口要求】：
 * GET /api/questions/local
 * Response: { questions: Question[] }
 */
export const getLocalQuestions = async (): Promise<Question[]> => {
  const response = await api.get<{ questions: Question[] }>('/questions/local');
  return response.questions;
};

/**
 * 获取云端题库（系统共享的题目）
 * @returns 题目列表
 * 
 * 【后端接口要求】：
 * GET /api/questions/cloud
 * Response: { questions: Question[] }
 */
export const getCloudQuestions = async (): Promise<Question[]> => {
  const response = await api.get<{ questions: Question[] }>('/questions/cloud');
  return response.questions;
};

/**
 * 获取题目详情
 * @param id - 题目ID
 * @returns 题目详细信息
 * 
 * 【后端接口要求】：
 * GET /api/questions/{id}
 * Response: { question: Question }
 */
export const getQuestionById = async (id: string): Promise<Question> => {
  const response = await api.get<{ question: Question }>(`/questions/${id}`);
  return response.question;
};

/**
 * 创建新题目（教师权限）
 * @param data - 题目数据
 * @returns 创建后的题目
 * 
 * 【后端接口要求】：
 * POST /api/questions
 * Request: CreateQuestionForm
 * Response: { question: Question }
 */
export const createQuestion = async (
  data: CreateQuestionForm
): Promise<Question> => {
  const response = await api.post<{ question: Question }>('/questions', data);
  return response.question;
};

/**
 * 更新题目（教师权限）
 * @param id - 题目ID
 * @param data - 更新的题目数据
 * @returns 更新后的题目
 * 
 * 【后端接口要求】：
 * PUT /api/questions/{id}
 * Request: Partial<CreateQuestionForm>
 * Response: { question: Question }
 */
export const updateQuestion = async (
  id: string,
  data: Partial<CreateQuestionForm>
): Promise<Question> => {
  const response = await api.put<{ question: Question }>(
    `/questions/${id}`,
    data
  );
  return response.question;
};

/**
 * 删除题目（教师权限）
 * @param id - 题目ID
 * 
 * 【后端接口要求】：
 * DELETE /api/questions/{id}
 * Response: { message: string }
 */
export const deleteQuestion = async (id: string): Promise<void> => {
  await api.delete(`/questions/${id}`);
};

/**
 * AI智能生成题目
 * @param data - 生成参数（章节、难度、数量、题型）
 * @returns 生成的题目列表
 * 
 * 【后端接口要求】：
 * POST /api/questions/generate
 * Request: { chapter: string, difficulty: string, count: number, type?: string }
 * Response: { questions: Question[] }
 */
export const generateQuestions = async (data: {
  chapter: string;
  difficulty: string;
  count: number;
  type?: string;
}): Promise<Question[]> => {
  const response = await api.post<{ questions: Question[] }>(
    '/questions/generate',
    data
  );
  return response.questions;
};

/**
 * 批量导入题目
 * @param questions - 题目数组
 * @returns 导入结果
 * 
 * 【后端接口要求】：
 * POST /api/questions/batch
 * Request: { questions: CreateQuestionForm[] }
 * Response: { imported: number, failed: number }
 */
export const batchImportQuestions = async (questions: CreateQuestionForm[]) => {
  return api.post<{ imported: number; failed: number }>('/questions/batch', {
    questions,
  });
};
