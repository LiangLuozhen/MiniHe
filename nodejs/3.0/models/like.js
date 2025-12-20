const db = require('./db');

class Like {
  // 点赞帖子
  async likePost(userId, postId) {
    // 检查是否已经点赞
    const checkSql = 'SELECT id FROM likes WHERE user_id = ? AND post_id = ?';
    const existing = await db.query(checkSql, [userId, postId]);

    if (existing.length > 0) {
      return false; // 已经点赞
    }

    // 添加点赞记录
    const sql = 'INSERT INTO likes (user_id, post_id) VALUES (?, ?)';
    await db.query(sql, [userId, postId]);

    // 更新帖子点赞计数
    await db.query('UPDATE posts SET like_count = like_count + 1 WHERE id = ?', [postId]);

    return true;
  }

  // 取消点赞帖子
  async unlikePost(userId, postId) {
    const sql = 'DELETE FROM likes WHERE user_id = ? AND post_id = ?';
    const result = await db.query(sql, [userId, postId]);

    if (result.affectedRows > 0) {
      // 更新帖子点赞计数
      await db.query('UPDATE posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = ?', [postId]);
      return true;
    }

    return false;
  }

  // 点赞评论
  async likeComment(userId, commentId) {
    // 检查是否已经点赞
    const checkSql = 'SELECT id FROM likes WHERE user_id = ? AND comment_id = ?';
    const existing = await db.query(checkSql, [userId, commentId]);

    if (existing.length > 0) {
      return false; // 已经点赞
    }

    // 添加点赞记录
    const sql = 'INSERT INTO likes (user_id, comment_id) VALUES (?, ?)';
    await db.query(sql, [userId, commentId]);

    // 更新评论点赞计数
    await db.query('UPDATE comments SET like_count = like_count + 1 WHERE id = ?', [commentId]);

    return true;
  }

  // 取消点赞评论
  async unlikeComment(userId, commentId) {
    const sql = 'DELETE FROM likes WHERE user_id = ? AND comment_id = ?';
    const result = await db.query(sql, [userId, commentId]);

    if (result.affectedRows > 0) {
      // 更新评论点赞计数
      await db.query('UPDATE comments SET like_count = GREATEST(like_count - 1, 0) WHERE id = ?', [commentId]);
      return true;
    }

    return false;
  }

  // 检查用户是否点赞了帖子
  async isPostLiked(userId, postId) {
    const sql = 'SELECT COUNT(*) as count FROM likes WHERE user_id = ? AND post_id = ?';
    const result = await db.query(sql, [userId, postId]);
    return result[0].count > 0;
  }

  // 检查用户是否点赞了评论
  async isCommentLiked(userId, commentId) {
    const sql = 'SELECT COUNT(*) as count FROM likes WHERE user_id = ? AND comment_id = ?';
    const result = await db.query(sql, [userId, commentId]);
    return result[0].count > 0;
  }
}

module.exports = new Like();