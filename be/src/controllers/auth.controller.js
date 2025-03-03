const bcrypt = require('bcrypt');
const { HTTP_STATUS } = require('../constants/status-code.js');
const AppError = require('../utils/app-error.js');
const db = require('../config/db.config');
const e = require('cors');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
  const { phone, password } = req.body;

  try {
    const [rows] = await db.pool.execute(
      'SELECT * FROM users WHERE phone = ?',
      [phone]
    );

    // console.log(rows);

    if (rows.length === 0) {
      return next(new AppError(HTTP_STATUS.NOT_FOUND, 'failed', 'Không tìm thấy người dùng', []), req, res, next);
    }

    //check status của admin
    // if (rows[0].status === '0') {
    //   return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Tài khoản của bạn đã bị khóa', []), req, res, next);
    // }

    // const idAdmin = rows[0].id;
    // const insertSql = 'INSERT INTO log_login_admin (id_admin, type, createAt) VALUES (?, ?, NOW())';
    // await db.pool.execute(insertSql, [idAdmin, 'login']);

    // //lấy name của role
    // const [rowsRole] = await db.pool.execute(
    //   'SELECT history_login, history_log, manage_complaint, manage_noti, manage_role, manage_staff, manage_user FROM roles WHERE id = ?',
    //   [rows[0].role]
    // );


    // if (rows.length === 0) {
    //   return next(new AppError(HTTP_STATUS.NOT_FOUND, 'failed', 'Không tìm thấy người dùng', []), req, res, next);
    // }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mật khẩu không chính xác' });
    }

    // await db.pool.execute(
    //   'UPDATE admins SET status = ? WHERE id = ?',
    //   ['online', user.id]
    // );
    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      status: 'success',
      token: token,
      data: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        // email: user.email,
        // status: user.status,
        // phone: user.phone,
        // gender: user.gender,
        // address: user.address,
        // updatedAt: user.updatedAt,
        // roles: rowsRole
      },
      message: 'Đăng nhập thành công',
    });
  } catch (error) {
    console.error('Error in login function:', error);
    res.status(500).json({ error: error.message });
  }
};
// exports.register = async (req, res, next) => {
//   const { username, email, password } = req.body;

//   try {
//     const [usernameCheck] = await db.pool.execute('SELECT * FROM users WHERE username = ?', [username]);
//     if (usernameCheck.length > 0) {
//       return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Tên người dùng đã tồn tại', []), req, res, next);
//     }

//     const [emailCheck] = await db.pool.execute('SELECT * FROM users WHERE email = ?', [email]);
//     if (emailCheck.length > 0) {
//       return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Email đã tồn tại', []), req, res, next);
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const createdAt = new Date();

//     await db.pool.execute('INSERT INTO users (username, email, password, createdAt) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, createdAt]);

//     const user = { username, email, createdAt };

//     res.status(201).json({
//       code: 201,
//       status: 'success',
//       data: user,
//       message: 'Đăng ký thành công',
//     });

//   } catch (error) {
//     console.error('Error in register function:', error);
//     res.status(500).json({ error: error.message });
//     next(error);
//   }
// }

exports.logout = async (req, res, next) => { 
  const { id } = req.body;
  try {
    // await db.pool.execute(
    //   'UPDATE users SET status = ? WHERE id = ?',
    //   ['offline', id]
    // );

    // const insertSql = 'INSERT INTO log_login_admin (id_admin, type, createAt) VALUES (?, ?, NOW())';
    // await db.pool.execute(insertSql, [id, 'logout']);

    res.status(200).json({
      message: 'Đăng xuất thành công'
    });
  } catch (error) {
    console.error('Error in logout function:', error);
    res.status(500).json({ error: error.message });
  }
}
