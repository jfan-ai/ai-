/**
 * ============================================
 * 班级模块 API 服务
 * ============================================
 * 处理班级的增删改查、学生管理等操作
 * 
 * 【Java后端需提供的接口】：
 * GET    /api/classes              - 获取班级列表
 * GET    /api/classes/:id          - 获取班级详情
 * POST   /api/classes              - 创建班级
 * PUT    /api/classes/:id          - 更新班级
 * DELETE /api/classes/:id          - 删除班级
 * POST   /api/classes/:id/students - 添加学生
 * DELETE /api/classes/:id/students/:studentId - 移除学生
 */

import api from './api';

// 班级基础信息
export interface Class {
  id: string;
  name: string;
  teacherId: string;
  description: string;
  createdAt: string;
  studentCount?: number;
}

// 班级学生信息
export interface ClassStudent {
  id: string;
  name: string;
  email: string;
  studentId: string | null;
  joinedAt: string;
}

// 班级详情
export interface ClassDetail {
  class: Class & { teacherName: string };
  students: ClassStudent[];
}

/**
 * 创建班级
 * @param data - 班级名称和描述
 * @returns 创建后的班级信息
 * 
 * 【后端接口要求】：
 * POST /api/classes
 * Request: { name: string, description?: string }
 * Response: { class: Class }
 */
export const createClass = async (data: {
  name: string;
  description?: string;
}): Promise<{ message: string; class: Class }> => {
  return api.post('/classes', data);
};

/**
 * 获取教师的所有班级
 * @returns 班级列表
 * 
 * 【后端接口要求】：
 * GET /api/classes/teacher
 * Response: { classes: Class[] }
 */
export const getTeacherClasses = async (): Promise<{ classes: Class[] }> => {
  return api.get('/classes/teacher');
};

/**
 * 获取班级详情（包含学生列表）
 * @param id - 班级ID
 * @returns 班级详细信息
 * 
 * 【后端接口要求】：
 * GET /api/classes/{id}
 * Response: { class: Class, students: ClassStudent[] }
 */
export const getClassDetail = async (id: string): Promise<ClassDetail> => {
  return api.get(`/classes/${id}`);
};

/**
 * 更新班级信息
 * @param id - 班级ID
 * @param data - 更新的班级数据
 * @returns 更新结果
 * 
 * 【后端接口要求】：
 * PUT /api/classes/{id}
 * Request: { name: string, description?: string }
 * Response: { message: string }
 */
export const updateClass = async (
  id: string,
  data: { name: string; description?: string }
): Promise<{ message: string }> => {
  return api.put(`/classes/${id}`, data);
};

/**
 * 删除班级
 * @param id - 班级ID
 * @returns 删除结果
 * 
 * 【后端接口要求】：
 * DELETE /api/classes/{id}
 * Response: { message: string }
 */
export const deleteClass = async (id: string): Promise<{ message: string }> => {
  return api.delete(`/classes/${id}`);
};

/**
 * 添加学生到班级
 * @param classId - 班级ID
 * @param studentEmail - 学生邮箱
 * @returns 添加结果
 * 
 * 【后端接口要求】：
 * POST /api/classes/{id}/students
 * Request: { studentEmail: string }
 * Response: { message: string }
 */
export const addStudentToClass = async (
  classId: string,
  studentEmail: string
): Promise<{ message: string }> => {
  return api.post(`/classes/${classId}/students`, { studentEmail });
};

/**
 * 从班级移除学生
 * @param classId - 班级ID
 * @param studentId - 学生ID
 * @returns 移除结果
 * 
 * 【后端接口要求】：
 * DELETE /api/classes/{id}/students/{studentId}
 * Response: { message: string }
 */
export const removeStudentFromClass = async (
  classId: string,
  studentId: string
): Promise<{ message: string }> => {
  return api.delete(`/classes/${classId}/students/${studentId}`);
};

/**
 * 学生获取自己所在的班级
 * @returns 班级列表
 * 
 * 【后端接口要求】：
 * GET /api/classes/student/my-class
 * Response: { classes: Class[] }
 */
export const getStudentClasses = async (): Promise<{ classes: Class[] }> => {
  return api.get('/classes/student/my-class');
};

/**
 * 获取所有班级（供选择使用）
 * @returns 班级列表
 * 
 * 【后端接口要求】：
 * GET /api/classes
 * Response: { classes: Class[] }
 */
export const getClasses = async (): Promise<Class[]> => {
  const response = await api.get<{ classes: Class[] }>('/classes');
  return response.classes || [];
};
