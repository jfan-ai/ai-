/**
 * API 服务配置
 */

import { getToken } from '../utils/storage';

const API_BASE_URL = 'http://localhost:3000/api';

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * 构建完整 URL
 */
const buildUrl = (
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string => {
  const url = new URL(
    endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
};

/**
 * 处理响应
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '请求失败' }));
    throw new Error(error.error || error.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data;
};

/**
 * 发送请求
 */
const request = async <T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> => {
  const { params, ...restConfig } = config;
  const url = buildUrl(endpoint, params);

  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((restConfig.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...restConfig,
    headers,
  });

  return handleResponse<T>(response);
};

// HTTP 方法封装
export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'DELETE' }),
};

// 获取作业管理统计数据
export const getAssignmentStats = async () => {
  return api.get<{
    activeAssignments: number;
    pendingGrading: number;
    totalStudents: number;
  }>('/assignments/stats/overview');
};

// 获取作业列表
export const getAssignments = async (params?: {
  status?: string;
  class_name?: string;
  page?: number;
  limit?: number;
}) => {
  return api.get<{
    assignments: Array<{
      id: string;
      title: string;
      class_name: string;
      status: string;
      deadline: string;
      grading_type: string;
      submissions_count: number;
      total_students: number;
      created_at: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>('/assignments', { params });
};

export default api;
