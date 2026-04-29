const express = require('express');
const db = require('../database/db');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/class/:classId', authMiddleware, requireRole('teacher'), async (req, res) => {
  const { classId } = req.params;

  try {
    const assignmentsResult = await db.query(
      `SELECT a.*,
        (SELECT COUNT(*) FROM submissions WHERE assignment_id = a.id) as submissions_count,
        (SELECT AVG(score) FROM submissions WHERE assignment_id = a.id AND status = 'graded') as avg_score
       FROM assignments a
       WHERE a.class_name = $1`,
      [classId]
    );

    const submissionsResult = await db.query(
      `SELECT s.*, u.name as student_name
       FROM submissions s
       JOIN users u ON s.student_id = u.id
       JOIN assignments a ON s.assignment_id = a.id
       WHERE a.class_name = $1 AND s.status = 'graded'`,
      [classId]
    );

    const stats = {
      totalAssignments: assignmentsResult.rows.length,
      totalSubmissions: submissionsResult.rows.length,
      averageScore: submissionsResult.rows.length > 0
        ? (submissionsResult.rows.reduce((acc, s) => acc + parseFloat(s.score || 0), 0) / submissionsResult.rows.length).toFixed(1)
        : 0,
      passRate: submissionsResult.rows.length > 0
        ? ((submissionsResult.rows.filter(s => parseFloat(s.score) >= 60).length / submissionsResult.rows.length) * 100).toFixed(1)
        : 0
    };

    res.json({
      classId,
      assignments: assignmentsResult.rows,
      submissions: submissionsResult.rows,
      stats
    });
  } catch (err) {
    console.error('获取班级分析错误:', err);
    res.status(500).json({ error: '获取分析数据失败' });
  }
});

router.get('/knowledge-mastery', authMiddleware, async (req, res) => {
  const { class_name } = req.query;

  try {
    let query;
    let params = [];

    if (req.user.role === 'teacher') {
      query = `
        SELECT q.chapter,
          AVG(s.score) as avg_score,
          COUNT(*) as total_attempts
        FROM submissions s
        JOIN assignments a ON s.assignment_id = a.id
        JOIN questions q ON q.id = ANY(a.question_ids)
        WHERE a.teacher_id = $1
        GROUP BY q.chapter
      `;
      params.push(req.user.id);
    } else {
      query = `
        SELECT q.chapter,
          AVG(s.score) as avg_score,
          COUNT(*) as total_attempts
        FROM submissions s
        JOIN assignments a ON s.assignment_id = a.id
        JOIN questions q ON q.id = ANY(a.question_ids)
        WHERE s.student_id = $1
        GROUP BY q.chapter
      `;
      params.push(req.user.id);
    }

    if (class_name) {
      query += ' WHERE a.class_name = $2';
      params.push(class_name);
    }

    const result = await db.query(query, params);

    const chapters = ['力学', '热学', '电磁学', '光学', '近代物理'];
    const masteryData = chapters.map(chapter => {
      const data = result.rows.find(r => r.chapter === chapter);
      return {
        chapter,
        mastery: data ? parseFloat(data.avg_score || 0).toFixed(1) : 0,
        attempts: data ? parseInt(data.total_attempts) : 0,
        status: data ? (
          parseFloat(data.avg_score) >= 80 ? 'success' :
          parseFloat(data.avg_score) >= 60 ? 'normal' :
          parseFloat(data.avg_score) >= 40 ? 'warning' : 'danger'
        ) : 'danger'
      };
    });

    res.json({ knowledgeMastery: masteryData });
  } catch (err) {
    console.error('获取知识点掌握度错误:', err);
    res.status(500).json({ error: '获取数据失败' });
  }
});

router.get('/ai-insight', authMiddleware, requireRole('teacher'), async (req, res) => {
  const { class_name } = req.query;

  try {
    const lowScoreQuery = `
      SELECT q.chapter, COUNT(*) as error_count
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN questions q ON q.id = ANY(a.question_ids)
      WHERE a.teacher_id = $1 AND s.score < 60
      GROUP BY q.chapter
      ORDER BY error_count DESC
      LIMIT 3
    `;
    const lowScoreResult = await db.query(lowScoreQuery, [req.user.id]);

    const topStudentsQuery = `
      SELECT u.name, AVG(s.score) as avg_score
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN users u ON s.student_id = u.id
      WHERE a.teacher_id = $1 AND s.status = 'graded'
      GROUP BY u.id, u.name
      ORDER BY avg_score DESC
      LIMIT 5
    `;
    const topStudentsResult = await db.query(topStudentsQuery, [req.user.id]);

    const insights = [];

    if (lowScoreResult.rows.length > 0) {
      insights.push({
        type: 'warning',
        title: '重点预警',
        content: `本班在"${lowScoreResult.rows[0].chapter}"章节的错误率最高，建议增加该章节的专题练习和讲解。`
      });
    }

    if (topStudentsResult.rows.length > 0) {
      const topNames = topStudentsResult.rows.slice(0, 3).map(s => s.name.charAt(0) + '*').join('、');
      insights.push({
        type: 'success',
        title: '优生提拔',
        content: `有${topStudentsResult.rows.length}名同学（如：${topNames}）表现优异，可推荐参与物理竞赛培训。`
      });
    }

    insights.push({
      type: 'info',
      title: '教学建议',
      content: '建议本周增加"相对论"章节的互动答疑时间，该章节学生普遍掌握度较低。'
    });

    res.json({ insights });
  } catch (err) {
    console.error('获取AI洞察错误:', err);
    res.status(500).json({ error: '获取洞察失败' });
  }
});

router.get('/class-activity', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const activityQuery = `
      SELECT
        EXTRACT(DOW FROM s.submitted_at) as day_of_week,
        COUNT(*) as submission_count
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      WHERE a.teacher_id = $1
        AND s.submitted_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY day_of_week
      ORDER BY day_of_week
    `;
    const activityResult = await db.query(activityQuery, [req.user.id]);

    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const activityData = days.map((day, index) => {
      const data = activityResult.rows.find(r => parseInt(r.day_of_week) === index);
      return {
        day,
        count: data ? parseInt(data.submission_count) : 0
      };
    });

    res.json({ classActivity: activityData });
  } catch (err) {
    console.error('获取班级活跃度错误:', err);
    res.status(500).json({ error: '获取数据失败' });
  }
});

module.exports = router;