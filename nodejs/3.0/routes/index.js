const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const postRoutes = require('./posts');
const commentRoutes = require('./comments');
const tagRoutes = require('./tags');
const likeRoutes = require('./likes');
const favoriteRoutes = require('./favorites');

const router = express.Router();

// 健康检查
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '服务器运行正常',
    data: {
      timestamp: new Date().toISOString(),
      service: 'mini-he-backend',
      version: '1.0.0'
    },
    error: null
  });
});

// API文档
router.get('/docs', (req, res) => {
  res.json({
    success: true,
    message: 'API文档',
    data: {
      endpoints: {
        '认证相关': {
          'POST /api/auth/register': '用户注册',
          'POST /api/auth/login': '用户登录',
          'GET /api/auth/me': '获取当前用户信息'
        },
        '用户相关': {
          'GET /api/users/:id': '获取用户信息',
          'GET /api/users/:id/posts': '获取用户帖子',
          'POST /api/users/:id/follow': '关注用户',
          'DELETE /api/users/:id/follow': '取消关注',
          'GET /api/users/:id/followers': '获取粉丝列表',
          'GET /api/users/:id/following': '获取关注列表'
        },
        '帖子相关': {
          'GET /api/posts': '获取帖子列表（权重排序）',
          'GET /api/posts?tag=:tagId': '按标签筛选帖子',
          'GET /api/posts/:id': '获取帖子详情',
          'POST /api/posts': '创建帖子',
          'PUT /api/posts/:id': '更新帖子',
          'DELETE /api/posts/:id': '删除帖子'
        },
        '评论相关': {
          'GET /api/comments/post/:postId': '获取帖子评论',
          'POST /api/comments': '发表评论',
          'DELETE /api/comments/:id': '删除评论'
        },
        '标签相关': {
          'GET /api/tags': '获取所有标签'
        },
        '点赞相关': {
          'POST /api/likes/posts/:id': '点赞帖子',
          'DELETE /api/likes/posts/:id': '取消点赞帖子',
          'POST /api/likes/comments/:id': '点赞评论',
          'DELETE /api/likes/comments/:id': '取消点赞评论'
        },
        '收藏相关': {
          'GET /api/favorites/me': '获取用户收藏列表',
          'POST /api/favorites/posts/:id': '收藏帖子',
          'DELETE /api/favorites/posts/:id': '取消收藏帖子'
        }
      }
    },
    error: null
  });
});

// 挂载路由
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/tags', tagRoutes);
router.use('/likes', likeRoutes);
router.use('/favorites', favoriteRoutes);

// 404处理
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    data: null,
    error: 'NOT_FOUND'
  });
});

module.exports = router;