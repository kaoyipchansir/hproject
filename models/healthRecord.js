const mongoose = require('mongoose');

// 健康记录 Schema（必须包含 imageUrl 字段）
const healthRecordSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true // 用户ID（如小程序openid）
  },
  type: {
    type: String,
    required: true,
    enum: ['血压', '血糖', '心率'] // 限制记录类型
  },
  value: {
    type: Number,
    required: true // 记录数值
  },
  unit: {
    type: String,
    required: true // 单位（mmHg/mmol/L/次/分）
  },
  imageUrl: {
    type: String,
    default: '' // 图片链接，默认空字符串
  },
  createTime: {
    type: Date,
    default: Date.now // 自动生成创建时间
  }
});

// 导出模型
module.exports = mongoose.model('HealthRecord', healthRecordSchema);

