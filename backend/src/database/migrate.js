const db = require('./db');

const createTables = async () => {
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('teacher', 'student')),
        name VARCHAR(50) NOT NULL,
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        department VARCHAR(100),
        title VARCHAR(50),
        is_verified BOOLEAN DEFAULT FALSE,
        id_card VARCHAR(50)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        student_id VARCHAR(50) UNIQUE,
        class_name VARCHAR(100),
        grade VARCHAR(20),
        physics_level VARCHAR(20) DEFAULT 'beginner'
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        source VARCHAR(20) DEFAULT 'local' CHECK (source IN ('local', 'cloud')),
        title TEXT NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('选择题', '填空题', '计算题', '简答题')),
        difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('简单', '中等', '困难')),
        chapter VARCHAR(50) NOT NULL,
        content JSONB NOT NULL,
        answer JSONB NOT NULL,
        analysis TEXT,
        created_by UUID REFERENCES users(id),
        used_count INT DEFAULT 0,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS assignments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(200) NOT NULL,
        teacher_id UUID REFERENCES users(id),
        class_name VARCHAR(100) NOT NULL,
        deadline TIMESTAMP NOT NULL,
        grading_type VARCHAR(20) DEFAULT 'AI' CHECK (grading_type IN ('AI', '人工+AI')),
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'finished', 'graded')),
        question_ids JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
        student_id UUID REFERENCES users(id),
        answers JSONB NOT NULL,
        score DECIMAL(5,2),
        ai_feedback JSONB,
        status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded')),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        graded_at TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS error_questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID REFERENCES users(id),
        question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
        error_type VARCHAR(50),
        error_count INT DEFAULT 1,
        last_reviewed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS learning_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID REFERENCES users(id),
        action_type VARCHAR(50),
        duration_minutes INT,
        knowledge_points JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        criteria JSONB
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS student_achievements (
        student_id UUID REFERENCES users(id),
        achievement_id UUID REFERENCES achievements(id),
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (student_id, achievement_id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50),
        title VARCHAR(200),
        content TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_questions_chapter ON questions(chapter);
      CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
      CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);
      CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);
      CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions(assignment_id);
      CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(student_id);
      CREATE INDEX IF NOT EXISTS idx_error_questions_student ON error_questions(student_id);
      CREATE INDEX IF NOT EXISTS idx_learning_records_student ON learning_records(student_id);
    `);

    await client.query(`
      INSERT INTO achievements (name, description, icon, criteria)
      VALUES
        ('力学先锋', '在力学章节测验中获得满分', 'trophy', '{"chapter": "力学", "score": 100}'),
        ('公式达人', '掌握10个以上物理公式', 'calculator', '{"formula_count": 10}'),
        ('逻辑大师', '连续一周完成每日练习', 'brain', '{"streak_days": 7}'),
        ('光学探索者', '完成光学章节所有练习', 'lightbulb', '{"chapter": "光学"}'),
        ('热学入门', '完成热学基础练习', 'flame', '{"chapter": "热学"}')
      ON CONFLICT DO NOTHING
    `);

    await client.query('COMMIT');
    console.log('数据库迁移完成！');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('数据库迁移失败:', err);
    throw err;
  } finally {
    client.release();
  }
};

if (require.main === module) {
  createTables()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { createTables };