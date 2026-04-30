import api from './api';

export interface Class {
  id: string;
  name: string;
  teacher_id: string;
  description: string;
  created_at: string;
  student_count?: number;
}

export interface ClassStudent {
  id: string;
  name: string;
  email: string;
  student_id: string | null;
  joined_at: string;
}

export interface ClassDetail {
  class: Class & { teacher_name: string };
  students: ClassStudent[];
}

// 创建班级
export const createClass = async (data: {
  name: string;
  description?: string;
}): Promise<{ message: string; class: Class }> => {
  return api.post('/classes', data);
};

// 获取教师的所有班级
export const getTeacherClasses = async (): Promise<{ classes: Class[] }> => {
  return api.get('/classes/teacher');
};

// 获取班级详情
export const getClassDetail = async (id: string): Promise<ClassDetail> => {
  return api.get(`/classes/${id}`);
};

// 更新班级信息
export const updateClass = async (
  id: string,
  data: { name: string; description?: string }
): Promise<{ message: string }> => {
  return api.put(`/classes/${id}`, data);
};

// 删除班级
export const deleteClass = async (id: string): Promise<{ message: string }> => {
  return api.delete(`/classes/${id}`);
};

// 添加学生到班级
export const addStudentToClass = async (
  classId: string,
  studentEmail: string
): Promise<{ message: string }> => {
  return api.post(`/classes/${classId}/students`, { studentEmail });
};

// 从班级移除学生
export const removeStudentFromClass = async (
  classId: string,
  studentId: string
): Promise<{ message: string }> => {
  return api.delete(`/classes/${classId}/students/${studentId}`);
};

// 学生获取自己所在的班级
export const getStudentClasses = async (): Promise<{ classes: Class[] }> => {
  return api.get('/classes/student/my-class');
};

// 获取所有班级（供分析使用）
export const getClasses = async (): Promise<Class[]> => {
  const response = await api.get('/classes');
  return response.classes || [];
};
