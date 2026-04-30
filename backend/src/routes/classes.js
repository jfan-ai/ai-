const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 获取所有班级（需要认证）
router.get('/', authMiddleware, async (req, res) => {
  try {
    const classes = await db.query(
      `SELECT c.*, u.name as teacher_name, COUNT(cs.student_id) as student_count 
       FROM classes c 
       JOIN users u ON c.teacher_id = u.id 
       LEFT JOIN class_students cs ON c.id = cs.class_id 
       GROUP BY c.id, u.name 
       ORDER BY c.created_at DESC`
    );

    res.json({ classes: classes.rows });
  } catch (err) {
    console.error('获取班级列表错误:', err);
    res.status(500).json({ error: '获取班级列表失败' });
  }
});

// 创建班级
router.post('/', authMiddleware, async (req, res) => {
  const { name, description } = req.body;
  const teacherId = req.user.id;

  if (!name) {
    return res.status(400).json({ error: '班级名称不能为空' });
  }

  try {
    const classId = uuidv4();
    await db.query(
      'INSERT INTO classes (id, name, teacher_id, description) VALUES ($1, $2, $3, $4)',
      [classId, name, teacherId, description || '']
    );

    const newClass = await db.query('SELECT * FROM classes WHERE id = $1', [
      classId,
    ]);

    res.status(201).json({
      message: '班级创建成功',
      class: newClass.rows[0],
    });
  } catch (err) {
    console.error('创建班级错误:', err);
    res.status(500).json({ error: '创建班级失败' });
  }
});

// 获取教师的所有班级
router.get('/teacher', authMiddleware, async (req, res) => {
  const teacherId = req.user.id;

  try {
    const classes = await db.query(
      `SELECT c.*, COUNT(cs.student_id) as student_count 
       FROM classes c 
       LEFT JOIN class_students cs ON c.id = cs.class_id 
       WHERE c.teacher_id = $1 
       GROUP BY c.id 
       ORDER BY c.created_at DESC`,
      [teacherId]
    );

    res.json({ classes: classes.rows });
  } catch (err) {
    console.error('获取班级列表错误:', err);
    res.status(500).json({ error: '获取班级列表失败' });
  }
});

// 获取班级详情
router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const classResult = await db.query(
      `SELECT c.*, u.name as teacher_name 
       FROM classes c 
       JOIN users u ON c.teacher_id = u.id 
       WHERE c.id = $1`,
      [id]
    );

    if (classResult.rows.length === 0) {
      return res.status(404).json({ error: '班级不存在' });
    }

    // 获取班级学生列表
    const students = await db.query(
      `SELECT u.id, u.name, u.email, s.student_id, cs.joined_at 
       FROM class_students cs 
       JOIN users u ON cs.student_id = u.id 
       LEFT JOIN students s ON u.id = s.user_id 
       WHERE cs.class_id = $1 
       ORDER BY cs.joined_at DESC`,
      [id]
    );

    res.json({
      class: classResult.rows[0],
      students: students.rows,
    });
  } catch (err) {
    console.error('获取班级详情错误:', err);
    res.status(500).json({ error: '获取班级详情失败' });
  }
});

// 更新班级信息
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const teacherId = req.user.id;

  try {
    // 检查权限
    const classResult = await db.query(
      'SELECT * FROM classes WHERE id = $1 AND teacher_id = $2',
      [id, teacherId]
    );

    if (classResult.rows.length === 0) {
      return res.status(403).json({ error: '无权修改此班级' });
    }

    await db.query(
      'UPDATE classes SET name = $1, description = $2 WHERE id = $3',
      [name, description, id]
    );

    res.json({ message: '班级信息更新成功' });
  } catch (err) {
    console.error('更新班级错误:', err);
    res.status(500).json({ error: '更新班级失败' });
  }
});

// 删除班级
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const teacherId = req.user.id;

  try {
    // 检查权限
    const classResult = await db.query(
      'SELECT * FROM classes WHERE id = $1 AND teacher_id = $2',
      [id, teacherId]
    );

    if (classResult.rows.length === 0) {
      return res.status(403).json({ error: '无权删除此班级' });
    }

    await db.query('DELETE FROM classes WHERE id = $1', [id]);

    res.json({ message: '班级删除成功' });
  } catch (err) {
    console.error('删除班级错误:', err);
    res.status(500).json({ error: '删除班级失败' });
  }
});

// 添加学生到班级
router.post('/:id/students', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { studentEmail } = req.body;
  const teacherId = req.user.id;

  try {
    // 检查权限
    const classResult = await db.query(
      'SELECT * FROM classes WHERE id = $1 AND teacher_id = $2',
      [id, teacherId]
    );

    if (classResult.rows.length === 0) {
      return res.status(403).json({ error: '无权操作此班级' });
    }

    // 查找学生
    const studentResult = await db.query(
      'SELECT * FROM users WHERE email = $1 AND role = $2',
      [studentEmail, 'student']
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: '学生不存在' });
    }

    const studentId = studentResult.rows[0].id;

    // 检查是否已在班级中
    const existingResult = await db.query(
      'SELECT * FROM class_students WHERE class_id = $1 AND student_id = $2',
      [id, studentId]
    );

    if (existingResult.rows.length > 0) {
      return res.status(409).json({ error: '学生已在班级中' });
    }

    // 添加到班级
    await db.query(
      'INSERT INTO class_students (class_id, student_id) VALUES ($1, $2)',
      [id, studentId]
    );

    // 更新学生的班级ID
    await db.query('UPDATE students SET class_id = $1 WHERE user_id = $2', [
      id,
      studentId,
    ]);

    res.json({ message: '学生添加成功' });
  } catch (err) {
    console.error('添加学生错误:', err);
    res.status(500).json({ error: '添加学生失败' });
  }
});

// 从班级移除学生
router.delete('/:id/students/:studentId', authMiddleware, async (req, res) => {
  const { id, studentId } = req.params;
  const teacherId = req.user.id;

  try {
    // 检查权限
    const classResult = await db.query(
      'SELECT * FROM classes WHERE id = $1 AND teacher_id = $2',
      [id, teacherId]
    );

    if (classResult.rows.length === 0) {
      return res.status(403).json({ error: '无权操作此班级' });
    }

    await db.query(
      'DELETE FROM class_students WHERE class_id = $1 AND student_id = $2',
      [id, studentId]
    );

    // 清除学生的班级ID
    await db.query(
      'UPDATE students SET class_id = NULL WHERE user_id = $1 AND class_id = $2',
      [studentId, id]
    );

    res.json({ message: '学生移除成功' });
  } catch (err) {
    console.error('移除学生错误:', err);
    res.status(500).json({ error: '移除学生失败' });
  }
});

// 学生获取自己所在的班级
router.get('/student/my-class', authMiddleware, async (req, res) => {
  const studentId = req.user.id;

  try {
    const result = await db.query(
      `SELECT c.*, u.name as teacher_name 
       FROM class_students cs 
       JOIN classes c ON cs.class_id = c.id 
       JOIN users u ON c.teacher_id = u.id 
       WHERE cs.student_id = $1`,
      [studentId]
    );

    res.json({ classes: result.rows });
  } catch (err) {
    console.error('获取班级错误:', err);
    res.status(500).json({ error: '获取班级失败' });
  }
});

module.exports = router;
