require('dotenv').config();
const mongoose = require('mongoose');

// 获取连接字符串
const uri = process.env.MONGODB_URI;

console.log('⏳ 正在尝试连接 MongoDB Atlas...');

async function testConnection() {
  try {
    // 尝试连接
    await mongoose.connect(uri);
    
    console.log('✅ 连接成功！(Connection Successful)');
    console.log(`🗄  当前数据库名称: ${mongoose.connection.name}`);
    console.log('🎉 你的账号密码和网络配置都是正确的。');

    // 可以在这里尝试做一个简单的读取，看看是否有权限
    // const collections = await mongoose.connection.db.listCollections().toArray();
    // console.log('📚 现有集合:', collections.map(c => c.name));

  } catch (error) {
    console.error('❌ 连接失败 (Connection Failed):');
    console.error('----------------------------------');
    console.error(error.message);
    console.error('----------------------------------');
    console.log('💡 常见原因排查:');
    console.log('1. IP白名单未设置 (Network Access -> Allow Access from Anywhere)');
    console.log('2. 密码错误 (注意特殊字符)');
    console.log('3. 数据库用户名错误');
  } finally {
    // 测试完成后关闭连接
    await mongoose.disconnect();
    console.log('👋 连接已关闭');
  }
}

testConnection();