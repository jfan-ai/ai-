/**
 * 数据库迁移脚本 - SQLite 版本
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 确保数据目录存在
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'yuexiaoshi.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接失败:', err);
    process.exit(1);
  }
  console.log('✅ 连接到 SQLite 数据库');
});

// 启用外键约束
db.run('PRAGMA foreign_keys = ON');

const runQuery = (sql) => {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const createTables = async () => {
  try {
    // 用户表
    await runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
        name TEXT NOT NULL,
        avatar TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 教师扩展表
    await runQuery(`
      CREATE TABLE IF NOT EXISTS teachers (
        user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        department TEXT,
        title TEXT,
        is_verified INTEGER DEFAULT 0,
        id_card TEXT
      )
    `);

    // 班级表
    await runQuery(`
      CREATE TABLE IF NOT EXISTS classes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        teacher_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        description TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 班级学生关联表
    await runQuery(`
      CREATE TABLE IF NOT EXISTS class_students (
        class_id TEXT REFERENCES classes(id) ON DELETE CASCADE,
        student_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (class_id, student_id)
      )
    `);

    // 学生扩展表
    await runQuery(`
      CREATE TABLE IF NOT EXISTS students (
        user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        student_id TEXT UNIQUE,
        class_id TEXT REFERENCES classes(id),
        grade TEXT,
        physics_level TEXT DEFAULT 'beginner'
      )
    `);

    // 题目表
    await runQuery(`
      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        source TEXT DEFAULT 'local' CHECK (source IN ('local', 'cloud')),
        title TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('选择题', '填空题', '计算题', '简答题')),
        difficulty TEXT NOT NULL CHECK (difficulty IN ('简单', '中等', '困难')),
        chapter TEXT NOT NULL,
        content TEXT NOT NULL,
        answer TEXT NOT NULL,
        analysis TEXT,
        created_by TEXT REFERENCES users(id),
        used_count INTEGER DEFAULT 0,
        is_verified INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 作业表
    await runQuery(`
      CREATE TABLE IF NOT EXISTS assignments (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        teacher_id TEXT REFERENCES users(id),
        class_name TEXT NOT NULL,
        deadline TEXT NOT NULL,
        grading_type TEXT DEFAULT 'AI' CHECK (grading_type IN ('AI', '人工', 'AI+人工')),
        status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'finished', 'graded')),
        question_ids TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 作业提交表
    await runQuery(`
      CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        assignment_id TEXT REFERENCES assignments(id) ON DELETE CASCADE,
        student_id TEXT REFERENCES users(id),
        answers TEXT NOT NULL,
        score REAL,
        ai_feedback TEXT,
        status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded')),
        submitted_at TEXT DEFAULT CURRENT_TIMESTAMP,
        graded_at TEXT
      )
    `);

    // 错题表
    await runQuery(`
      CREATE TABLE IF NOT EXISTS error_questions (
        id TEXT PRIMARY KEY,
        student_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
        error_type TEXT,
        error_count INTEGER DEFAULT 1,
        last_reviewed_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, question_id)
      )
    `);

    // 学习记录表
    await runQuery(`
      CREATE TABLE IF NOT EXISTS learning_records (
        id TEXT PRIMARY KEY,
        student_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        action_type TEXT,
        duration_minutes INTEGER,
        knowledge_points TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 成就表
    await runQuery(`
      CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        criteria TEXT
      )
    `);

    // 学生成就关联表
    await runQuery(`
      CREATE TABLE IF NOT EXISTS student_achievements (
        student_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        achievement_id TEXT REFERENCES achievements(id) ON DELETE CASCADE,
        earned_at TEXT DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (student_id, achievement_id)
      )
    `);

    // 通知表
    await runQuery(`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        content TEXT,
        type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
        is_read INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 系统配置表 - 存储所有动态配置信息
    await runQuery(`
      CREATE TABLE IF NOT EXISTS system_configs (
        id TEXT PRIMARY KEY,
        config_key TEXT UNIQUE NOT NULL,
        config_value TEXT NOT NULL,
        config_type TEXT DEFAULT 'string' CHECK (config_type IN ('string', 'number', 'boolean', 'json')),
        description TEXT,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 插入默认系统配置数据
    await runQuery(`
      INSERT OR IGNORE INTO system_configs (id, config_key, config_value, config_type, description) VALUES
      -- 系统基本信息
      ('sys_name', 'system.name', '阅小师', 'string', '系统名称'),
      ('sys_subtitle', 'system.subtitle', '大学物理智能AI批改系统 · 精准高效答疑解惑', 'string', '系统副标题'),
      ('sys_logo', 'system.logo', '🦖', 'string', '系统Logo'),
      ('sys_version', 'system.version', 'v1.0', 'string', '系统版本'),
      ('sys_copyright', 'system.copyright', '© 2026 Physics AI Grading System · 阅小师', 'string', '版权信息'),
      
      -- 教师端配置
      ('teacher_title', 'teacher.title', 'Teacher Pro', 'string', '教师端副标题'),
      ('teacher_dept', 'teacher.default_department', '物理学院', 'string', '教师默认部门'),
      ('teacher_subject', 'teacher.default_subject', '大学物理', 'string', '教师默认教授科目'),
      
      -- 学生端配置
      ('student_title', 'student.title', 'Student Pro', 'string', '学生端副标题'),
      ('student_major', 'student.default_major', '应用物理学', 'string', '学生默认专业'),
      
      -- 菜单配置
      ('teacher_menu', 'teacher.menu', '[{"id":"homepage","label":"系统首页"},{"id":"classes","label":"班级管理"},{"id":"question-bank","label":"大学物理专题题库"},{"id":"assignment","label":"物理作业布置管理"},{"id":"analysis","label":"班级学习情况分析"},{"id":"profile","label":"个人中心"},{"id":"settings","label":"系统设置"}]', 'json', '教师端菜单'),
      ('student_menu', 'student.menu', '[{"id":"home","label":"我的首页"},{"id":"homework","label":"待完成物理作业"},{"id":"errors","label":"物理错题本复盘"},{"id":"report","label":"个人学习成长报告"},{"id":"profile","label":"个人中心 & 设置"}]', 'json', '学生端菜单'),
      
      -- AI模块配置
      ('ai_modules', 'ai.modules', '[{"type":"generation","title":"智能组卷","description":"基于章节、难度、题型自动生成"},{"type":"correction","title":"专业批改","description":"OCR扫描与分步逻辑校验"},{"type":"analysis","title":"学情分析","description":"班级薄弱知识点精准画像"}]', 'json', 'AI模块配置'),
      
      -- 功能模块配置
      ('feature_modules', 'feature.modules', '[{"id":"question-bank","title":"物理题库智能组卷模块","subtitle":"校本物理题库"},{"id":"assignment","title":"日常物理作业模块","subtitle":"OCR扫描批改"}]', 'json', '功能模块配置')
    `);

    // 插入默认成就数据（使用 INSERT OR IGNORE 避免重复）

    await runQuery(`
      INSERT OR IGNORE INTO achievements (id, name, description, icon, criteria) VALUES
      ('1', '力学先锋', '完成力学章节的第一道题目', 'BookOpen', '{"chapter": "力学"}'),
      ('2', '公式达人', '完成10道题目', 'Calculator', '{"count": 10}'),
      ('3', '光学探索者', '完成光学章节的第一道题目', 'Lightbulb', '{"chapter": "光学"}'),
      ('4', '热学入门', '完成热学章节的第一道题目', 'Flame', '{"chapter": "热学"}'),
      ('5', '电磁学大师', '完成电磁学章节的第一道题目', 'Zap', '{"chapter": "电磁学"}'),
      ('6', '满分王者', '获得一次满分', 'Trophy', '{"score": 100}')
    `);

    console.log('✅ 数据库表创建成功！');
  } catch (err) {
    console.error('❌ 数据库迁移失败:', err);
    throw err;
  }
};

// 执行迁移
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('🎉 数据库初始化完成！');
      db.close();
      process.exit(0);
    })
    .catch((err) => {
      console.error('💥 数据库初始化失败:', err);
      db.close();
      process.exit(1);
    });
}

module.exports = { createTables, db };
