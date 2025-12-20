const commentModel = require('../models/comment');
const postModel = require('../models/post');
const { validationResult } = require('express-validator');

class CommentController {
  // 创建评论
  async createComment(req, res) {
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

      const userId = req.userId;
      const { postId, content } = req.body;

      // 验证帖子是否存在
      if (!await postModel.exists(postId)) {
        return res.status(404).json({
          success: false,
          message: '帖子不存在',
          data: null,
          error: 'POST_NOT_FOUND'
        });
      }

      // 创建评论
      const commentId = await commentModel.create(postId, userId, content);

      // 获取创建的评论
      const comment = await commentModel.findById(commentId);

      res.status(201).json({
        success: true,
        message: '评论创建成功',
        data: { comment },
        error: null
      });
    } catch (error) {
      console.error('创建评论错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // 获取帖子的评论
  async getComments(req, res) {
    try {
      const postId = parseInt(req.params.postId);

      // 验证帖子是否存在
      if (!await postModel.exists(postId)) {
        return res.status(404).json({
          success: false,
          message: '帖子不存在',
          data: null,
          error: 'POST_NOT_FOUND'
        });
      }

      const comments = await commentModel.findByPostId(postId);

      res.json({
        success: true,
        message: '获取成功',
        data: { comments },
        error: null
      });
    } catch (error) {
      console.error('获取评论错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // 删除评论
  async deleteComment(req, res) {
    try {
      const commentId = parseInt(req.params.id);
      const userId = req.userId;

      // 验证评论是否存在且属于当前用户
      if (!await commentModel.belongsToUser(commentId, userId)) {
        return res.status(403).json({
          success: false,
          message: '无权删除此评论',
          data: null,
          error: 'PERMISSION_DENIED'
        });
      }

      // 删除评论
      await commentModel.delete(commentId);

      res.json({
        success: true,
        message: '评论删除成功',
        data: null,
        error: null
      });
    } catch (error) {
      console.error('删除评论错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
}

module.exports = new CommentController();