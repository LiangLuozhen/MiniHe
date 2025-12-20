const userModel = require('../models/user');
const { generateToken } = require('../utils/jwt');
const { validationResult } = require('express-validator');

class AuthController {
  // 用户注册
  async register(req, res) {
    try {
      // 验证输入
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: '参数验证失败',
          data: null,
          error: errors.array()
        });
      }

      const { phone, username, password } = req.body;

      // 检查手机号是否已存在
      if (await userModel.phoneExists(phone)) {
        return res.status(400).json({
          success: false,
          message: '手机号已被注册',
          data: null,
          error: 'PHONE_EXISTS'
        });
      }

      // 检查用户名是否已存在
      if (await userModel.usernameExists(username)) {
        return res.status(400).json({
          success: false,
          message: '用户名已被使用',
          data: null,
          error: 'USERNAME_EXISTS'
        });
      }

      // 创建用户（密码明文存储）
      const userId = await userModel.create(phone, username, password);

      // 生成JWT令牌
      const token = generateToken(userId);

      // 获取用户信息
      const user = await userModel.findById(userId);

      res.status(201).json({
        success: true,
        message: '注册成功',
        data: {
          user,
          token
        },
        error: null
      });
    } catch (error) {
      console.error('注册错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // 用户登录
  async login(req, res) {
    try {
      // 验证输入
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: '参数验证失败',
          data: null,
          error: errors.array()
        });
      }

      const { phone, password } = req.body;

      // 查找用户
      const user = await userModel.findByPhone(phone);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: '手机号或密码错误',
          data: null,
          error: 'INVALID_CREDENTIALS'
        });
      }

      // 验证密码（明文比较）
      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          message: '手机号或密码错误',
          data: null,
          error: 'INVALID_CREDENTIALS'
        });
      }

      // 检查用户状态
      if (user.status === 'banned') {
        return res.status(403).json({
          success: false,
          message: '账号已被封禁',
          data: null,
          error: 'ACCOUNT_BANNED'
        });
      }

      // 生成JWT令牌
      const token = generateToken(user.id);

      // 移除敏感信息
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: '登录成功',
        data: {
          user: userWithoutPassword,
          token
        },
        error: null
      });
    } catch (error) {
      console.error('登录错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // 获取当前用户信息
  async getCurrentUser(req, res) {
    try {
      const userId = req.userId;
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在',
          data: null,
          error: 'USER_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        message: '获取成功',
        data: { user },
        error: null
      });
    } catch (error) {
      console.error('获取用户信息错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
}

module.exports = new AuthController();