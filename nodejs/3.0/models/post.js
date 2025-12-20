const db = require('./db');

class Post {
  // 创建帖子
  async create(userId, tagId, title, content, imageUrl) {
    const sql = `INSERT INTO posts 
                 (user_id, tag_id, title, content, image_url) 
                 VALUES (?, ?, ?, ?, ?)`;
    const result = await db.query(sql, [userId, tagId, title, content, imageUrl]);
    return result.insertId;
  }

  // 获取所有帖子（按权重排序：浏览量×0.4 + 点赞量×0.6）
  async findAll(page = 1, limit = 20, tagId = null) {
    const offset = (page - 1) * limit;

    // 基础查询
    let whereClause = "WHERE p.status = 'published'";
    const params = [];

    if (tagId) {
      whereClause += " AND p.tag_id = ?";
      params.push(tagId);
    }

    // 注意：LIMIT和OFFSET不能使用参数占位符，要直接拼接到SQL中
    const sql = `
      SELECT 
        p.*,
        u.username as author_name,
        gt.tag_name as game_tag,
        (p.view_count * 0.4 + p.like_count * 0.6) as weight,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as total_likes,
        (SELECT COUNT(*) FROM favorites WHERE post_id = p.id) as total_favorites,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as total_comments
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN game_tags gt ON p.tag_id = gt.id
      ${whereClause}
      ORDER BY weight DESC, p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return await db.query(sql, params);
  }

  // 通过ID获取帖子
  async findById(id) {
    const sql = `
      SELECT 
        p.*,
        u.username as author_name,
        gt.tag_name as game_tag,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as total_likes,
        (SELECT COUNT(*) FROM favorites WHERE post_id = p.id) as total_favorites,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as total_comments
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN game_tags gt ON p.tag_id = gt.id
      WHERE p.id = ? AND p.status = 'published'
    `;

    const posts = await db.query(sql, [id]);
    return posts[0];
  }

  // 获取用户发布的帖子
  async findByUserId(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const sql = `
      SELECT 
        p.*,
        gt.tag_name as game_tag,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as total_likes,
        (SELECT COUNT(*) FROM favorites WHERE post_id = p.id) as total_favorites,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as total_comments
      FROM posts p
      LEFT JOIN game_tags gt ON p.tag_id = gt.id
      WHERE p.user_id = ? AND p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return await db.query(sql, [userId]);
  }

  // 更新帖子
  async update(id, updateData) {
    const { title, content, imageUrl, tagId } = updateData;
    const sql = `UPDATE posts 
                 SET title = ?, content = ?, image_url = ?, tag_id = ?, updated_at = CURRENT_TIMESTAMP 
                 WHERE id = ?`;
    await db.query(sql, [title, content, imageUrl, tagId, id]);
  }

  // 删除帖子（软删除）
  async delete(id) {
    const sql = "UPDATE posts SET status = 'deleted' WHERE id = ?";
    await db.query(sql, [id]);
  }

  // 增加浏览量
  async incrementViewCount(id) {
    const sql = 'UPDATE posts SET view_count = view_count + 1 WHERE id = ?';
    await db.query(sql, [id]);
  }

  // 检查帖子是否存在且属于用户
  async belongsToUser(postId, userId) {
    const sql = 'SELECT COUNT(*) as count FROM posts WHERE id = ? AND user_id = ?';
    const result = await db.query(sql, [postId, userId]);
    return result[0].count > 0;
  }

  // 检查帖子是否存在
  async exists(id) {
    const sql = "SELECT COUNT(*) as count FROM posts WHERE id = ? AND status = 'published'";
    const result = await db.query(sql, [id]);
    return result[0].count > 0;
  }
}

module.exports = new Post();