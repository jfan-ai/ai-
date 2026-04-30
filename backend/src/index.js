const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 加载 backend 目录下的 .env 文件
dotenv.config({ path: path.join(__dirname, '../.env') });

const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const assignmentRoutes = require('./routes/assignments');
const analyticsRoutes = require('./routes/analytics');
const errorQuestionRoutes = require('./routes/error-questions');
const growthRoutes = require('./routes/growth');
const profileRoutes = require('./routes/profile');
const classRoutes = require('./routes/classes');
const aiRoutes = require('./routes/ai');
const configRoutes = require('./routes/config');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/error-questions', errorQuestionRoutes);
app.use('/api/growth', growthRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/config', configRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '阅小师后端服务运行中' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误', message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`阅小师后端服务运行在端口 ${PORT}`);
});
