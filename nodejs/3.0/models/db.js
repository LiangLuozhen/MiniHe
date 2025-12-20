const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

class Database {
  constructor() {
    this.pool = mysql.createPool(dbConfig);
  }

  async query(sql, params = []) {
    try {
      const [results] = await this.pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('数据库查询错误:', error.message);
      console.error('SQL:', sql);
      console.error('参数:', params);
      throw error;
    }
  }

  async getConnection() {
    return await this.pool.getConnection();
  }

  async close() {
    await this.pool.end();
  }
}

// 导出数据库实例
module.exports = new Database();