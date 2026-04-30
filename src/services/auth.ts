/**
 * 认证相关 API
 */

import api from './api';
import type { User, LoginForm, RegisterForm } from '../types';

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

/**
 * 用户登录
 */
export const login = async (data: LoginForm): Promise<AuthResponse> => {
  return api.post<AuthResponse>('/auth/login', data);
};

/**
 * 用户注册
 */
export const register = async (data: RegisterForm): Promise<AuthResponse> => {
  return api.post<AuthResponse>('/auth/register', data);
};

/**
 * 退出登录
 */
export const logout = async (): Promise<{ message: string }> => {
  return api.post<{ message: string }>('/auth/logout');
};

/**
 * 刷新 Token
 */
export const refreshToken = async (): Promise<{ token: string }> => {
  return api.post<{ token: string }>('/auth/refresh-token');
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (): Promise<{ profile: User }> => {
  return api.get<{ profile: User }>('/profile');
};
