const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors()); // 跨域支持
app.use(express.json()); // JSON解析
app.use(express.urlencoded({ extended: true })); // URL编码解析

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 健康检查路由
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '欢迎使用小黑盒 MiniHE 3.0 API',
    data: {
      service: 'mini-he-backend',
      version: '1.0.0',
      documentation: '/api/docs',
      health: '/api/health'
    },
    error: null
  });
});

// API路由
app.use('/api', routes);

// 错误处理中间件（必须放在最后）
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  console.log('========================================');
  console.log(`🚀 小黑盒 MiniHE 3.0 后端服务已启动`);
  console.log(`📡 监听端口: ${PORT}`);
  console.log('========================================');
  console.log('🌐 接口地址:');
  console.log(`  主页面: http://localhost:${PORT}`);
  console.log(`  健康检查: http://localhost:${PORT}/api/health`);
  console.log(`  API文档: http://localhost:${PORT}/api/docs`);
  console.log('========================================');
  console.log('📊 数据库配置:');
  console.log(`  数据库: mini_he3.0`);
  console.log(`  用户名: root`);
  console.log(`  主机: localhost`);
  console.log('========================================');
});

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('正在关闭服务器...');
  const db = require('./models/db');
  await db.close();
  process.exit(0);
});

// 未捕获异常处理
process.on('uncaughtException', (error) => {
  console.error('未捕获异常:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
});