/**
 * 认证相关 Hook
 */

import { useState, useCallback, useEffect } from 'react';
import type { User, LoginForm, RegisterForm } from '../types';
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  getCurrentUser,
} from '../services/auth';
import {
  setToken,
  removeToken,
  setUserInfo,
  getUserInfo,
  removeUserInfo,
} from '../utils/storage';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginForm) => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化时从本地存储获取用户信息
  useEffect(() => {
    const storedUser = getUserInfo<User>();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = useCallback(async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginApi(data);
      setToken(response.token);
      setUserInfo(response.user);
      setUser(response.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : '登录失败';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerApi(data);
      setToken(response.token);
      setUserInfo(response.user);
      setUser(response.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : '注册失败';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutApi();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      removeToken();
      removeUserInfo();
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.user);
      setUserInfo(response.user);
    } catch (err) {
      console.error('Refresh user error:', err);
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    error,
  };
};
