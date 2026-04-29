const express = require('express');
const db = require('../database/db');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/report/:studentId', authMiddleware, async (req, res) => {
  const { studentId } = req.params;

  if (req.user.role === 'student' && req.user.id !== studentId) {
    return res.status(403).json({ error: '只能查看自己的报告' });
  }

  try {
    const submissionsResult = await db.query(
      `SELECT s.*, a.title as assignment_title, a.class_name
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       WHERE s.student_id = $1 AND s.status = 'graded'
       ORDER BY s.graded_at DESC
       LIMIT 10`,
      [studentId]
    );

    const statsQuery = `
      SELECT
        COUNT(*) as total_assignments,
        AVG(score) as average_score,
        MAX(score) as highest_score,
        MIN(score) as lowest_score
      FROM submissions
      WHERE student_id = $1 AND status = 'graded'
    `;
    const statsResult = await db.query(statsQuery, [studentId]);

    const achievementsResult = await db.query(
      `SELECT a.*, sa.earned_at
       FROM achievements a
       JOIN student_achievements sa ON a.id = sa.achievement_id
       WHERE sa.student_id = $1
       ORDER BY sa.earned_at DESC`,
      [studentId]
    );

    const errorCountResult = await db.query(
      'SELECT COUNT(*) as count FROM error_questions WHERE student_id = $1',
      [studentId]
    );

    const stats = statsResult.rows[0];
    const report = {
      studentId,
      overview: {
        totalAssignments: parseInt(stats.total_assignments) || 0,
        averageScore: parseFloat(stats.average_score || 0).toFixed(1),
        highestScore: parseFloat(stats.highest_score || 0).toFixed(1),
        lowestScore: parseFloat(stats.lowest_score || 0).toFixed(1),
        totalErrors: parseInt(errorCountResult.rows[0].count)
      },
      recentSubmissions: submissionsResult.rows,
      achievements: achievementsResult.rows
    };

    res.json({ report });
  } catch (err) {
    console.error('获取成长报告错误:', err);
    res.status(500).json({ error: '获取报告失败' });
  }
});

router.get('/weekly-stats', authMiddleware, requireRole('student'), async (req, res) => {
  try {
    const weeklyQuery = `
      SELECT
        DATE_TRUNC('week', created_at) as week_start,
        SUM(duration_minutes) as total_minutes,
        COUNT(*) as total_activities
      FROM learning_records
      WHERE student_id = $1
        AND created_at >= CURRENT_DATE - INTERVAL '4 weeks'
      GROUP BY week_start
      ORDER BY week_start
    `;
    const weeklyResult = await db.query(weeklyQuery, [req.user.id]);

    const dailyQuery = `
      SELECT
        DATE_TRUNC('day', created_at) as day,
        SUM(duration_minutes) as total_minutes
      FROM learning_records
      WHERE student_id = $1
        AND created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY day
      ORDER BY day
    `;
    const dailyResult = await db.query(dailyQuery, [req.user.id]);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    const dailyStats = days.map((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      const dateStr = date.toISOString().split('T')[0];
      const data = dailyResult.rows.find(r => r.day && r.day.toISOString().split('T')[0] === dateStr);
      return {
        day,
        minutes: data ? parseInt(data.total_minutes) : 0
      };
    });

    res.json({
      weeklyTrend: weeklyResult.rows.map(w => ({
        week: w.week_start,
        minutes: parseInt(w.total_minutes) || 0,
        activities: parseInt(w.total_activities) || 0
      })),
      dailyStats
    });
  } catch (err) {
    console.error('获取每周统计错误:', err);
    res.status(500).json({ error: '获取统计数据失败' });
  }
});

router.get('/achievements', authMiddleware, requireRole('student'), async (req, res) => {
  try {
    const allAchievementsResult = await db.query('SELECT * FROM achievements');
    const earnedResult = await db.query(
      `SELECT achievement_id, earned_at FROM student_achievements WHERE student_id = $1`,
      [req.user.id]
    );

    const earnedIds = earnedResult.rows.map(r => r.achievement_id);

    const achievements = allAchievementsResult.rows.map(a => ({
      ...a,
      earned: earnedIds.includes(a.id),
      earnedAt: earnedResult.rows.find(r => r.achievement_id === a.id)?.earned_at
    }));

    res.json({ achievements });
  } catch (err) {
    console.error('获取成就错误:', err);
    res.status(500).json({ error: '获取成就失败' });
  }
});

router.post('/check-achievements', authMiddleware, requireRole('student'), async (req, res) => {
  try {
    const statsResult = await db.query(
      `SELECT
        COUNT(*) as total_completed,
        AVG(score) as avg_score
       FROM submissions
       WHERE student_id = $1 AND status = 'graded'`,
      [req.user.id]
    );

    const chapterStatsResult = await db.query(
      `SELECT q.chapter, COUNT(*) as count
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       JOIN questions q ON q.id = ANY(a.question_ids)
       WHERE s.student_id = $1 AND s.status = 'graded'
       GROUP BY q.chapter`,
      [req.user.id]
    );

    const achievementsResult = await db.query('SELECT * FROM achievements');
    const earnedResult = await db.query(
      'SELECT achievement_id FROM student_achievements WHERE student_id = $1',
      [req.user.id]
    );

    const earnedIds = earnedResult.rows.map(r => r.achievement_id);
    const newlyEarned = [];

    for (const achievement of achievementsResult.rows) {
      if (earnedIds.includes(achievement.id)) continue;

      const criteria = achievement.criteria;
      let earned = false;

      if (achievement.name === '力学先锋' && criteria.chapter === '力学') {
        const mechStats = chapterStatsResult.rows.find(c => c.chapter === '力学');
        earned = mechStats && parseFloat(mechStats.count) > 0;
      } else if (achievement.name === '公式达人') {
        earned = parseInt(statsResult.rows[0].total_completed) >= 10;
      } else if (achievement.name === '光学探索者' && criteria.chapter === '光学') {
        const optStats = chapterStatsResult.rows.find(c => c.chapter === '光学');
        earned = optStats && parseInt(optStats.count) > 0;
      } else if (achievement.name === '热学入门' && criteria.chapter === '热学') {
        const thermStats = chapterStatsResult.rows.find(c => c.chapter === '热学');
        earned = thermStats && parseInt(thermStats.count) > 0;
      }

      if (earned) {
        await db.query(
          'INSERT INTO student_achievements (student_id, achievement_id) VALUES ($1, $2)',
          [req.user.id, achievement.id]
        );
        newlyEarned.push(achievement);
      }
    }

    res.json({
      message: newlyEarned.length > 0 ? `获得 ${newlyEarned.length} 个新成就！` : '暂无新成就',
      newlyEarned
    });
  } catch (err) {
    console.error('检查成就错误:', err);
    res.status(500).json({ error: '检查成就失败' });
  }
});

module.exports = router;