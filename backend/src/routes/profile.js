const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database/db');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    let profile;

    if (req.user.role === 'teacher') {
      const result = await db.query(
        `SELECT u.id, u.email, u.name, u.avatar, u.role, u.created_at,
                t.department, t.title, t.is_verified, t.id_card
         FROM users u
         LEFT JOIN teachers t ON u.id = t.user_id
         WHERE u.id = $1`,
        [req.user.id]
      );
      profile = result.rows[0];
    } else {
      const result = await db.query(
        `SELECT u.id, u.email, u.name, u.avatar, u.role, u.created_at,
                s.student_id, s.class_name, s.grade, s.physics_level
         FROM users u
         LEFT JOIN students s ON u.id = s.user_id
         WHERE u.id = $1`,
        [req.user.id]
      );
      profile = result.rows[0];
    }

    res.json({ profile });
  } catch (err) {
    console.error('获取个人信息错误:', err);
    res.status(500).json({ error: '获取信息失败' });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  const { name, avatar } = req.body;

  try {
    const result = await db.query(
      `UPDATE users SET name = COALESCE($1, name), avatar = COALESCE($2, avatar), updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING id, email, name, avatar, role`,
      [name, avatar, req.user.id]
    );

    if (req.user.role === 'teacher' && req.body.department) {
      await db.query(
        'UPDATE teachers SET department = $1 WHERE user_id = $2',
        [req.body.department, req.user.id]
      );
    }

    if (req.user.role === 'student' && (req.body.class_name || req.body.grade)) {
      await db.query(
        'UPDATE students SET class_name = COALESCE($1, class_name), grade = COALESCE($2, grade) WHERE user_id = $3',
        [req.body.class_name, req.body.grade, req.user.id]
      );
    }

    res.json({
      message: '个人信息更新成功',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('更新个人信息错误:', err);
    res.status(500).json({ error: '更新失败' });
  }
});

router.put('/password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: '请提供旧密码和新密码' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: '新密码长度至少6位' });
  }

  try {
    const result = await db.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);

    const isOldPasswordValid = await bcrypt.compare(oldPassword, result.rows[0].password_hash);
    if (!isOldPasswordValid) {
      return res.status(401).json({ error: '旧密码错误' });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, req.user.id]
    );

    res.json({ message: '密码修改成功' });
  } catch (err) {
    console.error('修改密码错误:', err);
    res.status(500).json({ error: '修改密码失败' });
  }
});

router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.user.id]
    );

    const unreadResult = await db.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = FALSE',
      [req.user.id]
    );

    res.json({
      notifications: result.rows,
      unreadCount: parseInt(unreadResult.rows[0].count)
    });
  } catch (err) {
    console.error('获取通知错误:', err);
    res.status(500).json({ error: '获取通知失败' });
  }
});

router.put('/notifications', authMiddleware, async (req, res) => {
  const { notification_ids } = req.body;

  try {
    if (notification_ids && notification_ids.length > 0) {
      await db.query(
        'UPDATE notifications SET is_read = TRUE WHERE id = ANY($1) AND user_id = $2',
        [notification_ids, req.user.id]
      );
    } else {
      await db.query(
        'UPDATE notifications SET is_read = TRUE WHERE user_id = $1',
        [req.user.id]
      );
    }

    res.json({ message: '通知已标记为已读' });
  } catch (err) {
    console.error('更新通知错误:', err);
    res.status(500).json({ error: '更新通知失败' });
  }
});

router.delete('/notifications/:id', authMiddleware, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    res.json({ message: '通知删除成功' });
  } catch (err) {
    console.error('删除通知错误:', err);
    res.status(500).json({ error: '删除通知失败' });
  }
});

module.exports = router;