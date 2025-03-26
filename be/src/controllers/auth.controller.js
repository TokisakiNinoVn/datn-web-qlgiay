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

    if (rows.length === 0) {
      return next(new AppError(HTTP_STATUS.NOT_FOUND, 'failed', 'Không tìm thấy người dùng', []), req, res, next);
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mật khẩu không chính xác' });
    }

    // map role_id (của bảng users) qua bảng roles lấy name và code của quyền
    const [rowsRole] = await db.pool.execute(`
      SELECT roles.name, roles.code
      FROM users
      JOIN roles ON users.role_id = roles.id
      WHERE users.id = ?
    `, [user.id]);

    // map user.id qua bảng warehouse_user lấy warehouse_id
    const [rowsWarehouse] = await db.pool.execute(`
      SELECT warehouse_id
      FROM warehouse_user
      WHERE user_id = ?
    `, [user.id]);

    // map warehouse_id qua bảng warehouses lấy name
    const warehouses = [];
    for (const row of rowsWarehouse) {
      const [rowsWarehouseName] = await db.pool.execute(`
        SELECT id, name
        FROM warehouses
        WHERE id = ?
      `, [row.warehouse_id]);
      warehouses.push({
        'id': rowsWarehouseName[0].id,
        'name': rowsWarehouseName[0].name,
        // 'code': rowsWarehouseName[0].code,
      });
    }
    
    const token = jwt.sign({
      id: user.id,
      phone: user.phone,
      role: rowsRole[0].code,
      // warehouses: warehouses.map(warehouse => warehouse.id)
      warehouses: warehouses.map(warehouse => warehouse.id)
    },
      process.env.JWT_SECRET_KEY, { expiresIn: '7h' }
    );

    res.status(200).json({
      status: 'success',
      token: token,
      data: {
        id: user.id,
        phone: user.phone,
        name: user.full_name,
        role: rowsRole,
        warehouses: warehouses
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
