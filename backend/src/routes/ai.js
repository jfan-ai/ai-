const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { authMiddleware } = require('../middleware/auth');

// 生成题目 - 直接返回模拟数据
router.post('/generate-questions', async (req, res) => {
  try {
    const { chapter, difficulty, count } = req.body;

    if (!chapter) {
      return res.status(400).json({ error: '章节名称不能为空' });
    }

    // 直接返回模拟数据，不调用 AI 服务
    const result = {
      questions: [
        {
          title: `${chapter} - 基础概念题`,
          type: '选择题',
          difficulty: difficulty || '中等',
          chapter: chapter,
          content: {
            text: `关于${chapter}的基本概念，以下说法正确的是？\nA. 选项A\nB. 选项B\nC. 选项C\nD. 选项D`,
            images: [],
          },
          answer: { result: 'B', steps: ['根据定义分析', '排除错误选项'] },
          analysis: '本题考察基本概念的理解',
        },
        {
          title: `${chapter} - 计算题`,
          type: '计算题',
          difficulty: difficulty || '中等',
          chapter: chapter,
          content: {
            text: `在${chapter}中，一个物体从静止开始匀加速运动，加速度为2m/s²，求3秒后的速度。`,
            images: [],
          },
          answer: {
            result: '答案：6m/s',
            steps: [
              '已知：v₀=0, a=2m/s², t=3s',
              '使用公式：v = v₀ + at',
              '计算：v = 0 + 2×3 = 6m/s',
            ],
          },
          analysis: '本题考察公式应用和计算能力',
        },
        {
          title: `${chapter} - 应用题`,
          type: '应用题',
          difficulty: difficulty || '中等',
          chapter: chapter,
          content: {
            text: `结合实际场景，一辆汽车以10m/s的速度行驶，刹车后加速度为-2m/s²，求刹车距离。`,
            images: [],
          },
          answer: {
            result: '答案：25m',
            steps: [
              '已知：v₀=10m/s, v=0, a=-2m/s²',
              '使用公式：v² = v₀² + 2as',
              '计算：0 = 100 + 2×(-2)×s, s = 25m',
            ],
          },
          analysis: '本题考察知识应用能力',
        },
      ],
    };

    res.json(result);
  } catch (error) {
    console.error('生成题目错误:', error);
    res.status(500).json({ error: '生成题目失败', message: error.message });
  }
});

// 批改作业 - 直接返回模拟数据
router.post('/grade', async (req, res) => {
  try {
    const { studentAnswer } = req.body;

    if (!studentAnswer) {
      return res.status(400).json({ error: '学生答案不能为空' });
    }

    // 直接返回模拟数据
    const result = {
      score: 85,
      isCorrect: false,
      errorPoints: ['计算过程不完整', '单位换算错误'],
      feedback:
        '整体思路正确，但在细节处理上需要加强。建议仔细检查计算步骤和单位。',
      suggestions: ['重新检查计算过程', '注意单位统一', '多做类似练习'],
    };

    res.json(result);
  } catch (error) {
    console.error('批改作业错误:', error);
    res.status(500).json({ error: '批改作业失败', message: error.message });
  }
});

// 学情分析 - 直接返回模拟数据
router.post('/analyze', async (req, res) => {
  try {
    const { classId } = req.body;

    if (!classId) {
      return res.status(400).json({ error: '班级ID不能为空' });
    }

    // 直接返回模拟数据
    const result = {
      analysis: `该班级整体学习情况分析完成。优势领域：力学基础、运动学；薄弱环节：电磁学、热力学。`,
      strengths: [
        { chapter: '力学基础', mastery: 85, reason: '基本概念掌握扎实' },
        { chapter: '运动学', mastery: 80, reason: '公式应用熟练' },
      ],
      weaknesses: [
        { chapter: '电磁学', mastery: 60, reason: '概念理解不够深入' },
        { chapter: '热力学', mastery: 55, reason: '计算题失分较多' },
      ],
      suggestions: [
        '加强电磁学概念讲解',
        '增加热力学计算练习',
        '定期复习薄弱环节',
      ],
    };

    res.json(result);
  } catch (error) {
    console.error('学情分析错误:', error);
    res.status(500).json({ error: '学情分析失败', message: error.message });
  }
});

// 推荐练习
router.post('/recommend', authMiddleware, async (req, res) => {
  try {
    const { errorType, chapter, studentLevel } = req.body;

    const result = await aiService.recommendPractice(
      errorType || '',
      chapter || '',
      studentLevel || '中等'
    );

    res.json(result);
  } catch (error) {
    console.error('推荐练习错误:', error);
    res.status(500).json({ error: '推荐练习失败', message: error.message });
  }
});

// 生成成长洞察
router.post('/growth-insight', authMiddleware, async (req, res) => {
  try {
    const { studentStats } = req.body;

    const result = await aiService.generateGrowthInsight(studentStats || {});

    res.json(result);
  } catch (error) {
    console.error('成长洞察错误:', error);
    res.status(500).json({ error: '生成成长洞察失败', message: error.message });
  }
});

module.exports = router;
