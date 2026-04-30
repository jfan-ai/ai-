const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: '请填写所有必填字段' });
  }

  if (!['teacher', 'student'].includes(role)) {
    return res.status(400).json({ error: '无效的角色类型' });
  }

  try {
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: '该邮箱已被注册' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // 插入用户
    await db.query(
      `INSERT INTO users (id, email, password_hash, role, name) VALUES ($1, $2, $3, $4, $5)`,
      [userId, email, passwordHash, role, name]
    );

    // 插入角色扩展表
    if (role === 'teacher') {
      await db.query(`INSERT INTO teachers (user_id) VALUES ($1)`, [userId]);
    } else {
      await db.query(`INSERT INTO students (user_id) VALUES ($1)`, [userId]);
    }

    // 查询刚创建的用户
    const newUser = await db.query(
      'SELECT id, email, role, name, avatar, created_at FROM users WHERE id = $1',
      [userId]
    );

    const token = jwt.sign(
      { id: userId, email, role, name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: '注册成功',
      token,
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error('注册错误:', err);
    res.status(500).json({ error: '注册失败' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: '请提供邮箱和密码' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error('登录错误:', err);
    res.status(500).json({ error: '登录失败' });
  }
});

router.post('/logout', authMiddleware, (req, res) => {
  res.json({ message: '退出成功' });
});

router.post('/refresh-token', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ token });
  } catch (err) {
    console.error('刷新令牌错误:', err);
    res.status(500).json({ error: '刷新令牌失败' });
  }
});

module.exports = router;
