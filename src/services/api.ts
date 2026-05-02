/**
 * ============================================
 * API 基础服务层
 * ============================================
 * 封装所有HTTP请求，统一处理：
 * - 请求头设置（Content-Type、Authorization）
 * - 响应数据处理
 * - 错误处理
 * 
 * 后端接口地址配置，Java后端同学请按此规范提供接口
 */

import { getToken } from '../utils/storage';

// ============================================
// 后端API基础地址配置
// ============================================
// 开发环境使用 localhost:8080（Java后端默认端口）
// 生产环境请修改为实际部署地址
const API_BASE_URL = 'http://localhost:8080/api';

// 请求配置接口
interface RequestConfig {
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  method?: string;
  body?: string;
}

/**
 * 构建完整URL（包含查询参数）
 * @param endpoint - API端点路径
 * @param params - URL查询参数
 * @returns 完整的URL字符串
 */
const buildUrl = (
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string => {
  const url = new URL(
    endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  );

  // 添加查询参数
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
 * 统一处理API响应
 * @param response - fetch返回的Response对象
 * @returns 解析后的JSON数据
 * @throws 请求失败时抛出错误
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '请求失败' }));
    throw new Error(error.message || error.error || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data;
};

/**
 * 发送HTTP请求的核心方法
 * @param endpoint - API端点
 * @param config - 请求配置
 * @returns Promise<T>
 */
const request = async <T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> => {
  const { params, ...restConfig } = config;
  const url = buildUrl(endpoint, params);

  // 从本地存储获取token
  const token = getToken();
  
  // 设置请求头
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(restConfig.headers || {}),
  };

  // 添加认证token
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...restConfig,
    headers,
  });

  return handleResponse<T>(response);
};

// ============================================
// HTTP方法快捷封装
// ============================================
export const api = {
  /** GET请求 */
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'GET' }),

  /** POST请求 */
  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /** PUT请求 */
  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /** PATCH请求 */
  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /** DELETE请求 */
  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'DELETE' }),
};

export default api;
