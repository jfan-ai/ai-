/**
 * ============================================
 * 认证模块 API 服务
 * ============================================
 * 处理用户登录、注册、登出等认证相关操作
 * 
 * 【Java后端需提供的接口】：
 * POST /api/auth/login     - 用户登录
 * POST /api/auth/register  - 用户注册
 * POST /api/auth/logout    - 退出登录
 * POST /api/auth/refresh   - 刷新Token
 * GET  /api/auth/profile   - 获取当前用户信息
 */

import api from './api';
import type { User, LoginForm, RegisterForm } from '../types';

// 登录响应数据格式
interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

/**
 * 用户登录
 * @param data - 登录表单数据（邮箱+密码）
 * @returns 包含token和用户信息的对象
 * 
 * 【后端接口要求】：
 * POST /api/auth/login
 * Request: { email: string, password: string }
 * Response: { token: string, user: User }
 */
export const login = async (data: LoginForm): Promise<AuthResponse> => {
  return api.post<AuthResponse>('/auth/login', data);
};

/**
 * 用户注册
 * @param data - 注册表单数据
 * @returns 包含token和用户信息的对象
 * 
 * 【后端接口要求】：
 * POST /api/auth/register
 * Request: { email: string, password: string, name: string, role: 'teacher'|'student' }
 * Response: { token: string, user: User }
 */
export const register = async (data: RegisterForm): Promise<AuthResponse> => {
  return api.post<AuthResponse>('/auth/register', data);
};

/**
 * 退出登录
 * @returns 退出成功消息
 * 
 * 【后端接口要求】：
 * POST /api/auth/logout
 * Header: Authorization: Bearer {token}
 * Response: { message: string }
 */
export const logout = async (): Promise<{ message: string }> => {
  return api.post<{ message: string }>('/auth/logout');
};

/**
 * 刷新Token（用于token过期前自动续期）
 * @returns 新的token
 * 
 * 【后端接口要求】：
 * POST /api/auth/refresh
 * Header: Authorization: Bearer {refreshToken}
 * Response: { token: string }
 */
export const refreshToken = async (): Promise<{ token: string }> => {
  return api.post<{ token: string }>('/auth/refresh');
};

/**
 * 获取当前登录用户信息
 * @returns 用户详细信息
 * 
 * 【后端接口要求】：
 * GET /api/auth/profile
 * Header: Authorization: Bearer {token}
 * Response: { user: User }
 */
export const getCurrentUser = async (): Promise<{ user: User }> => {
  return api.get<{ user: User }>('/auth/profile');
};

/**
 * 修改密码
 * @param data - 包含旧密码和新密码
 * @returns 修改结果
 * 
 * 【后端接口要求】：
 * PUT /api/auth/password
 * Request: { oldPassword: string, newPassword: string }
 * Response: { message: string }
 */
export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  return api.put<{ message: string }>('/auth/password', data);
};
