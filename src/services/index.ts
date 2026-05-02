/**
 * ============================================
 * API 服务统一导出
 * ============================================
 * 所有后端接口服务都从这里导出
 * 
 * 使用示例：
 * import { authApi, questionApi, assignmentApi } from '@/services';
 * 
 * // 登录
 * const { token, user } = await authApi.login({ email, password });
 * 
 * // 获取题目列表
 * const { data, pagination } = await questionApi.getQuestions({ page: 1 });
 */

// 基础API
export { default as api } from './api';

// 认证模块
export * from './auth';

// 题库模块
export * from './questions';

// 作业模块
export * from './assignments';

// 班级模块
export * from './classes';

// 学情分析模块
export * from './analytics';

// 错题本模块
export * from './errorBook';

// 成长报告模块
export * from './growth';

// 系统配置
export * from './config';
