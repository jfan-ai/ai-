/**
 * 题库相关 Hook
 */

import { useState, useCallback } from 'react';
import type { Question, PaginatedResponse, CreateQuestionForm } from '../types';
import {
  getQuestions as getQuestionsApi,
  getLocalQuestions as getLocalQuestionsApi,
  getCloudQuestions as getCloudQuestionsApi,
  getQuestionById as getQuestionByIdApi,
  createQuestion as createQuestionApi,
  updateQuestion as updateQuestionApi,
  deleteQuestion as deleteQuestionApi,
  generateQuestions as generateQuestionsApi,
} from '../services/questions';

interface UseQuestionsReturn {
  questions: Question[];
  pagination: PaginatedResponse<Question>['pagination'] | null;
  isLoading: boolean;
  error: string | null;
  fetchQuestions: (params?: {
    chapter?: string;
    difficulty?: string;
    type?: string;
    source?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  fetchLocalQuestions: () => Promise<void>;
  fetchCloudQuestions: () => Promise<void>;
  fetchQuestionById: (id: string) => Promise<Question | null>;
  createQuestion: (data: CreateQuestionForm) => Promise<Question | null>;
  updateQuestion: (
    id: string,
    data: Partial<CreateQuestionForm>
  ) => Promise<Question | null>;
  deleteQuestion: (id: string) => Promise<boolean>;
  generateQuestions: (data: {
    chapter: string;
    difficulty: string;
    count: number;
    type?: string;
  }) => Promise<Question[]>;
}

export const useQuestions = (): UseQuestionsReturn => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState<
    PaginatedResponse<Question>['pagination'] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(
    async (params?: {
      chapter?: string;
      difficulty?: string;
      type?: string;
      source?: string;
      search?: string;
      page?: number;
      limit?: number;
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getQuestionsApi(params);
        setQuestions(response.data);
        setPagination(response.pagination);
      } catch (err) {
        const message = err instanceof Error ? err.message : '获取题库失败';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchLocalQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getLocalQuestionsApi();
      setQuestions(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取校本题库失败';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCloudQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCloudQuestionsApi();
      setQuestions(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取云端题库失败';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchQuestionById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const question = await getQuestionByIdApi(id);
      return question;
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取题目详情失败';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createQuestion = useCallback(async (data: CreateQuestionForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const question = await createQuestionApi(data);
      setQuestions((prev) => [question, ...prev]);
      return question;
    } catch (err) {
      const message = err instanceof Error ? err.message : '创建题目失败';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateQuestion = useCallback(
    async (id: string, data: Partial<CreateQuestionForm>) => {
      setIsLoading(true);
      setError(null);
      try {
        const question = await updateQuestionApi(id, data);
        setQuestions((prev) => prev.map((q) => (q.id === id ? question : q)));
        return question;
      } catch (err) {
        const message = err instanceof Error ? err.message : '更新题目失败';
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteQuestion = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteQuestionApi(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : '删除题目失败';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateQuestions = useCallback(
    async (data: {
      chapter: string;
      difficulty: string;
      count: number;
      type?: string;
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        const generated = await generateQuestionsApi(data);
        setQuestions((prev) => [...generated, ...prev]);
        return generated;
      } catch (err) {
        const message = err instanceof Error ? err.message : '生成题目失败';
        setError(message);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    questions,
    pagination,
    isLoading,
    error,
    fetchQuestions,
    fetchLocalQuestions,
    fetchCloudQuestions,
    fetchQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    generateQuestions,
  };
};
