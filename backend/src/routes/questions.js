const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');
const { authMiddleware, requireRole } = require('../middleware/auth');
const aiService = require('../services/aiService');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const {
    chapter,
    difficulty,
    type,
    source,
    search,
    page = 1,
    limit = 20,
  } = req.query;

  try {
    let query = 'SELECT * FROM questions WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (chapter) {
      query += ` AND chapter = $${paramIndex}`;
      params.push(chapter);
      paramIndex++;
    }

    if (difficulty) {
      query += ` AND difficulty = $${paramIndex}`;
      params.push(difficulty);
      paramIndex++;
    }

    if (type) {
      query += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (source) {
      query += ` AND source = $${paramIndex}`;
      params.push(source);
      paramIndex++;
    }

    if (search) {
      query += ` AND (title ILIKE $${paramIndex} OR content::text ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await db.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const result = await db.query(query, params);

    res.json({
      questions: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('获取题库列表错误:', err);
    res.status(500).json({ error: '获取题库列表失败' });
  }
});

router.get('/local', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM questions WHERE source = 'local' ORDER BY created_at DESC`
    );
    res.json({ questions: result.rows });
  } catch (err) {
    console.error('获取校本题库错误:', err);
    res.status(500).json({ error: '获取数据失败' });
  }
});

router.get('/cloud', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM questions WHERE source = 'cloud' ORDER BY created_at DESC`
    );
    res.json({ questions: result.rows });
  } catch (err) {
    console.error('获取云端题库错误:', err);
    res.status(500).json({ error: '获取数据失败' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT q.*, u.name as creator_name FROM questions q
       LEFT JOIN users u ON q.created_by = u.id
       WHERE q.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '题目不存在' });
    }

    res.json({ question: result.rows[0] });
  } catch (err) {
    console.error('获取题目详情错误:', err);
    res.status(500).json({ error: '获取数据失败' });
  }
});

router.post('/', authMiddleware, requireRole('teacher'), async (req, res) => {
  const { title, type, difficulty, chapter, content, answer, analysis } =
    req.body;

  if (!title || !type || !difficulty || !chapter || !content || !answer) {
    return res.status(400).json({ error: '请填写所有必填字段' });
  }

  try {
    const result = await db.query(
      `INSERT INTO questions (title, type, difficulty, chapter, content, answer, analysis, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, type, difficulty, chapter, content, answer, analysis, req.user.id]
    );

    res.status(201).json({
      message: '题目创建成功',
      question: result.rows[0],
    });
  } catch (err) {
    console.error('创建题目错误:', err);
    res.status(500).json({ error: '创建题目失败' });
  }
});

router.put('/:id', authMiddleware, requireRole('teacher'), async (req, res) => {
  const { title, type, difficulty, chapter, content, answer, analysis } =
    req.body;

  try {
    const checkResult = await db.query(
      'SELECT created_by FROM questions WHERE id = $1',
      [req.params.id]
    );
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: '题目不存在' });
    }

    if (checkResult.rows[0].created_by !== req.user.id) {
      return res.status(403).json({ error: '只能编辑自己创建的题目' });
    }

    const result = await db.query(
      `UPDATE questions SET title = $1, type = $2, difficulty = $3, chapter = $4,
       content = $5, answer = $6, analysis = $7, is_verified = FALSE
       WHERE id = $8 RETURNING *`,
      [
        title,
        type,
        difficulty,
        chapter,
        content,
        answer,
        analysis,
        req.params.id,
      ]
    );

    res.json({
      message: '题目更新成功',
      question: result.rows[0],
    });
  } catch (err) {
    console.error('更新题目错误:', err);
    res.status(500).json({ error: '更新题目失败' });
  }
});

router.delete(
  '/:id',
  authMiddleware,
  requireRole('teacher'),
  async (req, res) => {
    try {
      const checkResult = await db.query(
        'SELECT created_by FROM questions WHERE id = $1',
        [req.params.id]
      );
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: '题目不存在' });
      }

      if (checkResult.rows[0].created_by !== req.user.id) {
        return res.status(403).json({ error: '只能删除自己创建的题目' });
      }

      await db.query('DELETE FROM questions WHERE id = $1', [req.params.id]);

      res.json({ message: '题目删除成功' });
    } catch (err) {
      console.error('删除题目错误:', err);
      res.status(500).json({ error: '删除题目失败' });
    }
  }
);

router.post(
  '/generate',
  authMiddleware,
  requireRole('teacher'),
  async (req, res) => {
    const { chapter, difficulty, count, type } = req.body;

    if (!chapter || !difficulty || !count) {
      return res.status(400).json({ error: '请提供章节、难度和数量' });
    }

    const generatedQuestions = [];

    for (let i = 0; i < Math.min(count, 10); i++) {
      const id = uuidv4();
      const sampleQuestion = {
        title: `【AI生成】${chapter} - ${type || '计算题'} ${i + 1}`,
        type: type || '计算题',
        difficulty,
        chapter,
        content: {
          text: `请分析并解答以下${chapter}相关问题：\n1. 请写出相关定理或公式\n2. 进行详细推导\n3. 给出最终答案`,
          images: [],
        },
        answer: {
          formula: '根据题目要求，答案是：[AI将自动评分]',
          steps: ['理解题意', '应用公式', '计算结果'],
        },
        analysis: `本题考察${chapter}中的${difficulty}知识点，要求学生掌握基本概念并能灵活运用。`,
      };

      const result = await db.query(
        `INSERT INTO questions (title, type, difficulty, chapter, content, answer, analysis, created_by, source, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'local', FALSE) RETURNING *`,
        [
          sampleQuestion.title,
          sampleQuestion.type,
          sampleQuestion.difficulty,
          sampleQuestion.chapter,
          sampleQuestion.content,
          sampleQuestion.answer,
          sampleQuestion.analysis,
          req.user.id,
        ]
      );

      generatedQuestions.push(result.rows[0]);
    }

    res.status(201).json({
      message: `成功生成 ${generatedQuestions.length} 道题目`,
      questions: generatedQuestions,
    });
  }
);

module.exports = router;
