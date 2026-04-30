const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 使用 SQLite 数据库文件
const dbPath = path.join(__dirname, '../../data/yuexiaoshi.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接失败:', err);
  } else {
    console.log('✅ SQLite 数据库连接成功');
  }
});

// 启用外键约束
db.run('PRAGMA foreign_keys = ON');

// 封装查询方法
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    // 判断是查询还是执行
    const lowerSql = sql.trim().toLowerCase();
    const isSelect = lowerSql.startsWith('select');
    const isInsert = lowerSql.startsWith('insert');

    if (isSelect) {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve({ rows });
        }
      });
    } else if (isInsert && lowerSql.includes('returning')) {
      // SQLite 不支持 RETURNING，需要特殊处理
      // 先执行 INSERT，然后查询最后插入的行
      db.run(sql.replace(/returning.*$/i, ''), params, function (err) {
        if (err) {
          reject(err);
        } else {
          // 返回插入的 ID
          resolve({
            rows: [{ id: this.lastID }],
            rowCount: this.changes,
            lastID: this.lastID,
          });
        }
      });
    } else {
      db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            rowCount: this.changes,
            lastID: this.lastID,
          });
        }
      });
    }
  });
};

// 事务支持
const beginTransaction = () => query('BEGIN TRANSACTION');
const commit = () => query('COMMIT');
const rollback = () => query('ROLLBACK');

module.exports = {
  query,
  db,
  beginTransaction,
  commit,
  rollback,
};
