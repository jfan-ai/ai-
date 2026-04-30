import api from './api';

export interface GenerateQuestionsRequest {
  topic: string;
  count?: number;
  difficulty?: string;
  type?: string;
}

export interface CorrectHomeworkRequest {
  content: string;
  question?: string;
  standardAnswer?: string;
}

export interface AnalyzeClassRequest {
  classId: string;
}

export const aiService = {
  // 智能组卷 - 生成题目
  async generateQuestions(data: GenerateQuestionsRequest) {
    const response = await api.post('/api/ai/generate-questions', {
      chapter: data.topic,
      count: data.count || 5,
      difficulty: data.difficulty || '中等',
      type: data.type || '综合',
    });
    return response.data;
  },

  // 专业批改
  async correctHomework(data: CorrectHomeworkRequest) {
    const response = await api.post('/api/ai/grade', {
      studentAnswer: data.content,
      question: data.question,
      standardAnswer: data.standardAnswer,
    });
    return response.data;
  },

  // 学情分析
  async analyzeClass(data: AnalyzeClassRequest) {
    const response = await api.post('/api/ai/analyze', {
      classId: data.classId,
    });
    return response.data;
  },
};
