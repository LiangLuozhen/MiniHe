const db = require('./db');

class Tag {
  // 获取所有标签
  async findAll() {
    const sql = 'SELECT * FROM game_tags ORDER BY tag_name';
    return await db.query(sql);
  }

  // 通过ID查找标签
  async findById(id) {
    const sql = 'SELECT * FROM game_tags WHERE id = ?';
    const tags = await db.query(sql, [id]);
    return tags[0];
  }

  // 检查标签是否存在
  async exists(id) {
    const sql = 'SELECT COUNT(*) as count FROM game_tags WHERE id = ?';
    const result = await db.query(sql, [id]);
    return result[0].count > 0;
  }
}

module.exports = new Tag();