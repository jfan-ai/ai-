const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const { status, class_name, page = 1, limit = 20 } = req.query;

  try {
    let query;
    let params = [];
    let paramIndex = 1;

    if (req.user.role === 'teacher') {
      query = `SELECT a.*,
        (SELECT COUNT(*) FROM submissions WHERE assignment_id = a.id) as submissions_count,
        (SELECT COUNT(*) FROM class_students cs JOIN classes c ON cs.class_id = c.id WHERE c.name = a.class_name) as total_students
        FROM assignments a WHERE teacher_id = $1`;
      params.push(req.user.id);
      paramIndex++;
    } else {
      query = `SELECT a.*,
        s.score, s.status as submission_status, s.submitted_at
        FROM assignments a
        LEFT JOIN submissions s ON a.id = s.assignment_id AND s.student_id = $1
        WHERE a.status IN ('active', 'finished', 'graded')`;
      params.push(req.user.id);
      paramIndex++;
    }

    if (status) {
      query += ` AND a.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (class_name) {
      query += ` AND a.class_name = $${paramIndex}`;
      params.push(class_name);
      paramIndex++;
    }

    // 构建计数查询 - 需要正确处理子查询
    let countQuery;
    let countParams;
    if (req.user.role === 'teacher') {
      countQuery = `SELECT COUNT(*) as count FROM assignments a WHERE teacher_id = $1`;
      countParams = [req.user.id];
      let countIndex = 2;
      
      if (status) {
        countQuery += ` AND a.status = $${countIndex}`;
        countParams.push(status);
        countIndex++;
      }
      
      if (class_name) {
        countQuery += ` AND a.class_name = $${countIndex}`;
        countParams.push(class_name);
        countIndex++;
      }
    } else {
      countQuery = query
        .replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) FROM')
        .replace(/LEFT JOIN[\s\S]*?WHERE/, 'WHERE');
      countParams = params;
    }
    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY a.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const result = await db.query(query, params);

    res.json({
      assignments: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('获取作业列表错误:', err);
    res.status(500).json({ error: '获取数据失败' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const assignmentResult = await db.query(
      `SELECT a.*, u.name as teacher_name
       FROM assignments a
       LEFT JOIN users u ON a.teacher_id = u.id
       WHERE a.id = $1`,
      [req.params.id]
    );

    if (assignmentResult.rows.length === 0) {
      return res.status(404).json({ error: '作业不存在' });
    }

    const assignment = assignmentResult.rows[0];

    const questionsResult = await db.query(
      `SELECT * FROM questions WHERE id = ANY($1)`,
      [assignment.question_ids]
    );

    let submission = null;
    if (req.user.role === 'student') {
      const submissionResult = await db.query(
        `SELECT * FROM submissions WHERE assignment_id = $1 AND student_id = $2`,
        [req.params.id, req.user.id]
      );
      submission = submissionResult.rows[0] || null;
    }

    res.json({
      assignment,
      questions: questionsResult.rows,
      submission,
    });
  } catch (err) {
    console.error('获取作业详情错误:', err);
    res.status(500).json({ error: '获取数据失败' });
  }
});

router.post('/', authMiddleware, requireRole('teacher'), async (req, res) => {
  const {
    title,
    class_name,
    deadline,
    grading_type,
    question_ids,
    status = 'draft',
  } = req.body;

  if (
    !title ||
    !class_name ||
    !deadline ||
    !question_ids ||
    question_ids.length === 0
  ) {
    return res.status(400).json({ error: '请填写所有必填字段' });
  }

  try {
    const result = await db.query(
      `INSERT INTO assignments (title, teacher_id, class_name, deadline, grading_type, question_ids, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        title,
        req.user.id,
        class_name,
        deadline,
        grading_type || 'AI',
        question_ids,
        status,
      ]
    );

    res.status(201).json({
      message: '作业创建成功',
      assignment: result.rows[0],
    });
  } catch (err) {
    console.error('创建作业错误:', err);
    res.status(500).json({ error: '创建作业失败' });
  }
});

router.put('/:id', authMiddleware, requireRole('teacher'), async (req, res) => {
  const { title, class_name, deadline, grading_type, question_ids, status } =
    req.body;

  try {
    const checkResult = await db.query(
      'SELECT teacher_id FROM assignments WHERE id = $1',
      [req.params.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: '作业不存在' });
    }

    if (checkResult.rows[0].teacher_id !== req.user.id) {
      return res.status(403).json({ error: '只能编辑自己的作业' });
    }

    const result = await db.query(
      `UPDATE assignments SET
       title = COALESCE($1, title),
       class_name = COALESCE($2, class_name),
       deadline = COALESCE($3, deadline),
       grading_type = COALESCE($4, grading_type),
       question_ids = COALESCE($5, question_ids),
       status = COALESCE($6, status)
       WHERE id = $7 RETURNING *`,
      [
        title,
        class_name,
        deadline,
        grading_type,
        question_ids,
        status,
        req.params.id,
      ]
    );

    res.json({
      message: '作业更新成功',
      assignment: result.rows[0],
    });
  } catch (err) {
    console.error('更新作业错误:', err);
    res.status(500).json({ error: '更新作业失败' });
  }
});

router.delete(
  '/:id',
  authMiddleware,
  requireRole('teacher'),
  async (req, res) => {
    try {
      const checkResult = await db.query(
        'SELECT teacher_id FROM assignments WHERE id = $1',
        [req.params.id]
      );

      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: '作业不存在' });
      }

      if (checkResult.rows[0].teacher_id !== req.user.id) {
        return res.status(403).json({ error: '只能删除自己的作业' });
      }

      await db.query('DELETE FROM submissions WHERE assignment_id = $1', [
        req.params.id,
      ]);
      await db.query('DELETE FROM assignments WHERE id = $1', [req.params.id]);

      res.json({ message: '作业删除成功' });
    } catch (err) {
      console.error('删除作业错误:', err);
      res.status(500).json({ error: '删除作业失败' });
    }
  }
);

router.post(
  '/:id/submit',
  authMiddleware,
  requireRole('student'),
  async (req, res) => {
    const { answers } = req.body;

    if (!answers) {
      return res.status(400).json({ error: '请提供答案' });
    }

    try {
      const assignmentResult = await db.query(
        'SELECT * FROM assignments WHERE id = $1 AND status IN ($2, $3)',
        [req.params.id, 'active', 'finished']
      );

      if (assignmentResult.rows.length === 0) {
        return res.status(404).json({ error: '作业不存在或未发布' });
      }

      const existingResult = await db.query(
        'SELECT id FROM submissions WHERE assignment_id = $1 AND student_id = $2',
        [req.params.id, req.user.id]
      );

      if (existingResult.rows.length > 0) {
        return res.status(409).json({ error: '您已经提交过该作业' });
      }

      const submissionId = uuidv4();
      const result = await db.query(
        `INSERT INTO submissions (id, assignment_id, student_id, answers, status)
       VALUES ($1, $2, $3, $4, 'submitted') RETURNING *`,
        [submissionId, req.params.id, req.user.id, answers]
      );

      await db.query(
        `UPDATE assignments SET status = 'active' WHERE id = $1 AND status = 'draft'`,
        [req.params.id]
      );

      res.status(201).json({
        message: '作业提交成功',
        submission: result.rows[0],
      });
    } catch (err) {
      console.error('提交作业错误:', err);
      res.status(500).json({ error: '提交作业失败' });
    }
  }
);

router.post(
  '/:id/grade',
  authMiddleware,
  requireRole('teacher'),
  async (req, res) => {
    const { submission_id, score, feedback } = req.body;

    try {
      const checkResult = await db.query(
        `SELECT s.*, a.teacher_id FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       WHERE s.id = $1 AND a.id = $2`,
        [submission_id, req.params.id]
      );

      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: '提交记录不存在' });
      }

      if (checkResult.rows[0].teacher_id !== req.user.id) {
        return res.status(403).json({ error: '只能批改自己的作业' });
      }

      const aiFeedback = feedback || {
        totalScore: score,
        correctAnswers: Math.round(
          (score / 100) * checkResult.rows[0].answers.length
        ),
        totalQuestions: checkResult.rows[0].answers.length,
        suggestions: ['答案基本正确', '建议加强概念理解'],
      };

      const result = await db.query(
        `UPDATE submissions SET score = $1, ai_feedback = $2, status = 'graded', graded_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING *`,
        [score, aiFeedback, submission_id]
      );

      const unsubmittedResult = await db.query(
        `SELECT COUNT(*) as count FROM submissions WHERE assignment_id = $1 AND status = 'submitted'`,
        [req.params.id]
      );

      if (parseInt(unsubmittedResult.rows[0].count) === 0) {
        await db.query(
          `UPDATE assignments SET status = 'graded' WHERE id = $1`,
          [req.params.id]
        );
      }

      res.json({
        message: '批改完成',
        submission: result.rows[0],
      });
    } catch (err) {
      console.error('批改作业错误:', err);
      res.status(500).json({ error: '批改作业失败' });
    }
  }
);

// 获取作业管理统计数据
router.get(
  '/stats/overview',
  authMiddleware,
  requireRole('teacher'),
  async (req, res) => {
    try {
      const teacherId = req.user.id;

      // 进行中作业数量
      const activeResult = await db.query(
        `SELECT COUNT(*) as count FROM assignments 
       WHERE teacher_id = $1 AND status = 'active'`,
        [teacherId]
      );

      // 待批改作业数量（已提交但未批改的）
      const pendingResult = await db.query(
        `SELECT COUNT(*) as count FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       WHERE a.teacher_id = $1 AND s.status = 'submitted'`,
        [teacherId]
      );

      // 覆盖学生总数（所有作业关联班级的学生总数）
      const studentsResult = await db.query(
        `SELECT COUNT(DISTINCT s.student_id) as count 
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       WHERE a.teacher_id = $1`,
        [teacherId]
      );

      res.json({
        activeAssignments: parseInt(activeResult.rows[0].count),
        pendingGrading: parseInt(pendingResult.rows[0].count),
        totalStudents: parseInt(studentsResult.rows[0].count),
      });
    } catch (err) {
      console.error('获取作业统计错误:', err);
      res.status(500).json({ error: '获取统计数据失败' });
    }
  }
);

module.exports = router;
