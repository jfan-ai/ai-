# 阅小师 - 前端API接口文档

> **说明**：本文档供Java后端同学参考，前端所有接口调用都基于以下规范。
> 
> **基础URL**：`http://localhost:8080/api`
> 
> **认证方式**：JWT Token，在请求头中携带 `Authorization: Bearer {token}`

---

## 一、认证模块 `/auth`

### 1.1 用户登录
```
POST /auth/login
```

**请求体**：
```json
{
  "email": "teacher@example.com",
  "password": "123456"
}
```

**响应**：
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "teacher@example.com",
    "name": "张老师",
    "role": "teacher"
  }
}
```

### 1.2 用户注册
```
POST /auth/register
```

**请求体**：
```json
{
  "email": "student@example.com",
  "password": "123456",
  "name": "李同学",
  "role": "student"
}
```

### 1.3 退出登录
```
POST /auth/logout
```

**请求头**：`Authorization: Bearer {token}`

### 1.4 刷新Token
```
POST /auth/refresh
```

**响应**：
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 1.5 获取当前用户信息
```
GET /auth/profile
```

**响应**：
```json
{
  "user": {
    "id": "uuid",
    "email": "teacher@example.com",
    "name": "张老师",
    "role": "teacher",
    "avatar": "https://..."
  }
}
```

---

## 二、题库模块 `/questions`

### 2.1 获取题库列表
```
GET /questions?page=1&limit=10&chapter=力学&difficulty=中等
```

**查询参数**：
- `page` - 页码（默认1）
- `limit` - 每页数量（默认10）
- `chapter` - 章节筛选（可选）
- `difficulty` - 难度筛选（可选）
- `type` - 题型筛选（可选）
- `search` - 搜索关键词（可选）

**响应**：
```json
{
  "questions": [
    {
      "id": "uuid",
      "title": "牛顿运动定律应用",
      "type": "计算题",
      "difficulty": "中等",
      "chapter": "力学",
      "content": { "text": "题目内容...", "images": [] },
      "answer": { "result": "答案", "steps": [] },
      "analysis": "解析...",
      "source": "local",
      "usedCount": 10,
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 2.2 获取校本题库
```
GET /questions/local
```

### 2.3 获取云端题库
```
GET /questions/cloud
```

### 2.4 获取题目详情
```
GET /questions/{id}
```

### 2.5 创建题目
```
POST /questions
```

**请求体**：
```json
{
  "title": "题目标题",
  "content": "题目内容",
  "type": "计算题",
  "chapter": "力学",
  "difficulty": "中等",
  "answer": "标准答案",
  "analysis": "题目解析"
}
```

### 2.6 更新题目
```
PUT /questions/{id}
```

### 2.7 删除题目
```
DELETE /questions/{id}
```

### 2.8 AI生成题目
```
POST /questions/generate
```

**请求体**：
```json
{
  "chapter": "力学",
  "difficulty": "中等",
  "count": 5,
  "type": "计算题"
}
```

**响应**：
```json
{
  "questions": [
    {
      "id": "uuid",
      "title": "AI生成的题目...",
      "type": "计算题",
      "difficulty": "中等",
      "chapter": "力学",
      "content": { "text": "..." },
      "answer": { "result": "..." }
    }
  ]
}
```

---

## 三、作业模块 `/assignments`

### 3.1 获取作业列表
```
GET /assignments?status=active&page=1&limit=10
```

**查询参数**：
- `status` - 状态筛选：draft(草稿)、active(进行中)、finished(已结束)
- `classId` - 班级ID筛选
- `page` - 页码
- `limit` - 每页数量

**响应**：
```json
{
  "assignments": [
    {
      "id": "uuid",
      "title": "第三章作业",
      "className": "2024级物理1班",
      "status": "active",
      "deadline": "2024-01-15T23:59:59Z",
      "gradingType": "AI",
      "submissionsCount": 30,
      "totalStudents": 45,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### 3.2 获取作业详情
```
GET /assignments/{id}
```

### 3.3 创建作业
```
POST /assignments
```

**请求体**：
```json
{
  "title": "作业标题",
  "classId": "班级ID",
  "deadline": "2024-01-15T23:59:59Z",
  "gradingType": "AI",
  "questionIds": ["q1", "q2", "q3"],
  "status": "active"
}
```

### 3.4 更新作业
```
PUT /assignments/{id}
```

### 3.5 删除作业
```
DELETE /assignments/{id}
```

### 3.6 保存作业草稿
```
POST /assignments/draft
```

### 3.7 提交作业（学生）
```
POST /assignments/{id}/submit
```

**请求体**：
```json
{
  "answers": {
    "questionId1": "学生答案1",
    "questionId2": "学生答案2"
  }
}
```

### 3.8 AI批改作业
```
POST /assignments/{id}/grade
```

**请求体**：
```json
{
  "submissionId": "提交记录ID"
}
```

**响应**：
```json
{
  "submission": { ... },
  "feedback": {
    "score": 85,
    "comments": "总体评价...",
    "details": [
      {
        "questionId": "q1",
        "score": 10,
        "comment": "正确"
      }
    ]
  }
}
```

### 3.9 获取作业提交列表
```
GET /assignments/{id}/submissions
```

### 3.10 获取作业统计
```
GET /assignments/stats/overview
```

**响应**：
```json
{
  "activeAssignments": 5,
  "pendingGrading": 12,
  "totalStudents": 150
}
```

### 3.11 获取学生作业列表
```
GET /assignments/student/my-assignments
```

### 3.12 获取学生提交记录
```
GET /assignments/student/my-submissions
```

### 3.13 获取待批改作业列表（教师阅卷）
```
GET /assignments/{id}/pending-grading
```

**响应**：
```json
{
  "students": [
    {
      "id": "student-uuid",
      "name": "李同学",
      "status": "待批改",
      "aiScore": 85,
      "submitTime": "2024-01-15T14:30:00Z"
    }
  ]
}
```

### 3.14 获取学生作业详情（阅卷用）
```
GET /assignments/{id}/submissions/{studentId}
```

**响应**：
```json
{
  "submission": { ... },
  "aiAnalysis": {
    "score": 85,
    "feedback": "总体评价...",
    "correctPoints": ["正确点1", "正确点2"],
    "errorPoints": ["错误点1", "错误点2"]
  }
}
```

### 3.15 教师批改作业
```
POST /assignments/{id}/submissions/{studentId}/grade
```

**请求体**：
```json
{
  "score": 88,
  "feedback": "AI分析反馈",
  "teacherComments": "教师评语"
}
```

### 3.16 打回作业重做
```
POST /assignments/{id}/submissions/{studentId}/reject
```

**请求体**：
```json
{
  "reason": "计算过程不完整，请补充详细步骤"
}
```

---

## 四、班级模块 `/classes`

### 4.1 获取班级列表
```
GET /classes/teacher
```

**响应**：
```json
{
  "classes": [
    {
      "id": "uuid",
      "name": "2024级物理1班",
      "teacherId": "teacher-uuid",
      "description": "班级描述",
      "createdAt": "2024-01-01T00:00:00Z",
      "studentCount": 45
    }
  ]
}
```

### 4.2 获取班级详情
```
GET /classes/{id}
```

**响应**：
```json
{
  "class": {
    "id": "uuid",
    "name": "2024级物理1班",
    "teacherName": "张老师",
    ...
  },
  "students": [
    {
      "id": "uuid",
      "name": "李同学",
      "email": "student@example.com",
      "studentId": "2024001",
      "joinedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 4.3 创建班级
```
POST /classes
```

**请求体**：
```json
{
  "name": "2024级物理1班",
  "description": "班级描述（可选）"
}
```

### 4.4 更新班级
```
PUT /classes/{id}
```

### 4.5 删除班级
```
DELETE /classes/{id}
```

### 4.6 添加学生到班级
```
POST /classes/{id}/students
```

**请求体**：
```json
{
  "studentEmail": "student@example.com"
}
```

### 4.7 从班级移除学生
```
DELETE /classes/{id}/students/{studentId}
```

### 4.8 获取学生所在班级
```
GET /classes/student/my-class
```

---

## 五、学情分析模块 `/analytics`

### 5.1 获取班级学习分析
```
GET /analytics/class/{classId}
```

**响应**：
```json
{
  "overview": {
    "totalStudents": 45,
    "averageScore": 78.5,
    "completionRate": 0.85
  },
  "chapterStats": [
    {
      "chapter": "力学",
      "averageScore": 80,
      "masteryRate": 0.75
    }
  ]
}
```

### 5.2 获取知识点掌握度
```
GET /analytics/knowledge-mastery?classId=xxx 或 studentId=xxx
```

**响应**：
```json
{
  "mastery": [
    {
      "chapter": "力学",
      "mastery": 75,
      "attempts": 20,
      "status": "success"
    }
  ]
}
```

### 5.3 获取AI教学洞察
```
GET /analytics/ai-insight?classId=xxx
```

**响应**：
```json
{
  "insights": [
    {
      "type": "warning",
      "title": "力学章节薄弱",
      "content": "班级在牛顿定律部分掌握度较低，建议加强练习"
    }
  ]
}
```

### 5.4 获取班级活跃度
```
GET /analytics/class-activity?classId=xxx&days=7
```

**响应**：
```json
{
  "activities": [
    { "day": "周一", "count": 45 },
    { "day": "周二", "count": 38 }
  ]
}
```

### 5.5 获取学生个人分析
```
GET /analytics/student/{studentId}
```

### 5.6 获取错题分布
```
GET /analytics/error-distribution?classId=xxx 或 studentId=xxx
```

### 5.7 获取学生薄弱知识点（复习模式）
```
GET /analytics/student/{studentId}/weak-points
```

**响应**：
```json
{
  "topics": [
    {
      "id": "topic-uuid",
      "title": "牛顿运动定律",
      "errorCount": 5,
      "mastery": 65
    }
  ],
  "aiDiagnosis": {
    "summary": "你在力学部分表现良好，但在电磁学中的法拉第定律应用上存在概念混淆。",
    "strengths": ["受力分析准确", "公式记忆牢固"],
    "weaknesses": ["电磁感应方向判断", "能量守恒应用"]
  },
  "reviewTasks": [
    {
      "id": 1,
      "title": "知识点视频讲解",
      "duration": "15分钟",
      "description": "观看法拉第电磁感应定律的详细讲解视频"
    },
    {
      "id": 2,
      "title": "经典例题解析",
      "duration": "20分钟",
      "description": "学习3道典型例题的完整解题过程"
    },
    {
      "id": 3,
      "title": "针对性练习",
      "duration": "25分钟",
      "description": "完成5道AI推荐的针对性练习题"
    }
  ]
}
```

---

## 六、错题本模块 `/error-book`

### 6.1 获取错题列表
```
GET /error-book?chapter=力学&type=概念模糊&page=1&limit=10
```

**响应**：
```json
{
  "errors": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "questionId": "uuid",
      "question": { ... },
      "errorType": "概念模糊",
      "errorCount": 3,
      "lastReviewedAt": "2024-01-01T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### 6.2 获取错题详情
```
GET /error-book/{id}
```

### 6.3 AI推荐复练题目
```
POST /error-book/{id}/practice
```

**响应**：
```json
{
  "recommendations": [
    { ...Question }
  ],
  "analysis": {
    "weakPoint": "牛顿第二定律应用",
    "suggestion": "建议复习相关公式和例题"
  }
}
```

### 6.4 删除错题记录
```
DELETE /error-book/{id}
```

### 6.5 标记错题已复习
```
PUT /error-book/{id}/review
```

### 6.6 获取错题统计
```
GET /error-book/stats
```

**响应**：
```json
{
  "totalErrors": 50,
  "reviewedCount": 30,
  "byChapter": [
    { "chapter": "力学", "count": 20 }
  ],
  "byType": [
    { "type": "概念模糊", "count": 15 }
  ]
}
```

---

## 七、成长报告模块 `/growth`

### 7.1 获取成长报告
```
GET /growth/report/{studentId}
```

**响应**：
```json
{
  "report": {
    "studentId": "uuid",
    "overview": {
      "totalAssignments": 20,
      "averageScore": "85",
      "highestScore": "98",
      "lowestScore": "60",
      "totalErrors": 15
    },
    "recentSubmissions": [ ... ],
    "achievements": [ ... ]
  }
}
```

### 7.2 获取每周学习统计
```
GET /growth/weekly-stats?weeks=4
```

**响应**：
```json
{
  "stats": [
    {
      "week": "第1周",
      "minutes": 300,
      "activities": 5
    }
  ]
}
```

### 7.3 获取每日学习统计
```
GET /growth/daily-stats?days=30
```

### 7.4 获取所有成就
```
GET /growth/achievements
```

### 7.5 获取我的成就
```
GET /growth/my-achievements
```

### 7.6 获取学习进度
```
GET /growth/progress
```

**响应**：
```json
{
  "currentLevel": "Physics Master Lv.3",
  "nextLevel": "Physics Master Lv.4",
  "progress": 65,
  "totalStudyHours": 120,
  "completedAssignments": 45
}
```

---

## 八、系统配置 `/config`

### 8.1 获取系统配置
```
GET /config
```

**响应**：
```json
{
  "system": {
    "name": "阅小师",
    "subtitle": "大学物理智能AI批改系统",
    "logo": "🦖",
    "version": "v1.0"
  },
  "teacher": {
    "title": "Teacher Pro",
    "menu": [
      { "id": "homepage", "label": "系统首页", "icon": "LayoutDashboard" }
    ]
  },
  "student": {
    "title": "Student Pro",
    "menu": [ ... ]
  },
  "ai": {
    "modules": [ ... ]
  }
}
```

---

## 数据类型定义

### User（用户）
```typescript
{
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'student';
  avatar?: string;
  createdAt?: string;
}
```

### Question（题目）
```typescript
{
  id: string;
  title: string;
  type: '选择题' | '填空题' | '计算题' | '简答题';
  difficulty: '简单' | '中等' | '困难';
  chapter: '力学' | '热学' | '电磁学' | '光学' | '近代物理';
  content: {
    text: string;
    images?: string[];
  };
  answer: {
    result: string;
    steps?: string[];
  };
  analysis?: string;
  source: 'local' | 'cloud';
  usedCount: number;
  isVerified: boolean;
  createdBy?: string;
  createdAt?: string;
}
```

### Assignment（作业）
```typescript
{
  id: string;
  title: string;
  teacherId: string;
  className: string;
  deadline: string;
  gradingType: 'AI' | '人工' | 'AI+人工';
  status: 'draft' | 'active' | 'finished' | 'graded';
  questionIds: string[];
  questions?: Question[];
  submissionsCount?: number;
  createdAt?: string;
}
```

---

## 错误处理规范

所有接口统一返回格式：

**成功响应**：
```json
{
  "data": { ... },
  "message": "操作成功"
}
```

**错误响应**：
```json
{
  "error": "错误信息",
  "code": 400
}
```

**HTTP状态码**：
- 200 - 成功
- 400 - 请求参数错误
- 401 - 未授权（token无效或过期）
- 403 - 无权限
- 404 - 资源不存在
- 500 - 服务器内部错误
