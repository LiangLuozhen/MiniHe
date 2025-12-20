const userModel = require('../models/user');
const postModel = require('../models/post');
const followModel = require('../models/follow');

class UserController {
  // 获取用户信息
  async getUser(req, res) {
    try {
      const userId = parseInt(req.params.id);

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在',
          data: null,
          error: 'USER_NOT_FOUND'
        });
      }

      // 获取粉丝和关注数量
      const followerCount = await followModel.getFollowerCount(userId);
      const followingCount = await followModel.getFollowingCount(userId);

      res.json({
        success: true,
        message: '获取成功',
        data: {
          ...user,
          follower_count: followerCount,
          following_count: followingCount
        },
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

  // 获取用户发布的帖子
  async getUserPosts(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      // 检查用户是否存在
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在',
          data: null,
          error: 'USER_NOT_FOUND'
        });
      }

      const posts = await postModel.findByUserId(userId, page, limit);
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
      console.error('获取用户帖子错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // 关注用户
  async followUser(req, res) {
    try {
      const followerId = req.userId;
      const followingId = parseInt(req.params.id);

      // 检查是否关注自己
      if (followerId === followingId) {
        return res.status(400).json({
          success: false,
          message: '不能关注自己',
          data: null,
          error: 'CANNOT_FOLLOW_SELF'
        });
      }

      // 检查用户是否存在
      const user = await userModel.findById(followingId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在',
          data: null,
          error: 'USER_NOT_FOUND'
        });
      }

      const result = await followModel.follow(followerId, followingId);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
          data: null,
          error: 'FOLLOW_FAILED'
        });
      }

      res.json({
        success: true,
        message: result.message,
        data: null,
        error: null
      });
    } catch (error) {
      console.error('关注用户错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // 取消关注
  async unfollowUser(req, res) {
    try {
      const followerId = req.userId;
      const followingId = parseInt(req.params.id);

      const result = await followModel.unfollow(followerId, followingId);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
          data: null,
          error: 'UNFOLLOW_FAILED'
        });
      }

      res.json({
        success: true,
        message: result.message,
        data: null,
        error: null
      });
    } catch (error) {
      console.error('取消关注错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // 获取粉丝列表
  async getFollowers(req, res) {
    try {
      const userId = parseInt(req.params.id);

      // 检查用户是否存在
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在',
          data: null,
          error: 'USER_NOT_FOUND'
        });
      }

      const followers = await followModel.getFollowers(userId);

      res.json({
        success: true,
        message: '获取成功',
        data: { followers },
        error: null
      });
    } catch (error) {
      console.error('获取粉丝列表错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // 获取关注列表
  async getFollowing(req, res) {
    try {
      const userId = parseInt(req.params.id);

      // 检查用户是否存在
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在',
          data: null,
          error: 'USER_NOT_FOUND'
        });
      }

      const following = await followModel.getFollowing(userId);

      res.json({
        success: true,
        message: '获取成功',
        data: { following },
        error: null
      });
    } catch (error) {
      console.error('获取关注列表错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
}

module.exports = new UserController();