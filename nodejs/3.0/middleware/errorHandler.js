// 全局错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error('全局错误:', err);

  // 默认错误状态码和消息
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';

  res.status(statusCode).json({
    success: false,
    message: message,
    data: null,
    error: err.name || 'UNKNOWN_ERROR'
  });
};

module.exports = errorHandler;