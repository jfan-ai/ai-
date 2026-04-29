const express = require('express');
const db = require('../database/db');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, requireRole('student'), async (req, res) => {
  const { chapter, error_type, page = 1, limit = 20 } = req.query;

  try {
    let query = `
      SELECT eq.*, q.title, q.type, q.difficulty, q.chapter, q.content, q.answer, q.analysis
      FROM error_questions eq
      JOIN questions q ON eq.question_id = q.id
      WHERE eq.student_id = $1
    `;
    const params = [req.user.id];
    let paramIndex = 2;

    if (chapter) {
      query += ` AND q.chapter = $${paramIndex}`;
      params.push(chapter);
      paramIndex++;
    }

    if (error_type) {
      query += ` AND eq.error_type = $${paramIndex}`;
      params.push(error_type);
      paramIndex++;
    }

    const countQuery = query.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) FROM');
    const countResult = await db.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY eq.error_count DESC, eq.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const result = await db.query(query, params);

    const statsQuery = `
      SELECT
        COUNT(*) as total_errors,
        COUNT(DISTINCT q.chapter) as total_chapters
      FROM error_questions eq
      JOIN questions q ON eq.question_id = q.id
      WHERE eq.student_id = $1
    `;
    const statsResult = await db.query(statsQuery, [req.user.id]);

    res.json({
      errorQuestions: result.rows,
      stats: {
        totalErrors: parseInt(statsResult.rows[0].total_errors),
        totalChapters: parseInt(statsResult.rows[0].total_chapters)
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('获取错题本错误:', err);
    res.status(500).json({ error: '获取数据失败失败' });
  }
});

router.get('/:id', authMiddleware, requireRole('student'), async (req, res) => {
  try {
    const result = await db.query(
      `SELECT eq.*, q.title, q.type, q.difficulty, q.chapter, q.content, q.answer, q.analysis
       FROM error_questions eq
       JOIN questions q ON eq.question_id = q.id
       WHERE eq.id = $1 AND eq.student_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '错题不存在' });
    }

    res.json({ errorQuestion: result.rows[0] });
  } catch (err) {
    console.error('获取错题详情错误:', err);
    res.status(500).json({ error: '获取数据失败' });
  }
});

router.post('/:id/practice', authMiddleware, requireRole('student'), async (req, res) => {
  try {
    const errorQuestionResult = await db.query(
      `SELECT eq.*, q.chapter, q.difficulty, q.type
       FROM error_questions eq
       JOIN questions q ON eq.question_id = q.id
       WHERE eq.id = $1 AND eq.student_id = $2`,
      [req.params.id, req.user.id]
    );

    if (errorQuestionResult.rows.length === 0) {
      return res.status(404).json({ error: '错题不存在' });
    }

    const errorQuestion = errorQuestionResult.rows[0];

    const similarQuestionsResult = await db.query(
      `SELECT * FROM questions
       WHERE chapter = $1 AND difficulty = $2 AND type = $3 AND id != $4
       ORDER BY RANDOM()
       LIMIT 3`,
      [errorQuestion.chapter, errorQuestion.difficulty, errorQuestion.type, errorQuestion.question_id]
    );

    await db.query(
      `UPDATE error_questions SET last_reviewed_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [req.params.id]
    );

    await db.query(
      `INSERT INTO learning_records (student_id, action_type, knowledge_points)
       VALUES ($1, 'error_review', $2)`,
      [req.user.id, JSON.stringify([errorQuestion.chapter])]
    );

    res.json({
      message: '推荐练习题目已生成',
      originalQuestion: errorQuestion,
      recommendedQuestions: similarQuestionsResult.rows
    });
  } catch (err) {
    console.error('推荐练习错误:', err);
    res.status(500).json({ error: '推荐失败' });
  }
});

router.delete('/:id', authMiddleware, requireRole('student'), async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM error_questions WHERE id = $1 AND student_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '错题不存在' });
    }

    res.json({ message: '错题删除成功' });
  } catch (err) {
    console.error('删除错题错误:', err);
    res.status(500).json({ error: '删除失败' });
  }
});

module.exports = router;