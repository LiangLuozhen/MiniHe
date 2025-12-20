const express = require('express');
const { body } = require('express-validator');
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 创建评论验证规则
const createCommentValidation = [
  body('postId')
    .isInt({ min: 1 })
    .withMessage('请指定帖子ID'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('评论内容必须在1-500个字符之间')
];

// 公开路由
router.get('/post/:postId', commentController.getComments);

// 需要认证的路由
router.post('/', authenticate, createCommentValidation, commentController.createComment);
router.delete('/:id', authenticate, commentController.deleteComment);

module.exports = router;