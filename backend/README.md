# 阅小师 - 大学物理AI智能批改系统

## 后端 API 文档

### 项目结构

```
backend/
├── src/
│   ├── index.js              # 应用入口
│   ├── database/
│   │   ├── db.js             # 数据库连接池
│   │   └── migrate.js        # 数据库迁移脚本
│   ├── middleware/
│   │   └── auth.js           # JWT认证中间件
│   ├── routes/
│   │   ├── auth.js           # 认证模块
│   │   ├── questions.js      # 题库模块
│   │   ├── assignments.js    # 作业模块
│   │   ├── analytics.js      # 学情分析模块
│   │   ├── error-questions.js # 错题本模块
│   │   ├── growth.js         # 成长报告模块
│   │   └── profile.js        # 个人中心模块
│   └── services/
│       └── aiService.js      # AI服务
├── .env                      # 环境配置
└── package.json
```

### 快速开始

#### 1. 安装依赖

```bash
cd backend
npm install
```

#### 2. 配置环境变量

编辑 `.env` 文件：

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=yuexiaoshi
DB_USER=postgres
DB_PASSWORD=your_password

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your_super_secret_jwt_key_yuexiaoshi_2024
JWT_EXPIRES_IN=7d

AI_API_KEY=your_openai_api_key
AI_API_URL=https://api.openai.com/v1
```

#### 3. 创建数据库

在 PostgreSQL 中创建数据库：

```sql
CREATE DATABASE yuexiaoshi;
```

#### 4. 运行数据库迁移

```bash
npm run migrate
```

#### 5. 启动服务器

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

---

### API 接口文档

#### 认证模块 `/api/auth`

| 接口 | 方法 | 描述 | 认证 |
|------|------|------|------|
| `/api/auth/register` | POST | 用户注册 | 否 |
| `/api/auth/login` | POST | 用户登录 | 否 |
| `/api/auth/logout` | POST | 退出登录 | 是 |
| `/api/auth/refresh-token` | POST | 刷新Token | 是 |

**注册请求**：
```json
{
  "email": "teacher@example.com",
  "password": "password123",
  "name": "王建国",
  "role": "teacher"
}
```

**登录请求**：
```json
{
  "email": "teacher@example.com",
  "password": "password123"
}
```

---

#### 题库模块 `/api/questions`

| 接口 | 方法 | 描述 | 认证 | 角色 |
|------|------|------|------|------|
| `/api/questions` | GET | 获取题库列表 | 是 | 全部 |
| `/api/questions/local` | GET | 获取校本题库 | 是 | 全部 |
| `/api/questions/cloud` | GET | 获取云端题库 | 是 | 全部 |
| `/api/questions/:id` | GET | 获取题目详情 | 是 | 全部 |
| `/api/questions` | POST | 创建题目 | 是 | 教师 |
| `/api/questions/:id` | PUT | 更新题目 | 是 | 教师 |
| `/api/questions/:id` | DELETE | 删除题目 | 是 | 教师 |
| `/api/questions/generate` | POST | AI生成题目 | 是 | 教师 |

**AI生成题目请求**：
```json
{
  "chapter": "力学",
  "difficulty": "中等",
  "count": 5,
  "type": "计算题"
}
```

---

#### 作业模块 `/api/assignments`

| 接口 | 方法 | 描述 | 认证 | 角色 |
|------|------|------|------|------|
| `/api/assignments` | GET | 获取作业列表 | 是 | 全部 |
| `/api/assignments/:id` | GET | 获取作业详情 | 是 | 全部 |
| `/api/assignments` | POST | 创建作业 | 是 | 教师 |
| `/api/assignments/:id` | PUT | 更新作业 | 是 | 教师 |
| `/api/assignments/:id` | DELETE | 删除作业 | 是 | 教师 |
| `/api/assignments/:id/submit` | POST | 提交作业 | 是 | 学生 |
| `/api/assignments/:id/grade` | POST | AI批改作业 | 是 | 教师 |

---

#### 学情分析模块 `/api/analytics`

| 接口 | 方法 | 描述 | 认证 | 角色 |
|------|------|------|------|------|
| `/api/analytics/class/:classId` | GET | 获取班级分析 | 是 | 教师 |
| `/api/analytics/knowledge-mastery` | GET | 获取知识点掌握度 | 是 | 全部 |
| `/api/analytics/ai-insight` | GET | AI教学洞察 | 是 | 教师 |
| `/api/analytics/class-activity` | GET | 班级活跃度 | 是 | 教师 |

---

#### 错题本模块 `/api/error-questions`

| 接口 | 方法 | 描述 | 认证 | 角色 |
|------|------|------|------|------|
| `/api/error-questions` | GET | 获取错题列表 | 是 | 学生 |
| `/api/error-questions/:id` | GET | 获取错题详情 | 是 | 学生 |
| `/api/error-questions/:id/practice` | POST | AI推荐复练 | 是 | 学生 |
| `/api/error-questions/:id` | DELETE | 删除错题 | 是 | 学生 |

---

#### 成长报告模块 `/api/growth`

| 接口 | 方法 | 描述 | 认证 | 角色 |
|------|------|------|------|------|
| `/api/growth/report/:studentId` | GET | 获取成长报告 | 是 | 全部 |
| `/api/growth/weekly-stats` | GET | 每周学习统计 | 是 | 学生 |
| `/api/growth/achievements` | GET | 获取荣誉成就 | 是 | 学生 |
| `/api/growth/check-achievements` | POST | 检查新成就 | 是 | 学生 |

---

#### 个人中心模块 `/api/profile`

| 接口 | 方法 | 描述 | 认证 |
|------|------|------|------|
| `/api/profile` | GET | 获取个人信息 | 是 |
| `/api/profile` | PUT | 更新个人信息 | 是 |
| `/api/profile/password` | PUT | 修改密码 | 是 |
| `/api/profile/notifications` | GET | 获取通知列表 | 是 |
| `/api/profile/notifications` | PUT | 标记通知已读 | 是 |
| `/api/profile/notifications/:id` | DELETE | 删除通知 | 是 |

---

### 数据库表结构

- `users` - 用户表
- `teachers` - 教师扩展表
- `students` - 学生扩展表
- `questions` - 题目表
- `assignments` - 作业表
- `submissions` - 作业提交表
- `error_questions` - 错题表
- `learning_records` - 学习记录表
- `achievements` - 成就表
- `student_achievements` - 学生成就表
- `notifications` - 通知表

详细表结构请参考 `src/database/migrate.js`

---

### AI 能力

系统集成了以下 AI 能力：

1. **AI题目生成** - 根据章节、难度、题型自动生成练习题
2. **AI作业批改** - 自动批改学生作业并给出反馈
3. **AI学情分析** - 分析班级学习情况并给出教学建议
4. **AI错题复练** - 根据错题推荐针对性练习
5. **AI成长洞察** - 分析学生学习进步并给出个性化建议

---

### 技术栈

- **运行时**: Node.js
- **框架**: Express.js
- **数据库**: PostgreSQL
- **缓存**: Redis
- **认证**: JWT
- **AI**: OpenAI API

---

### 注意事项

1. 首次使用需先创建 PostgreSQL 数据库
2. 运行 `npm run migrate` 创建数据表
3. 配置有效的 OpenAI API Key 以启用 AI 功能
4. 生产环境请修改 `JWT_SECRET` 和数据库密码
