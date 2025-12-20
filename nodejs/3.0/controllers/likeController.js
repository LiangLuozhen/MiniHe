const likeModel = require('../models/like');
const postModel = require('../models/post');
const commentModel = require('../models/comment');

class LikeController {
  // 点赞帖子
  async likePost(req, res) {
    try {
      const userId = req.userId;
      const postId = parseInt(req.params.id);

      // 验证帖子是否存在
      if (!await postModel.exists(postId)) {
        return res.status(404).json({
          success: false,
          message: '帖子不存在',
          data: null,
          error: 'POST_NOT_FOUND'
        });
      }

      // 点赞帖子
      const result = await likeModel.likePost(userId, postId);

      if (!result) {
        return res.status(400).json({
          success: false,
          message: '已经点赞过此帖子',
          data: null,
          error: 'ALREADY_LIKED'
        });
      }

      res.json({
        success: true,
        message: '点赞成功',
        data: null,
        error: null
      });
    } catch (error) {
      console.error('点赞帖子错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // 取消点赞帖子
  async unlikePost(req, res) {
    try {
      const userId = req.userId;
      const postId = parseInt(req.params.id);

      // 取消点赞帖子
      const result = await likeModel.unlikePost(userId, postId);

      if (!result) {
        return res.status(400).json({
          success: false,
          message: '未点赞此帖子',
          data: null,
          error: 'NOT_LIKED'
        });
      }

      res.json({
        success: true,
        message: '取消点赞成功',
        data: null,
        error: null
      });
    } catch (error) {
      console.error('取消点赞帖子错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // 点赞评论
  async likeComment(req, res) {
    try {
      const userId = req.userId;
      const commentId = parseInt(req.params.id);

      // 验证评论是否存在
      if (!await commentModel.exists(commentId)) {
        return res.status(404).json({
          success: false,
          message: '评论不存在',
          data: null,
          error: 'COMMENT_NOT_FOUND'
        });
      }

      // 点赞评论
      const result = await likeModel.likeComment(userId, commentId);

      if (!result) {
        return res.status(400).json({
          success: false,
          message: '已经点赞过此评论',
          data: null,
          error: 'ALREADY_LIKED'
        });
      }

      res.json({
        success: true,
        message: '点赞成功',
        data: null,
        error: null
      });
    } catch (error) {
      console.error('点赞评论错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // 取消点赞评论
  async unlikeComment(req, res) {
    try {
      const userId = req.userId;
      const commentId = parseInt(req.params.id);

      // 取消点赞评论
      const result = await likeModel.unlikeComment(userId, commentId);

      if (!result) {
        return res.status(400).json({
          success: false,
          message: '未点赞此评论',
          data: null,
          error: 'NOT_LIKED'
        });
      }

      res.json({
        success: true,
        message: '取消点赞成功',
        data: null,
        error: null
      });
    } catch (error) {
      console.error('取消点赞评论错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
}

module.exports = new LikeController();