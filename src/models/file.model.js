const { connection } = require("../../db-connection");

class File {
  static findManyByUserId(user_id) {
    const sql = "SELECT * FROM file WHERE user_id=?";
    return connection.promise().query(sql, [user_id]);
  }

  static findManyByFolderId(folder_id) {
    const sql = "SELECT * FROM file WHERE folder_id=?";
    return connection.promise().query(sql, [folder_id]);
  }

  static findOneById(id) {
    const sql = "SELECT * FROM file WHERE id=?";
    return connection.promise().query(sql, [id]);
  }

  static createOneFile(file) {
    const sql = "INSERT INTO file SET ?";
    return connection.promise().query(sql, [file]);
  }

  static updateOneById(file, id) {
    const sql = "UPDATE file SET ? WHERE id=?";
    return connection.promise().query(sql, [file, id]);
  }

  static deleteOneById(id) {
    const sql = "DELETE FROM file WHERE id=?";
    return connection.promise().query(sql, [id]);
  }
}

module.exports = File;