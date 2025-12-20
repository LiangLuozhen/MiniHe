// routes/auth.js - 简化版验证规则（适合开发测试）
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 简化的注册验证规则（只验证必填字段）
const registerValidation = [
  body('phone')
    .notEmpty()
    .withMessage('手机号不能为空'),
  body('username')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('用户名长度必须在2-20个字符之间'),
  body('password')
    .isLength({ min: 6, max: 20 })
    .withMessage('密码长度必须在6-20个字符之间')
];

// 简化的登录验证规则
const loginValidation = [
  body('phone')
    .notEmpty()
    .withMessage('手机号不能为空'),
  body('password')
    .notEmpty()
    .withMessage('密码不能为空')
];

// 公开路由
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

// 需要认证的路由
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;