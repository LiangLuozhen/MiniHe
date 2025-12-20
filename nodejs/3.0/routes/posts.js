const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/postController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 创建帖子验证规则
const createPostValidation = [
  body('tagId')
    .isInt({ min: 1 })
    .withMessage('请选择标签'),
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('标题长度必须在3-100个字符之间'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('内容至少10个字符'),
  body('imageUrl')
    .optional({ nullable: true })
    .isURL()
    .withMessage('图片URL格式不正确')
];

// 更新帖子验证规则
const updatePostValidation = [
  body('tagId')
    .isInt({ min: 1 })
    .withMessage('请选择标签'),
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('标题长度必须在3-100个字符之间'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('内容至少10个字符'),
  body('imageUrl')
    .optional({ nullable: true })
    .isURL()
    .withMessage('图片URL格式不正确')
];

// 公开路由
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);

// 需要认证的路由
router.post('/', authenticate, createPostValidation, postController.createPost);
router.put('/:id', authenticate, updatePostValidation, postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);

module.exports = router;