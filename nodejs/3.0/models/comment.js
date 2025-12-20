const db = require('./db');

class Comment {
  // 创建评论
  async create(postId, userId, content) {
    const sql = 'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)';
    const result = await db.query(sql, [postId, userId, content]);

    // 更新帖子评论计数
    await db.query('UPDATE posts SET comment_count = comment_count + 1 WHERE id = ?', [postId]);

    return result.insertId;
  }

  // 获取帖子的评论
  async findByPostId(postId) {
    const sql = `
      SELECT 
        c.*,
        u.username as author_name,
        (SELECT COUNT(*) FROM likes WHERE comment_id = c.id) as total_likes
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `;

    return await db.query(sql, [postId]);
  }

  // 删除评论
  async delete(id) {
    // 先获取评论信息
    const comment = await this.findById(id);

    if (!comment) {
      return false;
    }

    // 删除评论
    const sql = 'DELETE FROM comments WHERE id = ?';
    await db.query(sql, [id]);

    // 更新帖子评论计数
    await db.query('UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = ?', [comment.post_id]);

    return true;
  }

  // 通过ID查找评论
  async findById(id) {
    const sql = 'SELECT * FROM comments WHERE id = ?';
    const comments = await db.query(sql, [id]);
    return comments[0];
  }

  // 检查评论是否存在且属于用户
  async belongsToUser(commentId, userId) {
    const sql = 'SELECT COUNT(*) as count FROM comments WHERE id = ? AND user_id = ?';
    const result = await db.query(sql, [commentId, userId]);
    return result[0].count > 0;
  }

  // 检查评论是否存在
  async exists(id) {
    const sql = 'SELECT COUNT(*) as count FROM comments WHERE id = ?';
    const result = await db.query(sql, [id]);
    return result[0].count > 0;
  }
}

module.exports = new Comment();