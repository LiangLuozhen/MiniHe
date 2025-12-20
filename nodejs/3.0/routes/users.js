const express = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 公开路由（不需要认证）
router.get('/:id', userController.getUser);
router.get('/:id/posts', userController.getUserPosts);
router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);

// 需要认证的路由
router.post('/:id/follow', authenticate, userController.followUser);
router.delete('/:id/follow', authenticate, userController.unfollowUser);

module.exports = router;