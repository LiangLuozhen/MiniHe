const { verifyToken, extractToken } = require('../utils/jwt');

// 认证中间件
const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供访问令牌',
        data: null,
        error: 'NO_TOKEN'
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: '无效的访问令牌',
        data: null,
        error: 'INVALID_TOKEN'
      });
    }

    // 将用户ID添加到请求对象中
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('认证中间件错误:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误',
      data: null,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

module.exports = {
  authenticate
};