const express = require('express');
const router = express.Router();
const HealthRecord = require('../models/healthRecord');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

// 1. 图片上传接口（原有，不变）
router.post('/upload-image', async (req, res) => {
  try {
    const { base64Image } = req.body;
    if (!base64Image) {
      return res.status(400).json({
        success: false,
        message: '请上传图片（Base64格式）'
      });
    }

    const imageUrl = await uploadToCloudinary(base64Image);
    res.status(200).json({
      success: true,
      message: '图片上传成功',
      data: { imageUrl }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 2. 新增健康记录（原有，不变）
router.post('/records', async (req, res) => {
  try {
    const record = new HealthRecord(req.body);
    await record.save();
    res.status(201).json({
      success: true,
      message: '记录添加成功',
      data: record
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: '添加失败：' + error.message
    });
  }
});

// 3. 获取单个用户的健康记录（原有，不变）
router.get('/records/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { type } = req.query;
    let query = { userId };
    if (type) query.type = type;

    const records = await HealthRecord.find(query).sort({ createTime: -1 });
    res.status(200).json({
      success: true,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取失败：' + error.message
    });
  }
});

// 4. 新增：获取所有用户的所有健康记录（核心新增）
router.get('/records', async (req, res) => {
  try {
    // 可选：支持按类型筛选（如 ?type=血压），不筛选则返回全部
    const { type } = req.query;
    let query = {}; // 空查询 = 匹配所有数据
    if (type) query.type = type;

    // 按创建时间倒序排列（最新的在前）
    const allRecords = await HealthRecord.find(query).sort({ createTime: -1 });
    
    res.status(200).json({
      success: true,
      message: '获取所有记录成功',
      total: allRecords.length, // 新增：返回总条数，方便前端分页
      data: allRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取所有记录失败：' + error.message
    });
  }
});

// 5. 删除记录（原有，不变）
router.delete('/records/:id', async (req, res) => {
  try {
    const record = await HealthRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: '记录不存在'
      });
    }
    res.status(200).json({
      success: true,
      message: '记录删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除失败：' + error.message
    });
  }
});
//6. 新增：分页获取所有用户的健康记录
router.get('/records/all', async (req, res) => {
  try {
    const { type, page = 1, pageSize = 10 } = req.query;
    let query = {};
    if (type) query.type = type;

    // 计算跳过的条数
    const skip = (page - 1) * pageSize;
    // 查询数据 + 统计总数
    const allRecords = await HealthRecord.find(query)
      .sort({ createTime: -1 })
      .skip(skip)
      .limit(Number(pageSize));
    const total = await HealthRecord.countDocuments(query);

    res.status(200).json({
      success: true,
      message: '获取分页记录成功',
      total, // 总条数
      page: Number(page), // 当前页
      pageSize: Number(pageSize), // 每页条数
      totalPages: Math.ceil(total / pageSize), // 总页数
      data: allRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取分页记录失败：' + error.message
    });
  }
});


module.exports = router;