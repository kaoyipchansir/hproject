require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件：支持大体积 Base64 图片（Cloudinary 支持最大 100MB）
app.use(express.json({ limit: '20mb' })); 
// 跨域配置（适配小程序）
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// 连接 MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas 连接成功 ✅'))
  .catch(err => console.error('MongoDB 连接失败 ❌:', err));

// 挂载路由
app.use('/api/health', healthRoutes);

// 根路由测试
app.get('/', (req, res) => {
  res.send('HEALTH API 运行中（已集成 Cloudinary 图片上传）');
});

// 启动服务
app.listen(PORT, () => {
  console.log(`服务运行在 http://localhost:${PORT}`);
});