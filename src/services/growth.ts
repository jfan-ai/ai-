/**
 * ============================================
 * 成长报告模块 API 服务
 * ============================================
 * 处理学习成长报告、成就系统、学习统计等
 * 
 * 【Java后端需提供的接口】：
 * GET /api/growth/report/:studentId    - 获取成长报告
 * GET /api/growth/weekly-stats         - 每周学习统计
 * GET /api/growth/achievements         - 获取成就列表
 * GET /api/growth/my-achievements      - 我的成就
 */

import api from './api';
import type { GrowthReport, Achievement, WeeklyStats } from '../types';

/**
 * 获取学生成长报告
 * @param studentId - 学生ID
 * @returns 完整的成长报告数据
 * 
 * 【后端接口要求】：
 * GET /api/growth/report/{studentId}
 * Response: { report: GrowthReport }
 */
export const getGrowthReport = async (studentId: string) => {
  return api.get<{ report: GrowthReport }>(`/growth/report/${studentId}`);
};

/**
 * 获取每周学习统计
 * @param weeks - 统计周数（默认4周）
 * @returns 每周学习时长和活跃度
 * 
 * 【后端接口要求】：
 * GET /api/growth/weekly-stats?weeks=4
 * Response: { stats: WeeklyStats[] }
 */
export const getWeeklyStats = async (weeks: number = 4) => {
  return api.get<{ stats: WeeklyStats[] }>('/growth/weekly-stats', {
    params: { weeks },
  });
};

/**
 * 获取每日学习统计
 * @param days - 统计天数（默认30天）
 * @returns 每日学习时长
 * 
 * 【后端接口要求】：
 * GET /api/growth/daily-stats?days=30
 * Response: { 
 *   stats: Array<{ day: string, minutes: number, activities: number }> 
 * }
 */
export const getDailyStats = async (days: number = 30) => {
  return api.get<{
    stats: Array<{ day: string; minutes: number; activities: number }>;
  }>('/growth/daily-stats', { params: { days } });
};

/**
 * 获取所有成就列表
 * @returns 系统中所有可获得的成就
 * 
 * 【后端接口要求】：
 * GET /api/growth/achievements
 * Response: { achievements: Achievement[] }
 */
export const getAllAchievements = async () => {
  return api.get<{ achievements: Achievement[] }>('/growth/achievements');
};

/**
 * 获取当前用户的成就
 * @returns 用户已获得的成就
 * 
 * 【后端接口要求】：
 * GET /api/growth/my-achievements
 * Response: { achievements: Achievement[] }
 */
export const getMyAchievements = async () => {
  return api.get<{ achievements: Achievement[] }>('/growth/my-achievements');
};

/**
 * 获取学习进度概览
 * @returns 学习进度数据
 * 
 * 【后端接口要求】：
 * GET /api/growth/progress
 * Response: {
 *   currentLevel: string,
 *   nextLevel: string,
 *   progress: number,
 *   totalStudyHours: number,
 *   completedAssignments: number
 * }
 */
export const getLearningProgress = async () => {
  return api.get<{
    currentLevel: string;
    nextLevel: string;
    progress: number;
    totalStudyHours: number;
    completedAssignments: number;
  }>('/growth/progress');
};
