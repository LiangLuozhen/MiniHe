const db = require('./db');

class Favorite {
  // 收藏帖子
  async add(userId, postId) {
    try {
      const sql = 'INSERT INTO favorites (user_id, post_id) VALUES (?, ?)';
      await db.query(sql, [userId, postId]);

      // 更新帖子收藏计数
      await db.query('UPDATE posts SET favorite_count = favorite_count + 1 WHERE id = ?', [postId]);

      return true;
    } catch (error) {
      // 如果是重复收藏，返回false
      if (error.code === 'ER_DUP_ENTRY') {
        return false;
      }
      throw error;
    }
  }

  // 取消收藏
  async remove(userId, postId) {
    const sql = 'DELETE FROM favorites WHERE user_id = ? AND post_id = ?';
    const result = await db.query(sql, [userId, postId]);

    if (result.affectedRows > 0) {
      // 更新帖子收藏计数
      await db.query('UPDATE posts SET favorite_count = GREATEST(favorite_count - 1, 0) WHERE id = ?', [postId]);
      return true;
    }

    return false;
  }

  // 获取用户收藏的帖子
  async findByUserId(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const sql = `
      SELECT 
        p.*,
        u.username as author_name,
        gt.tag_name as game_tag,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as total_likes,
        (SELECT COUNT(*) FROM favorites WHERE post_id = p.id) as total_favorites,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as total_comments
      FROM favorites f
      JOIN posts p ON f.post_id = p.id
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN game_tags gt ON p.tag_id = gt.id
      WHERE f.user_id = ? AND p.status = 'published'
      ORDER BY f.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return await db.query(sql, [userId]);
  }

  // 检查是否收藏
  async isFavorited(userId, postId) {
    const sql = 'SELECT COUNT(*) as count FROM favorites WHERE user_id = ? AND post_id = ?';
    const result = await db.query(sql, [userId, postId]);
    return result[0].count > 0;
  }
}

module.exports = new Favorite();