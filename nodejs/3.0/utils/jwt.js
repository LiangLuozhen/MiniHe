const jwt = require('jsonwebtoken');

// JWT密钥（生产环境应该使用环境变量）
const JWT_SECRET = 'mini_he_secret_key_2025';
const JWT_EXPIRES_IN = '7d'; // 7天有效期

// 生成JWT令牌
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// 验证JWT令牌
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// 从请求头中提取令牌
const extractToken = (req) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

module.exports = {
  generateToken,
  verifyToken,
  extractToken,
  JWT_SECRET
};