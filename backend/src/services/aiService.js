const OpenAI = require('openai');
require('dotenv').config();

class AIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.AI_API_KEY,
      baseURL: process.env.AI_API_URL
    });
  }

  async generateQuestions(chapter, difficulty, count, type) {
    try {
      const prompt = `请为大学物理课程生成${count}道关于"${chapter}"的${difficulty}难度${type}。

要求：
1. 每道题目要有明确的考察知识点
2. 计算题需要给出详细的标准答案和解题步骤
3. 选择题需要给出正确答案和解析
4. 题目要符合大学物理教学大纲

请以JSON格式返回，格式如下：
{
  "questions": [
    {
      "title": "题目描述",
      "type": "题型",
      "difficulty": "难度",
      "chapter": "章节",
      "content": {"text": "题目内容", "images": []},
      "answer": {"result": "答案", "steps": ["步骤1", "步骤2"]},
      "analysis": "题目解析"
    }
  ]
}`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的大学物理教师，擅长出题和批改作业。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      });

      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return { questions: [] };
    } catch (error) {
      console.error('AI生成题目错误:', error);
      throw new Error('AI生成题目失败');
    }
  }

  async gradeHomework(studentAnswer, question, standardAnswer) {
    try {
      const prompt = `请批改以下大学物理作业：

题目：${question}
标准答案：${JSON.stringify(standardAnswer)}
学生答案：${studentAnswer}

请从以下几个方面进行批改：
1. 判断学生答案是否正确
2. 指出错误点（如果有）
3. 给出得分（满分100分）
4. 写出批改理由

请以JSON格式返回，格式如下：
{
  "score": 85,
  "isCorrect": true/false,
  "errorPoints": ["错误点1", "错误点2"],
  "feedback": "总体评价",
  "suggestions": ["建议1", "建议2"]
}`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一位严格的大学物理教师，擅长客观公正地批改作业。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        score: 0,
        isCorrect: false,
        errorPoints: ['无法解析AI响应'],
        feedback: '批改失败',
        suggestions: ['请重新提交']
      };
    } catch (error) {
      console.error('AI批改作业错误:', error);
      throw new Error('AI批改作业失败');
    }
  }

  async analyzeKnowledgeMastery(classSubmissions) {
    try {
      const prompt = `请分析以下班级学生的学习情况数据：

${JSON.stringify(classSubmissions, null, 2)}

请分析：
1. 哪些知识点掌握较好
2. 哪些知识点是薄弱环节
3. 给教学建议

请以JSON格式返回，格式如下：
{
  "strengths": [{"chapter": "力学", "mastery": 85, "reason": "原因"}],
  "weaknesses": [{"chapter": "相对论", "mastery": 45, "reason": "原因"}],
  "suggestions": ["建议1", "建议2"]
}`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一位经验丰富的物理教学专家，擅长分析学情数据并给出教学建议。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 3000
      });

      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        strengths: [],
        weaknesses: [],
        suggestions: ['数据不足，无法分析']
      };
    } catch (error) {
      console.error('AI学情分析错误:', error);
      throw new Error('AI学情分析失败');
    }
  }

  async recommendPractice(errorType, chapter, studentLevel) {
    try {
      const prompt = `请为学生推荐物理练习题目：

学生情况：
- 薄弱章节：${chapter}
- 错误类型：${errorType}
- 当前水平：${studentLevel}

请推荐3道针对性练习题，并给出推荐理由。

请以JSON格式返回，格式如下：
{
  "recommendations": [
    {
      "title": "题目标题",
      "type": "题型",
      "difficulty": "难度",
      "reason": "推荐理由"
    }
  ]
}`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一位耐心的物理家教，擅长根据学生情况推荐合适的练习题。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      });

      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return { recommendations: [] };
    } catch (error) {
      console.error('AI推荐练习错误:', error);
      throw new Error('AI推荐练习失败');
    }
  }

  async generateGrowthInsight(studentStats) {
    try {
      const prompt = `请分析以下学生的学习数据，生成成长洞察：

${JSON.stringify(studentStats, null, 2)}

请分析：
1. 学生的学习进步情况
2. 值得表扬的方面
3. 需要改进的方面
4. 个性化的学习建议

请以JSON格式返回，格式如下：
{
  "highlights": [{"title": "卓越进步", "content": "具体描述"}],
  "improvements": [{"title": "改进建议", "content": "具体描述"}],
  "suggestions": ["建议1", "建议2"],
  "newAchievements": ["可能获得的新成就"]
}`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一位鼓励学生成长的学习导师，擅长发掘学生的闪光点并给出积极建议。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      });

      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        highlights: [],
        improvements: [],
        suggestions: ['数据不足'],
        newAchievements: []
      };
    } catch (error) {
      console.error('AI成长洞察错误:', error);
      throw new Error('AI成长洞察失败');
    }
  }
}

module.exports = new AIService();