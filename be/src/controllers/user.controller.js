const db = require('../config/db.config');
const bcrypt = require('bcrypt');

// Thêm người dùng mới
exports.add = async (req, res, next) => {
  // const warehouseId = req.user.warehouses[0];
  const { email, password, phone, fullname, address, gender, role_code, warehouse } = req.body;

  try {
    // Kiểm tra xem số điện thoại đã tồn tại
    const phoneCheck = `SELECT phone FROM Users WHERE phone = ?`;
    const [phoneResult] = await db.pool.execute(phoneCheck, [phone]);
    // console.log('phoneResult:', phoneResult);

    if (phoneResult.length > 0) {
      return res.status(200).json({
        code: 400,
        message: "Số điện thoại đã có tài khoản người dùng!"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let roleId;

    if (role_code === 'admin') {
      roleId = 1;
    } else if (role_code === 'manager') {
      roleId = 2;
    } else {
      roleId = 3;
    }
    const sql = `
      INSERT INTO Users (email, role_id, password, phone, full_name, address, gender, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const userData = [
      email,
      roleId,
      hashedPassword,
      phone || null, 
      fullname || null,
      address || null,
      gender || null 
    ];

    const [result] = await db.pool.execute(sql, userData);

    // Lưu thông tin người dùng và bảng warehouse_user
    if (warehouse) {
      const warehouseUserSql = `
        INSERT INTO warehouse_user (warehouse_id, user_id, role_id)
        VALUES (?, ?, ?)
      `;
      await db.pool.execute(warehouseUserSql, [warehouse, result.insertId, roleId]);

      //Lấy thông tin manager_id của kho
      const sqliWarehouse = `SELECT manager_id FROM warehouses WHERE id = ?`;
      const [manager] = await db.pool.execute(sqliWarehouse, [warehouse]);
      console.log('manager:', manager[0].manager_id);
      if (manager[0].manager_id === null || manager[0].manager_id === undefined) {
        const sqlWarehouse = `UPDATE warehouses SET manager_id = ? WHERE id = ?`;
        await db.pool.execute(sqlWarehouse, [result.insertId, warehouse]);
      }
      // else {
      //   const sqlWarehouse = `UPDATE warehouses SET manager_id = ? WHERE id = ?`;
      //   await db.pool.execute(sqlWarehouse, [result.insertId, warehouse]);
      // }

      // câp nhật thông tin kho
      // const sqlWarehouse = `UPDATE warehouses SET manager_id = ? WHERE id = ?`;
      // await db.pool.execute(sqlWarehouse, [result.insertId, warehouse]);
    }

    res.status(201).json({ message: "Thêm mới người dùng thành công!", userId: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Lấy tất cả người dùng
exports.getAllCustomer = async (req, res, next) => {
  const role = req.user.role;
  const warehouses = req.user.warehouses[0];

  try {
    if (role === 'admin') {
      const sql = `SELECT * FROM users`;
      const [users] = await db.pool.execute(sql);
      res.json(users);
    } else {
      const sql = `
        SELECT users.id, users.full_name, users.phone, users
        FROM users
        INNER JOIN warehouse_user ON users.id = warehouse_user.user_id
        WHERE warehouse_user.warehouse_id = ?
      `;
      const [users] = await db.pool.execute(sql, [warehouses.id]);
      res.json(users);
    }
    // res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Lấy tất cả người dùng + role (cả name và code)
exports.getAllCustomer = async (req, res, next) => {
  const { role, warehouses } = req.user;
  const warehouseId = warehouses[0];

  try {
    let sql;
    let params = [];

    if (role === 'admin') {
      sql = `SELECT * FROM users`;
    } else {
      sql = `
        SELECT users.id, users.full_name, users.phone
        FROM users
        INNER JOIN warehouse_user ON users.id = warehouse_user.user_id
        WHERE warehouse_user.warehouse_id = ?`;
      params.push(warehouseId);
    }

    const [users] = await db.pool.execute(sql, params);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Lấy tất cả người dùng + role (cả name và code)
exports.getAllUsersWithRole = async (req, res, next) => {
  const { role, warehouses } = req.user;

  try {
    // Lấy người dùng
    const sqlUsers = `SELECT id, role_id, full_name FROM users`;
    const [users] = await db.pool.execute(sqlUsers);

    // Lấy thông tin roles
    const sqlRole = `SELECT id, name, code FROM roles`;
    const [roles] = await db.pool.execute(sqlRole);

    // Tạo map cho role
    const roleMap = roles.reduce((acc, role) => {
      acc[role.id] = { name: role.name, code: role.code };
      return acc;
    }, {});

    // Gán thông tin role vào user
    const usersWithRole = users.map(user => ({
      ...user,
      role: roleMap[user.role_id]?.name || null,
      role_code: roleMap[user.role_id]?.code || null
    }));

    res.json(usersWithRole);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Lấy tất cả thông tin của user
    const sql = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await db.pool.execute(sql, [id]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Lấy thông tin role
    const sqlRole = `SELECT * FROM roles WHERE id = ?`;
    const [roles] = await db.pool.execute(sqlRole, [user.role_id]);
    user.role = roles[0]?.name || null;
    user.role_code = roles[0]?.code || null;

    // Lấy avatar từ bảng files
    const sqlFile = `SELECT * FROM files WHERE id = ?`;
    const [files] = await db.pool.execute(sqlFile, [user.avatar_id]);

    //Nếu người đung có id = 1 thì không cho thay đổi avatar
    if (user.id === '1' || user.id === 1) {
      user.avatar_url = `https://i.pinimg.com/736x/5a/32/5e/5a325e2e07ff61e6a8546af6220e6ece.jpg`;
    } else {
      user.avatar_url = files[0]?.url || null;
    }

    // Lấy thông tin người dùng tại kho nào (nếu có)
    const sqlWarehouse = `SELECT * FROM warehouse_user WHERE user_id = ?`;
    const [warehouse] = await db.pool.execute(sqlWarehouse, [id]);
    user.warehouse_id = warehouse[0]?.warehouse_id || null;

    // Xóa thông tin không cần thiết
    delete user.password;
    // delete user.role_id;
    delete user.avatar_id;
    delete user.status;
    // delete user.role_code;

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { email = "", full_name = "", phone = "", address = "", gender = "", note = "", role_code = "", warehouse_id, role } = req.body;
  const roleUser = req.user.role;

  // Kiểm tra ID hợp lệ
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "ID không hợp lệ" });
  }

  let roleId;

  if (role_code === 'admin') {
    roleId = 1;
    // Xóa người dùng khỏi bảng warehouse_user nếu là admin
    const sqlDeleteWarehouseUser = `DELETE FROM warehouse_user WHERE user_id = ?`;

    // kiểm tra người dùng có id trùng với manager_id ở bảng warehouse_user không
    // nếu đúng thì cập nhật lại manager_id ở bảng warehouse_user về null
    const sqlCheckManager = `SELECT * FROM warehouse_user WHERE user_id = ? `;
    const [checkManager] = await db.pool.execute(sqlCheckManager, [userId]);
    if (checkManager.length > 0) {
      const sqlUpdateManager = `UPDATE warehouses SET manager_id = NULL WHERE manager_id = ?`;
      await db.pool.execute(sqlUpdateManager, [userId]);
    }

    await db.pool.execute(sqlDeleteWarehouseUser, [userId]);
  } else if (role_code === 'manager') {
    roleId = 2;

    // Kiểm tra xem người dùng có id trùng với manager_id ở bảng warehouses không
    // nếu null hoặc undifine thì cập nhật lại manager_id ở bảng warehouses bằng id của người dùng
    const sqlCheckManager = `SELECT * FROM warehouses WHERE manager_id = ?`;
    const [checkManager] = await db.pool.execute(sqlCheckManager, [userId]);
    if (checkManager.length === 0) {
      const sqlUpdateManager = `UPDATE warehouses SET manager_id = ? WHERE id = ?`;
      await db.pool.execute(sqlUpdateManager, [userId, warehouse_id]);
    }
  } else {
    roleId = 3;
  }

  try {
    const sql = `UPDATE users SET email = ?, full_name = ?, phone = ?, address = ?, gender = ?, note = ?, role_id = ? WHERE id = ?`;
    await db.pool.execute(sql, [email, full_name, phone, address, gender, note, roleId, userId]);

    // Kiểm tra xem người dùng có id trùng với user_id ở bảng warehouse_user không
    const sqlCheckWarehouseUser = `SELECT * FROM warehouse_user WHERE user_id = ?`;
    const [checkWarehouseUser] = await db.pool.execute(sqlCheckWarehouseUser, [userId]);
    
    if (checkWarehouseUser.length === 0 && role_code !== 'admin') {
      // Nếu không có thì thêm mới vào bảng warehouse_user
      const sqlInsertWarehouseUser = `INSERT INTO warehouse_user (warehouse_id, user_id, role_id) VALUES (?, ?, ?)`;
      await db.pool.execute(sqlInsertWarehouseUser, [warehouse_id, userId, roleId]);
    } else {
      // Nếu có thì cập nhật lại warehouse_id và role_id
      const sqlUpdateWarehouseUser = `UPDATE warehouse_user SET warehouse_id = ?, role_id = ? WHERE user_id = ?`;
      await db.pool.execute(sqlUpdateWarehouseUser, [warehouse_id, roleId, userId]);
    }

    res.json({
      code: 200,
      status: "success",
      message: "User updated successfully"
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại sau" });
  }
};

// Xóa người dùng
exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;

  // Kiểm tra nếu id là 1
  if (id === '1') {
    return res.status(403).json({ error: "Không thể xóa người dùng quản trị viên này!" });
  }

  try {
    const sql = `DELETE FROM Users WHERE id = ?`;
    await db.pool.execute(sql, [id]);

    // Xóa thông tin trong bảng warehouse_user
    const sqlWarehouseUser = `DELETE FROM warehouse_user WHERE user_id = ?`;
    await db.pool.execute(sqlWarehouseUser, [id]);

    // câp nhật thông tin kho
    const sqlWarehouse = `UPDATE warehouses SET manager_id = NULL WHERE manager_id = ?`;
    await db.pool.execute(sqlWarehouse, [id]);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tìm kiếm người dùng theo tên, số điện thoại, địa chỉ, ID
exports.search = async (req, res, next) => {
  const { query } = req.body;

  try {
    const sql = `
      SELECT * FROM Users 
      WHERE username LIKE ? OR phone LIKE ? OR address LIKE ? OR id LIKE ?
    `;
    const [users] = await db.pool.execute(sql, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lọc thông tin theo Role
exports.filter = async (req, res, next) => {
  const { role } = req.body;

  try {
    const sql = `SELECT * FROM Users WHERE role = ?`;
    const [users] = await db.pool.execute(sql, [role]);  // Thay đổi ở đây

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsersSimple = async (req, res, next) => {
  const { role, warehouses } = req.user;
  try {
    if (role === null || role === undefined || warehouses === null || warehouses === undefined) {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }
    if (role === 'admin') {
      const sql = `
          SELECT 
              users.id, 
              users.full_name, 
              users.phone, 
              users.address, 
              users.gender, 
              users.email, 
              users.note,
              roles.name AS role, 
              roles.code AS role_code,
              warehouse_user.warehouse_id
          FROM users
          LEFT JOIN roles ON users.role_id = roles.id
          LEFT JOIN warehouse_user ON users.id = warehouse_user.user_id
          `;
          // WHERE users.id != 1;
    
      const [users] = await db.pool.execute(sql);
    
      const formattedUsers = users.map(user => ({
          ...user,
          warehouse_id: user.warehouse_id ? Number(user.warehouse_id) : null
      }));
    
      res.json(formattedUsers);
    }
     else {
      const warehouseId = warehouses[0];
      const sql = `
        SELECT 
          users.id, 
          users.full_name, 
          users.phone, 
          users.address,
          users.gender, 
          users.email, 
          users.note,
          roles.name AS role,
          roles.code AS role_code
        FROM users
        INNER JOIN warehouse_user ON users.id = warehouse_user.user_id
        INNER JOIN roles ON warehouse_user.role_id = roles.id
        WHERE warehouse_user.warehouse_id = ?
      `;
      const [users] = await db.pool.execute(sql, [warehouseId]);
      res.json(users);
    }
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật thông tin cá nhân
exports.updateProfile = async (req, res, next) => { 
  const { id, email, phone, full_name, address, gender, avatar_id } = req.body;
  try {
    // Tạo một mảng để chứa các giá trị cập nhật và một mảng các trường để cập nhật
    const updates = [];
    const values = [];

    if (email) {
      updates.push("email = ?");
      values.push(email);
    }
    if (phone) {
      updates.push("phone = ?");
      values.push(phone);
    }
    if (full_name) {
      updates.push("full_name = ?");
      values.push(full_name);
    }
    if (address) {
      updates.push("address = ?");
      values.push(address);
    }
    if (gender) {
      updates.push("gender = ?");
      values.push(gender);
    }
    if (avatar_id) {
      updates.push("avatar_id = ?");
      values.push(avatar_id);
    }

    // Nếu không có trường nào để cập nhật, trả về thông báo
    if (updates.length === 0) {
      return res.status(400).json({ message: "Không có thông tin nào để cập nhật." });
    }

    // Tạo câu lệnh SQL
    const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    values.push(id);

    // Thực thi câu lệnh SQL
    await db.pool.execute(sql, values);
    
    // Trả về phản hồi thành công
    res.status(200).json({ message: "Cập nhật thông tin thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// lấy otp bằng số điện thoại
exports.getOtp = async (req, res, next) => {
  const { phone } = req.body;
  try {
    // Tạo mã OTP ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Lưu mã OTP vào bảng users (cột otp)
    const sql = `UPDATE users SET otp = ? WHERE phone = ?`;
    await db.pool.execute(sql, [otp, phone]);
    // Trả về phản hồi thành công
    res.status(200).json({
      message: "Mã OTP đã được gửi.",
      code: otp
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Xác thực OTP 
exports.verifyOtp = async (req, res, next) => {
  const { phone, otp } = req.body;
  try {
    // Kiểm tra mã OTP
    const sql = `SELECT * FROM users WHERE phone = ? AND otp = ?`;
    const [rows] = await db.pool.execute(sql, [phone, otp]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Mã OTP không hợp lệ." });
    }
    // Trả về phản hồi thành công
    res.status(200).json({ message: "Mã OTP hợp lệ." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Xác thực OTP và cập nhật mật khẩu mới
exports.resetPassword = async (req, res, next) => {
  const { phone, password } = req.body;

  try {
    // Kiểm tra OTP
    const sql = `SELECT * FROM users WHERE phone = ? AND otp = null`;
    const [rows] = await db.pool.execute(sql, [phone]);

    // if (rows.length === 0) {
    //   return res.status(400).json({ message: "Mã OTP không hợp lệ." });
    // }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cập nhật mật khẩu mới và xóa mã OTP
    const updateSql = `UPDATE users SET password = ?, otp = NULL WHERE phone = ?`;
    await db.pool.execute(updateSql, [hashedPassword, phone]);

    // Trả về phản hồi thành công
    res.status(200).json({ message: "Mật khẩu đã được cập nhật." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

