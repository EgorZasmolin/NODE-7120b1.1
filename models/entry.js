const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: process.env.MYSQL_LOGIN,
  database: "serverdb",
  password: process.env.MYSQL_PASSWORD,
});

db.query(
  "CREATE TABLE IF NOT EXISTS entries(id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, title VARCHAR(255), content TEXT NOT NULL)"
);

class Entry {
  constructor() {}

  static create(data) {
    const sql =
      "INSERT INTO entries (username, title, content) VALUES (?, ?, ?)";
    db.execute(sql, [data.username, data.title, data.content]);
  }

  static selectAll(cb) {
    db.query("SELECT * FROM entries", (err, results) => {
      if (err) {
        return cb(err);
      }
      cb(null, results);
    });
  }

  static getEntryById(entryId, cb) {
    const sql = "SELECT * FROM entries WHERE id = ?";
    db.query(sql, [entryId], (err, result) => {
      if (err) {
        return cb(err);
      }
      cb(null, result[0]);
    });
  }

  static delete(entryId, cb) {
    const sql = "DELETE FROM entries WHERE id = ?";
    db.execute(sql, [entryId], (err, result) => {
      if (err) {
        return cb(err);
      }
      cb(null);
    });
  }

  static update(entryId, newData, cb) {
    const checkExistenceSql = "SELECT * FROM entries WHERE id = ?";
    db.query(checkExistenceSql, [entryId], (err, rows) => {
      if (err) {
        return cb(err);
      }

      if (rows.length === 0) {
        return cb(new Error("Entry not found"));
      }

      const updateSql =
        "UPDATE entries SET title = ?, content = ? WHERE id = ?";
      db.execute(
        updateSql,
        [newData.title, newData.content, entryId],
        (err, result) => {
          if (err) {
            return cb(err);
          }
          cb(null);
        }
      );
    });
  }
}

module.exports = Entry;
