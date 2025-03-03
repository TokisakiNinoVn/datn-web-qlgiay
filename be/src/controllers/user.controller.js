const db = require('../config/db.config');
const bcrypt = require('bcrypt');

// Thêm người dùng mới
exports.add = async (req, res, next) => {
  const { email, password, phone, fullname, address, gender, role } = req.body;

  try {
    // Kiểm tra xem số điện thoại đã tồn tại
    const phoneCheck = `SELECT * FROM Users WHERE phone = ?`;
    const [phoneResult] = await db.pool.execute(phoneCheck, [email]);


    if (phoneResult.length > 0) {
      return res.status(400).json({ message: "Số điện thoại đã có tài khoản người dùng!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let roleId;

    if (role === 'admin') {
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

    res.status(201).json({ message: "Thêm mới người dùng thành công!", userId: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


// Lấy tất cả người dùng
exports.getAllCustomer = async (req, res, next) => {
  try {
    const sql = `SELECT * FROM users`;
    const [users] = await db.pool.execute(sql);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
// Lấy tất cả người dùng + role (cả name và code)
exports.getAllUsersWithRole = async (req, res, next) => {
  try {
    const sql = `SELECT id, role_id, full_name FROM users`;
    const [users] = await db.pool.execute(sql);

    // Lấy thông tin roles
    const sqlRole = `SELECT id, name, code FROM roles`;
    const [roles] = await db.pool.execute(sqlRole);

    // Map role theo id
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
    // Xóa thông tin không cần thiết
    delete user.password;
    delete user.role_id;
    delete user.avatar_id;
    delete user.status;
    delete user.role_code;

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { email = "", full_name = "", phone = "", address = "", gender = "", note = "", role_code ="" } = req.body;

  // Kiểm tra ID hợp lệ
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "ID không hợp lệ" });
  }

  let roleId;

  if (role_code === 'admin') {
    roleId = 1;
  } else if (role_code === 'manager') {
    roleId = 2;
  } else {
    roleId = 3;
  }

  try {
    const sql = `UPDATE users SET email = ?, full_name = ?, phone = ?, address = ?, gender = ?, note = ?, role_id = ? WHERE id = ?`;
    await db.pool.execute(sql, [email, full_name, phone, address, gender, note, roleId, userId]);

    res.json({ message: "User updated successfully" });
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

//Lấy thông tin của tất cả người dùng với id, full_name, phone, address, map trường role qua bảng roles để lấy name, code
// exports.getAllUsersSimple = async (req, res, next) => {
//   try {
//     const sql = `SELECT id, role_id, full_name, phone, address FROM users`;
//     const [users] = await db.pool.execute(sql);

//     // Lấy thông tin roles
//     const sqlRole = `SELECT id, name, code FROM roles`;
//     const [roles] = await db.pool.execute(sqlRole);

//     // Map role theo id
//     const roleMap = roles.reduce((acc, role) => {
//       acc[role.id] = { name: role.name, code: role.code };
//       return acc;
//     }, {});

//     // Gán thông tin role vào user
//     const usersWithRole = users.map(user => ({
//       ...user,
//       role: roleMap[user.role_id]?.name || null,
//       role_code: roleMap[user.role_id]?.code || null
//     }));

//     res.json(usersWithRole);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getAllUsersSimple = async (req, res, next) => {
  try {
    // Truy vấn lấy thông tin user kèm role name và role code
    const sql = `
      SELECT users.id, users.full_name, users.phone, users.address, users.gender, users.email, users.note,
             roles.name AS role, roles.code AS role_code
      FROM users
      LEFT JOIN roles ON users.role_id = roles.id;
    `;

    const [users] = await db.pool.execute(sql);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

