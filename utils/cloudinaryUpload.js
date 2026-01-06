const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// 初始化 Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * 上传 Base64 图片到 Cloudinary
 * @param {string} base64Image - 小程序传来的 Base64 图片（含前缀）
 * @param {string} folder - 存储文件夹（分类用，如 health-records）
 * @returns {Promise<string>} 图片的 HTTPS 访问链接
 */
const uploadToCloudinary = async (base64Image, folder = 'health-records') => {
  try {
    // 上传 Base64 图片，自动优化格式（WebP）
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: folder, // 分类存储，方便管理
      resource_type: 'image', // 指定为图片类型
      format: 'webp', // 自动转为 WebP 格式（更小更快）
      quality: 'auto', // 自动优化质量
      secure: true // 强制返回 HTTPS 链接（适配小程序）
    });

    // 返回可直接访问的图片链接
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary 上传失败：', error.message);
    throw new Error('图片上传失败：' + error.message);
  }
};

module.exports = { uploadToCloudinary };