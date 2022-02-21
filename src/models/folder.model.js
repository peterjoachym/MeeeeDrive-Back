const { connection } = require("../../db-connection");

class Folder {
  static findManyByUserId(user_id) {
    const sql = "SELECT * FROM folder WHERE user_id=?";
    return connection.promise().query(sql, [user_id]);
  }

  static findOneById(id) {
    const sql = "SELECT * FROM folder WHERE id=?";
    return connection.promise().query(sql, [id]);
  }

  static createOneFolder(folder) {
    const sql = "INSERT INTO folder SET ?";
    return connection.promise().query(sql, [folder]);
  }

  static updateOneById(folder, id) {
    const sql = "UPDATE folder SET ? WHERE id=?";
    return connection.promise().query(sql, [folder, id]);
  }

  static deleteOneById(id) {
    const sql = "DELETE FROM folder WHERE id=?";
    return connection.promise().query(sql, [id]);
  }
}

module.exports = Folder;
