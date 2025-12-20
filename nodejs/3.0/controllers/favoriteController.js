const favoriteModel = require('../models/favorite');
const postModel = require('../models/post');

class FavoriteController {
  // 收藏帖子
  async addFavorite(req, res) {
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

      // 收藏帖子
      const result = await favoriteModel.add(userId, postId);

      if (!result) {
        return res.status(400).json({
          success: false,
          message: '已经收藏过此帖子',
          data: null,
          error: 'ALREADY_FAVORITED'
        });
      }

      res.json({
        success: true,
        message: '收藏成功',
        data: null,
        error: null
      });
    } catch (error) {
      console.error('收藏帖子错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // 取消收藏
  async removeFavorite(req, res) {
    try {
      const userId = req.userId;
      const postId = parseInt(req.params.id);

      // 取消收藏
      const result = await favoriteModel.remove(userId, postId);

      if (!result) {
        return res.status(400).json({
          success: false,
          message: '未收藏此帖子',
          data: null,
          error: 'NOT_FAVORITED'
        });
      }

      res.json({
        success: true,
        message: '取消收藏成功',
        data: null,
        error: null
      });
    } catch (error) {
      console.error('取消收藏错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // 获取用户收藏的帖子
  async getUserFavorites(req, res) {
    try {
      const userId = req.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const favorites = await favoriteModel.findByUserId(userId, page, limit);
      const total = favorites.length;

      res.json({
        success: true,
        message: '获取成功',
        data: {
          favorites,
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
      console.error('获取收藏列表错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
}

module.exports = new FavoriteController();