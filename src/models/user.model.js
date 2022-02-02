const argon2 = require("argon2");
const { connection } = require("../../db-connection");

class User {
  constructor() {
    this.hashingOptions = {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 5,
      parallelism: 1,
    };
  }

  static async hashPassword(password) {
    const hashedPassword = await argon2.hash(password, this.hashingOptions);
    return hashedPassword;
  }

  static async verifyPassword(password, hashedPassword) {
    return argon2.verify(hashedPassword, password, this.hashingOptions);
  }

  static async emailAlreadyExists(email) {
    const sql = "SELECT * FROM user WHERE email=?";
    const [result] = await connection.promise().query(sql, [email]);
    return result.length > 0;
  }

  static async idDoNotExists(id) {
    const sql = "SELECT * FROM user WHERE id=?";
    const [result] = await connection.promise().query(sql, [id]);
    return result.length === 0;
  }

  static findMany() {
    const sql = "SELECT * FROM user";
    return connection.promise().query(sql);
  }

  static findOneById(id) {
    const sql = "SELECT * FROM user WHERE id=?";
    return connection.promise().query(sql, [id]);
  }

  static findOneByEmail(email) {
    const sql = "SELECT * FROM user WHERE email=?";
    return connection.promise().query(sql, [email]);
  }

  static createOne(user) {
    const sql = "INSERT INTO user SET ?";
    return connection.promise().query(sql, [user]);
  }

  static updateOneById(user, id) {
    const sql = "UPDATE user SET ? WHERE id=?";
    return connection.promise().query(sql, [user, id]);
  }

  static deleteOneById(id) {
    const sql = "DELETE FROM user WHERE id=?";
    return connection.promise().query(sql, [id]);
  }
}

module.exports = User;
