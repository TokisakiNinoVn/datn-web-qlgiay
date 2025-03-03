const db = require('../config/db.config');
const bcrypt = require('bcrypt');

// Thêm người dùng mới
// exports.add = async (req, res, next) => {
//   const { username, email, password, phone, name, address, gender } = req.body;

//   try {
//     // Kiểm tra xem username đã tồn tại
//     const checkUsernameSql = `SELECT * FROM user WHERE username = ?`;
//     const [usernameResult] = await db.pool.execute(checkUsernameSql, [username]);

//     // Kiểm tra xem email đã tồn tại
//     const checkEmailSql = `SELECT * FROM user WHERE email = ?`;
//     const [emailResult] = await db.pool.execute(checkEmailSql, [email]);

//     if (usernameResult.length > 0) {
//       return res.status(400).json({ error: "Tên người dùng đã tồn tại!" });
//     }

//     if (emailResult.length > 0) {
//       return res.status(400).json({ error: "Email đã được đăng ký!" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const sql = `
//       INSERT INTO Users (username, email, role, password, phone, name, address, gender, createdAt)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
//     `;
//     const userData = [
//       username,
//       email,
//       'khách hàng',
//       hashedPassword,
//       phone || null, 
//       name || null,
//       address || null,
//       gender || null 
//     ];

//     const [result] = await db.pool.execute(sql, userData);

//     res.status(201).json({ message: "Thêm mới khách hàng thành công!", userId: result.insertId });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.updateInfo = async (req, res, next) => { 
  const { id, username, email, phone } = req.body;
}
