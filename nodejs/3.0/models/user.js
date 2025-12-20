const db = require('./db');

class User {
  // 创建用户
  async create(phone, username, password) {
    const sql = 'INSERT INTO users (phone, username, password) VALUES (?, ?, ?)';
    const result = await db.query(sql, [phone, username, password]);
    return result.insertId;
  }

  // 通过手机号查找用户
  async findByPhone(phone) {
    const sql = 'SELECT * FROM users WHERE phone = ?';
    const users = await db.query(sql, [phone]);
    return users[0];
  }

  // 通过ID查找用户
  async findById(id) {
    const sql = 'SELECT id, phone, username, created_at, status FROM users WHERE id = ?';
    const users = await db.query(sql, [id]);
    return users[0];
  }

  // 检查手机号是否已存在
  async phoneExists(phone) {
    const sql = 'SELECT COUNT(*) as count FROM users WHERE phone = ?';
    const result = await db.query(sql, [phone]);
    return result[0].count > 0;
  }

  // 检查用户名是否已存在
  async usernameExists(username) {
    const sql = 'SELECT COUNT(*) as count FROM users WHERE username = ?';
    const result = await db.query(sql, [username]);
    return result[0].count > 0;
  }

  // 更新用户信息
  async update(id, updateData) {
    const { username } = updateData;
    const sql = 'UPDATE users SET username = ? WHERE id = ?';
    await db.query(sql, [username, id]);
  }
}

module.exports = new User();