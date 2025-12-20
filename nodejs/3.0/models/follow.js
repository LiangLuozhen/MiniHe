const db = require('./db');

class Follow {
  // 关注用户
  async follow(followerId, followingId) {
    try {
      // 不能关注自己
      if (followerId === followingId) {
        return { success: false, message: '不能关注自己' };
      }

      const sql = 'INSERT INTO follows (follower_id, following_id) VALUES (?, ?)';
      await db.query(sql, [followerId, followingId]);

      return { success: true, message: '关注成功' };
    } catch (error) {
      // 如果是重复关注
      if (error.code === 'ER_DUP_ENTRY') {
        return { success: false, message: '已关注该用户' };
      }
      throw error;
    }
  }

  // 取消关注
  async unfollow(followerId, followingId) {
    const sql = 'DELETE FROM follows WHERE follower_id = ? AND following_id = ?';
    const result = await db.query(sql, [followerId, followingId]);

    if (result.affectedRows > 0) {
      return { success: true, message: '取消关注成功' };
    }

    return { success: false, message: '未关注该用户' };
  }

  // 获取粉丝列表
  async getFollowers(userId) {
    const sql = `
      SELECT 
        u.id,
        u.username,
        u.phone,
        u.created_at
      FROM follows f
      JOIN users u ON f.follower_id = u.id
      WHERE f.following_id = ?
      ORDER BY f.created_at DESC
    `;

    return await db.query(sql, [userId]);
  }

  // 获取关注列表
  async getFollowing(userId) {
    const sql = `
      SELECT 
        u.id,
        u.username,
        u.phone,
        u.created_at
      FROM follows f
      JOIN users u ON f.following_id = u.id
      WHERE f.follower_id = ?
      ORDER BY f.created_at DESC
    `;

    return await db.query(sql, [userId]);
  }

  // 检查是否已关注
  async isFollowing(followerId, followingId) {
    const sql = 'SELECT COUNT(*) as count FROM follows WHERE follower_id = ? AND following_id = ?';
    const result = await db.query(sql, [followerId, followingId]);
    return result[0].count > 0;
  }

  // 获取粉丝数量
  async getFollowerCount(userId) {
    const sql = 'SELECT COUNT(*) as count FROM follows WHERE following_id = ?';
    const result = await db.query(sql, [userId]);
    return result[0].count;
  }

  // 获取关注数量
  async getFollowingCount(userId) {
    const sql = 'SELECT COUNT(*) as count FROM follows WHERE follower_id = ?';
    const result = await db.query(sql, [userId]);
    return result[0].count;
  }
}

module.exports = new Follow();