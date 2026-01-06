const mongoose = require('mongoose');

// 健康记录模型（可根据你的需求扩展字段）
const healthRecordSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // 微信用户唯一标识
  type: { type: String, required: true }, // 记录类型：如血压、血糖、心率
  value: { type: Number, required: true }, // 记录数值
  unit: { type: String, default: '' }, // 单位：如 mmHg、mmol/L
  createTime: { type: Date, default: Date.now } // 创建时间
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);

