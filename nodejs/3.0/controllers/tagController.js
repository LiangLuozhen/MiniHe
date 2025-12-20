const tagModel = require('../models/tag');

class TagController {
  // 获取所有标签
  async getTags(req, res) {
    try {
      const tags = await tagModel.findAll();

      res.json({
        success: true,
        message: '获取成功',
        data: { tags },
        error: null
      });
    } catch (error) {
      console.error('获取标签错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        data: null,
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
}

module.exports = new TagController();