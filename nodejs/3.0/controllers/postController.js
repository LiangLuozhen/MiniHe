const postModel = require('../models/post');
const tagModel = require('../models/tag');
const { validationResult } = require('express-validator');

class PostController {
  // 创建帖子
  async createPost(req, res) {
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
      const { tagId, title, content, imageUrl } = req.body;

      // 验证标签是否存在
      if (!await tagModel.exists(tagId)) {
        return res.status(400).json({
          success: false,
          message: '标签不存在',
          data: null,
          error: 'TAG_NOT_FOUND'
        });
      }

      // 创建帖子
      const postId = await postModel.create(userId, tagId, title, content, imageUrl);

      // 获取创建的帖子
      const post = await postModel.findById(postId);

      res.status(201).json({
        success: true,
        message: '帖子创建成功',
        data: { post },
        error: null
      });
    } catch (error) {
      console.error('创建帖子错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // 获取帖子列表（按权重排序）
  async getPosts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const tagId = req.query.tag ? parseInt(req.query.tag) : null;

      // 如果指定了标签，验证标签是否存在
      if (tagId && !await tagModel.exists(tagId)) {
        return res.status(400).json({
          success: false,
          message: '标签不存在',
          data: null,
          error: 'TAG_NOT_FOUND'
        });
      }

      const posts = await postModel.findAll(page, limit, tagId);
      const total = posts.length;

      res.json({
        success: true,
        message: '获取成功',
        data: {
          posts,
          pagination: {
            page,
            limit,
            total,
            has_more: total === limit
          }
        },
        error: null
      });
    } catch (error) {
      console.error('获取帖子列表错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // 获取单个帖子
  async getPost(req, res) {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.userId;

      // 获取帖子
      const post = await postModel.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: '帖子不存在或已被删除',
          data: null,
          error: 'POST_NOT_FOUND'
        });
      }

      // 增加浏览量
      await postModel.incrementViewCount(postId);

      res.json({
        success: true,
        message: '获取成功',
        data: { post },
        error: null
      });
    } catch (error) {
      console.error('获取帖子错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // 更新帖子
  async updatePost(req, res) {
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

      const postId = parseInt(req.params.id);
      const userId = req.userId;
      const { tagId, title, content, imageUrl } = req.body;

      // 验证帖子是否存在且属于当前用户
      if (!await postModel.belongsToUser(postId, userId)) {
        return res.status(403).json({
          success: false,
          message: '无权编辑此帖子',
          data: null,
          error: 'PERMISSION_DENIED'
        });
      }

      // 验证标签是否存在
      if (!await tagModel.exists(tagId)) {
        return res.status(400).json({
          success: false,
          message: '标签不存在',
          data: null,
          error: 'TAG_NOT_FOUND'
        });
      }

      // 更新帖子
      await postModel.update(postId, { tagId, title, content, imageUrl });

      // 获取更新后的帖子
      const post = await postModel.findById(postId);

      res.json({
        success: true,
        message: '帖子更新成功',
        data: { post },
        error: null
      });
    } catch (error) {
      console.error('更新帖子错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // 删除帖子
  async deletePost(req, res) {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.userId;

      // 验证帖子是否存在且属于当前用户
      if (!await postModel.belongsToUser(postId, userId)) {
        return res.status(403).json({
          success: false,
          message: '无权删除此帖子',
          data: null,
          error: 'PERMISSION_DENIED'
        });
      }

      // 删除帖子（软删除）
      await postModel.delete(postId);

      res.json({
        success: true,
        message: '帖子删除成功',
        data: null,
        error: null
      });
    } catch (error) {
      console.error('删除帖子错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
}

module.exports = new PostController();