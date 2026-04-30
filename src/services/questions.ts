/**
 * 题库相关 API
 */

import api from './api';
import type { Question, PaginatedResponse, CreateQuestionForm } from '../types';

interface QuestionsParams extends Record<string, string | number | undefined> {
  chapter?: string;
  difficulty?: string;
  type?: string;
  source?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * 获取题库列表
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
 * 获取校本题库
 */
export const getLocalQuestions = async (): Promise<Question[]> => {
  const response = await api.get<{ questions: Question[] }>('/questions/local');
  return response.questions;
};

/**
 * 获取云端题库
 */
export const getCloudQuestions = async (): Promise<Question[]> => {
  const response = await api.get<{ questions: Question[] }>('/questions/cloud');
  return response.questions;
};

/**
 * 获取题目详情
 */
export const getQuestionById = async (id: string): Promise<Question> => {
  const response = await api.get<{ question: Question }>(`/questions/${id}`);
  return response.question;
};

/**
 * 创建题目
 */
export const createQuestion = async (
  data: CreateQuestionForm
): Promise<Question> => {
  const response = await api.post<{ question: Question }>('/questions', data);
  return response.question;
};

/**
 * 更新题目
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
 * 删除题目
 */
export const deleteQuestion = async (id: string): Promise<void> => {
  await api.delete(`/questions/${id}`);
};

/**
 * AI 生成题目
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
