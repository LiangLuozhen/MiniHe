const express = require('express');
const likeController = require('../controllers/likeController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 需要认证的路由
router.post('/posts/:id', authenticate, likeController.likePost);
router.delete('/posts/:id', authenticate, likeController.unlikePost);
router.post('/comments/:id', authenticate, likeController.likeComment);
router.delete('/comments/:id', authenticate, likeController.unlikeComment);

module.exports = router;