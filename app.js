require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');

const app = express();
// 1. 扩大请求体限制 + 跨域配置
app.use(express.json({ limit: '20mb' }));
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// 2. 优化 MongoDB 连接（复用连接，避免每次请求重建）
let isConnected = false; // 标记是否已连接
const connectToDB = async () => {
  if (isConnected) {
    console.log('复用已有 MongoDB 连接');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // 新增：禁用过时的选项，适配 MongoDB 8.x
      serverSelectionTimeoutMS: 5000, // 缩短连接超时时间（5秒）
    });
    isConnected = true;
    console.log('MongoDB Atlas 连接成功 ✅');
  } catch (err) {
    console.error('MongoDB 连接失败 ❌:', err.message);
    throw err; // 抛出错误，让 Vercel 函数返回明确提示
  }
};

// 3. 中间件：每次请求前确保数据库已连接
app.use(async (req, res, next) => {
  try {
    await connectToDB();
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '数据库连接失败：' + err.message
    });
  }
});

// 4. 挂载路由
app.use('/api/health', healthRoutes);

// 5. 根路由测试（用于验证服务是否启动）
app.get('/', (req, res) => {
  res.send('HEALTH API 运行中（Vercel 优化版）');
});

// 6. Vercel Serverless 适配：导出 app 而非监听端口
const PORT = process.env.PORT || 3000;
// 本地运行时监听端口，Vercel 运行时导出 app
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`本地服务运行在 http://localhost:${PORT}`);
  });
}

module.exports = app; // 关键：Vercel 需要导出 express app