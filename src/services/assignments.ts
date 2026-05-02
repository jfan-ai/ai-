/**
 * ============================================
 * 作业模块 API 服务
 * ============================================
 * 处理作业的发布、提交、批改等操作
 * 
 * 【Java后端需提供的接口】：
 * GET    /api/assignments              - 获取作业列表
 * GET    /api/assignments/:id          - 获取作业详情
 * POST   /api/assignments              - 创建作业
 * PUT    /api/assignments/:id          - 更新作业
 * DELETE /api/assignments/:id          - 删除作业
 * POST   /api/assignments/:id/submit   - 提交作业
 * POST   /api/assignments/:id/grade    - AI批改作业
 * GET    /api/assignments/stats        - 获取作业统计
 */

import api from './api';
import type { Assignment, Submission, CreateAssignmentForm } from '../types';

/**
 * 获取作业列表
 * @param params - 查询参数（状态、班级、分页等）
 * @returns 作业列表和分页信息
 * 
 * 【后端接口要求】：
 * GET /api/assignments?status=active&page=1&limit=10
 * Response: { 
 *   assignments: Assignment[], 
 *   pagination: { page, limit, total, totalPages } 
 * }
 */
export const getAssignments = async (params?: {
  status?: string;
  classId?: string;
  page?: number;
  limit?: number;
}) => {
  return api.get<{
    assignments: Assignment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>('/assignments', { params });
};

/**
 * 获取作业详情
 * @param id - 作业ID
 * @returns 作业详细信息（包含题目列表）
 * 
 * 【后端接口要求】：
 * GET /api/assignments/{id}
 * Response: { assignment: Assignment }
 */
export const getAssignmentById = async (id: string) => {
  return api.get<{ assignment: Assignment }>(`/assignments/${id}`);
};

/**
 * 创建新作业（教师权限）
 * @param data - 作业数据
 * @returns 创建后的作业
 * 
 * 【后端接口要求】：
 * POST /api/assignments
 * Request: { title, classId, deadline, gradingType, questionIds[], status }
 * Response: { assignment: Assignment }
 */
export const createAssignment = async (data: CreateAssignmentForm) => {
  return api.post<{ assignment: Assignment }>('/assignments', data);
};

/**
 * 更新作业（教师权限）
 * @param id - 作业ID
 * @param data - 更新的作业数据
 * @returns 更新后的作业
 * 
 * 【后端接口要求】：
 * PUT /api/assignments/{id}
 * Response: { assignment: Assignment }
 */
export const updateAssignment = async (
  id: string,
  data: Partial<CreateAssignmentForm>
) => {
  return api.put<{ assignment: Assignment }>(`/assignments/${id}`, data);
};

/**
 * 删除作业（教师权限）
 * @param id - 作业ID
 * 
 * 【后端接口要求】：
 * DELETE /api/assignments/{id}
 * Response: { message: string }
 */
export const deleteAssignment = async (id: string) => {
  return api.delete<{ message: string }>(`/assignments/${id}`);
};

/**
 * 保存作业草稿
 * @param data - 作业数据
 * @returns 保存后的作业
 * 
 * 【后端接口要求】：
 * POST /api/assignments/draft
 * Request: CreateAssignmentForm
 * Response: { assignment: Assignment }
 */
export const saveAssignmentDraft = async (data: Partial<CreateAssignmentForm>) => {
  return api.post<{ assignment: Assignment }>('/assignments/draft', data);
};

/**
 * 提交作业（学生权限）
 * @param assignmentId - 作业ID
 * @param answers - 学生答案对象 { questionId: answer }
 * @returns 提交结果
 * 
 * 【后端接口要求】：
 * POST /api/assignments/{id}/submit
 * Request: { answers: Record<string, string> }
 * Response: { submission: Submission }
 */
export const submitAssignment = async (
  assignmentId: string,
  answers: Record<string, string>
) => {
  return api.post<{ submission: Submission }>(
    `/assignments/${assignmentId}/submit`,
    { answers }
  );
};

/**
 * AI批改作业
 * @param assignmentId - 作业ID
 * @param submissionId - 提交记录ID
 * @returns 批改结果
 * 
 * 【后端接口要求】：
 * POST /api/assignments/{id}/grade
 * Request: { submissionId: string }
 * Response: { submission: Submission, feedback: AIFeedback }
 */
export const gradeAssignment = async (assignmentId: string, submissionId: string) => {
  return api.post<{
    submission: Submission;
    feedback: {
      score: number;
      comments: string;
      details: Array<{
        questionId: string;
        score: number;
        comment: string;
      }>;
    };
  }>(`/assignments/${assignmentId}/grade`, { submissionId });
};

/**
 * 获取作业提交列表（教师查看）
 * @param assignmentId - 作业ID
 * @returns 提交记录列表
 * 
 * 【后端接口要求】：
 * GET /api/assignments/{id}/submissions
 * Response: { submissions: Submission[] }
 */
export const getAssignmentSubmissions = async (assignmentId: string) => {
  return api.get<{ submissions: Submission[] }>(
    `/assignments/${assignmentId}/submissions`
  );
};

/**
 * 获取作业统计数据
 * @returns 统计信息
 * 
 * 【后端接口要求】：
 * GET /api/assignments/stats/overview
 * Response: { 
 *   activeAssignments: number,
 *   pendingGrading: number,
 *   totalStudents: number 
 * }
 */
export const getAssignmentStats = async () => {
  return api.get<{
    activeAssignments: number;
    pendingGrading: number;
    totalStudents: number;
  }>('/assignments/stats/overview');
};

/**
 * 获取学生的作业列表
 * @returns 学生视角的作业列表
 * 
 * 【后端接口要求】：
 * GET /api/assignments/student/my-assignments
 * Response: { assignments: Assignment[] }
 */
export const getStudentAssignments = async () => {
  return api.get<{ assignments: Assignment[] }>('/assignments/student/my-assignments');
};

/**
 * 获取学生的提交记录
 * @returns 提交历史
 * 
 * 【后端接口要求】：
 * GET /api/assignments/student/my-submissions
 * Response: { submissions: Submission[] }
 */
export const getStudentSubmissions = async () => {
  return api.get<{ submissions: Submission[] }>('/assignments/student/my-submissions');
};

/**
 * 获取待批改的作业列表（教师阅卷工作台）
 * @param assignmentId - 作业ID
 * @returns 待批改的学生作业列表
 * 
 * 【后端接口要求】：
 * GET /api/assignments/{id}/pending-grading
 * Response: { 
 *   students: Array<{
 *     id: string;
 *     name: string;
 *     status: '待批改' | '已批改';
 *     aiScore?: number;
 *     score?: number;
 *     submitTime: string;
 *   }> 
 * }
 */
export const getPendingGradingList = async (assignmentId: string) => {
  return api.get<{
    students: Array<{
      id: string;
      name: string;
      status: '待批改' | '已批改';
      aiScore?: number;
      score?: number;
      submitTime: string;
    }>;
  }>(`/assignments/${assignmentId}/pending-grading`);
};

/**
 * 获取学生作业详情（阅卷用）
 * @param assignmentId - 作业ID
 * @param studentId - 学生ID
 * @returns 学生作业详情和AI分析
 * 
 * 【后端接口要求】：
 * GET /api/assignments/{id}/submissions/{studentId}
 * Response: { 
 *   submission: Submission,
 *   aiAnalysis: {
 *     score: number;
 *     feedback: string;
 *     correctPoints: string[];
 *     errorPoints: string[];
 *   }
 * }
 */
export const getStudentSubmissionDetail = async (assignmentId: string, studentId: string) => {
  return api.get<{
    submission: Submission;
    aiAnalysis: {
      score: number;
      feedback: string;
      correctPoints: string[];
      errorPoints: string[];
    };
  }>(`/assignments/${assignmentId}/submissions/${studentId}`);
};

/**
 * 教师批改作业
 * @param assignmentId - 作业ID
 * @param studentId - 学生ID
 * @param data - 批改数据
 * @returns 批改结果
 * 
 * 【后端接口要求】：
 * POST /api/assignments/{id}/submissions/{studentId}/grade
 * Request: { score: number, feedback: string, teacherComments: string }
 * Response: { message: string, submission: Submission }
 */
export const gradeStudentSubmission = async (
  assignmentId: string,
  studentId: string,
  data: {
    score: number;
    feedback: string;
    teacherComments: string;
  }
) => {
  return api.post<{
    message: string;
    submission: Submission;
  }>(`/assignments/${assignmentId}/submissions/${studentId}/grade`, data);
};

/**
 * 打回作业重做
 * @param assignmentId - 作业ID
 * @param studentId - 学生ID
 * @param reason - 打回原因
 * @returns 操作结果
 * 
 * 【后端接口要求】：
 * POST /api/assignments/{id}/submissions/{studentId}/reject
 * Request: { reason: string }
 * Response: { message: string }
 */
export const rejectSubmission = async (
  assignmentId: string,
  studentId: string,
  reason: string
) => {
  return api.post<{ message: string }>(
    `/assignments/${assignmentId}/submissions/${studentId}/reject`,
    { reason }
  );
};
