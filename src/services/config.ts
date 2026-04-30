/**
 * 系统配置服务
 * 用于获取动态配置信息
 */

import api from './api';

export interface SystemConfig {
  system: {
    name: string;
    subtitle: string;
    logo: string;
    version: string;
    copyright: string;
  };
  teacher: {
    title: string;
    default_department: string;
    default_subject: string;
    menu: MenuItem[];
  };
  student: {
    title: string;
    default_major: string;
    menu: MenuItem[];
  };
  ai: {
    modules: AIModuleConfig[];
  };
  feature: {
    modules: FeatureModuleConfig[];
  };
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
}

export interface AIModuleConfig {
  type: 'generation' | 'correction' | 'analysis';
  title: string;
  description: string;
}

export interface FeatureModuleConfig {
  id: string;
  title: string;
  subtitle: string;
}

// 缓存配置数据
let configCache: SystemConfig | null = null;
let configPromise: Promise<SystemConfig> | null = null;

/**
 * 获取所有系统配置
 */
export const getSystemConfig = async (): Promise<SystemConfig> => {
  // 如果已有缓存，直接返回
  if (configCache) {
    return configCache;
  }

  // 如果正在请求中，返回同一个 Promise
  if (configPromise) {
    return configPromise;
  }

  // 发起请求
  configPromise = api
    .get<{ success: boolean; data: SystemConfig }>('/config')
    .then((response) => {
      configCache = response.data;
      return configCache;
    })
    .catch((error) => {
      console.error('获取系统配置失败:', error);
      // 返回默认配置
      return getDefaultConfig();
    })
    .finally(() => {
      configPromise = null;
    });

  return configPromise;
};

/**
 * 获取特定配置项
 */
export const getConfig = async <T = any>(key: string): Promise<T | null> => {
  try {
    const response = await api.get<{
      success: boolean;
      data: Record<string, T>;
    }>(`/config/${key}`);
    return response.data[key] || null;
  } catch (error) {
    console.error(`获取配置项 ${key} 失败:`, error);
    return null;
  }
};

/**
 * 批量获取配置
 */
export const getBatchConfig = async <T = any>(
  keys: string[]
): Promise<Record<string, T>> => {
  try {
    const response = await api.post<{
      success: boolean;
      data: Record<string, T>;
    }>('/config/batch', { keys });
    return response.data;
  } catch (error) {
    console.error('批量获取配置失败:', error);
    return {};
  }
};

/**
 * 清除配置缓存
 */
export const clearConfigCache = (): void => {
  configCache = null;
};

/**
 * 默认配置（当API不可用时使用）
 */
const getDefaultConfig = (): SystemConfig => ({
  system: {
    name: '阅小师',
    subtitle: '大学物理智能AI批改系统 · 精准高效答疑解惑',
    logo: '🦖',
    version: 'v1.0',
    copyright: '© 2026 Physics AI Grading System · 阅小师',
  },
  teacher: {
    title: 'Teacher Pro',
    default_department: '物理学院',
    default_subject: '大学物理',
    menu: [
      { id: 'homepage', label: '系统首页' },
      { id: 'classes', label: '班级管理' },
      { id: 'question-bank', label: '大学物理专题题库' },
      { id: 'assignment', label: '物理作业布置管理' },
      { id: 'analysis', label: '班级学习情况分析' },
      { id: 'profile', label: '个人中心' },
      { id: 'settings', label: '系统设置' },
    ],
  },
  student: {
    title: 'Student Pro',
    default_major: '应用物理学',
    menu: [
      { id: 'home', label: '我的首页' },
      { id: 'homework', label: '待完成物理作业' },
      { id: 'errors', label: '物理错题本复盘' },
      { id: 'report', label: '个人学习成长报告' },
      { id: 'profile', label: '个人中心 & 设置' },
    ],
  },
  ai: {
    modules: [
      {
        type: 'generation',
        title: '智能组卷',
        description: '基于章节、难度、题型自动生成',
      },
      {
        type: 'correction',
        title: '专业批改',
        description: 'OCR扫描与分步逻辑校验',
      },
      {
        type: 'analysis',
        title: '学情分析',
        description: '班级薄弱知识点精准画像',
      },
    ],
  },
  feature: {
    modules: [
      {
        id: 'question-bank',
        title: '物理题库智能组卷模块',
        subtitle: '校本物理题库',
      },
      { id: 'assignment', title: '日常物理作业模块', subtitle: 'OCR扫描批改' },
    ],
  },
});

// 导出默认配置供直接使用
export const defaultConfig = getDefaultConfig();
