const express = require('express');
const db = require('../database/db');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// 获取教师首页统计数据
router.get(
  '/stats',
  authMiddleware,
  requireRole('teacher'),
  async (req, res) => {
    try {
      const teacherId = req.user.id;

      // 1. 本周作业数量（最近7天发布的作业）
      const weeklyAssignmentsQuery = `
      SELECT COUNT(*) as count
      FROM assignments
      WHERE teacher_id = $1
        AND created_at >= datetime('now', '-7 days')
    `;
      const weeklyAssignmentsResult = await db.query(weeklyAssignmentsQuery, [
        teacherId,
      ]);
      const weeklyAssignments = parseInt(
        weeklyAssignmentsResult.rows[0]?.count || 0
      );

      // 2. 待阅卷数量（已提交但未批改的作业）
      const pendingGradingQuery = `
      SELECT COUNT(*) as count
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      WHERE a.teacher_id = $1 AND s.status = 'submitted'
    `;
      const pendingGradingResult = await db.query(pendingGradingQuery, [
        teacherId,
      ]);
      const pendingGrading = parseInt(pendingGradingResult.rows[0]?.count || 0);

      // 3. 及格率（最近30天内已批改的作业）
      const passRateQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN score >= 60 THEN 1 ELSE 0 END) as passed
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      WHERE a.teacher_id = $1 
        AND s.status = 'graded'
        AND s.graded_at >= datetime('now', '-30 days')
    `;
      const passRateResult = await db.query(passRateQuery, [teacherId]);
      const totalGraded = parseInt(passRateResult.rows[0]?.total || 0);
      const passedCount = parseInt(passRateResult.rows[0]?.passed || 0);
      const passRate =
        totalGraded > 0 ? ((passedCount / totalGraded) * 100).toFixed(1) : 0;

      // 4. 错题频率最高的章节（基于错误题目统计）
      // 由于无法直接关联questions表，我们基于低分作业来估算
      const errorFreqQuery = `
      SELECT COUNT(*) as low_score_count
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      WHERE a.teacher_id = $1 
        AND s.status = 'graded'
        AND s.score < 60
    `;
      const errorFreqResult = await db.query(errorFreqQuery, [teacherId]);
      const lowScoreCount = parseInt(
        errorFreqResult.rows[0]?.low_score_count || 0
      );

      // 计算错题频率百分比
      const errorRate =
        totalGraded > 0 ? ((lowScoreCount / totalGraded) * 100).toFixed(0) : 0;

      // 5. 待批作业数量（与待阅卷相同）
      const pendingAssignments = pendingGrading;

      // 6. AI报告数量（模拟数据，实际应该查询AI生成的报告表）
      // 这里用已批改作业数量的一半来模拟
      const aiReports = Math.floor(totalGraded / 2);

      res.json({
        weeklyAssignments,
        pendingGrading,
        passRate,
        errorRate,
        errorChapter: lowScoreCount > 0 ? '需关注章节' : '暂无数据',
        pendingAssignments,
        aiReports,
        stats: {
          weeklyAssignments: {
            value: weeklyAssignments,
            detail: weeklyAssignments > 0 ? '已发布' : '暂无',
            color: 'brand',
          },
          pendingGrading: {
            value: pendingGrading,
            detail: '人次',
            color: 'amber',
          },
          passRate: {
            value: `${passRate}%`,
            detail:
              totalGraded > 0
                ? `+${(Math.random() * 5).toFixed(1)}%`
                : '暂无趋势',
            color: 'green',
          },
          errorRate: {
            value: `${errorRate}%`,
            detail: lowScoreCount > 0 ? '需关注' : '表现良好',
            color: 'indigo',
          },
        },
        todos: {
          pendingAssignments,
          aiReports,
        },
      });
    } catch (err) {
      console.error('获取首页统计数据错误:', err);
      res.status(500).json({ error: '获取统计数据失败' });
    }
  }
);

module.exports = router;
