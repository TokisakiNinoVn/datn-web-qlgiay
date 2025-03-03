const db = require('../config/db.config');
const bcrypt = require('bcrypt');
const { logAdminAction, logAuditTrail } = require('../middlewares/logger-middleware');

exports.add = async (req, res, next) => {
  const { idAdmin, username, email, password, phone, name, roleId, address, gender } = req.body;

  try {
    const checkadminnameSql = `SELECT * FROM admins WHERE username = ?`;
    const [adminnameResult] = await db.pool.execute(checkadminnameSql, [username]);

    if (adminnameResult.length > 0) {
      return res.status(400).json({ error: "Tên đăng nhập nhân viên đã tồn tại!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO admins (username, email, role, password, phone, name, address, gender, createAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const adminData = [
      username,
      email || null,
      roleId,
      hashedPassword,
      phone || null,
      name || null,
      address || null,
      gender || null,
    ];

    const [result] = await db.pool.execute(sql, adminData);

    const logResult = await logAdminAction(idAdmin, "create");
    const logId = logResult[0].insertId;
    await logAuditTrail(
      logId, "admins",
      result.insertId,
      'username/email/role/password/phone/name/address/gender',
      '',
      `${username}/${email || ''}/${roleId}/${hashedPassword}/${phone || ''}/${name || ''}/${address || ''}/${gender || ''}`
    );

    res.status(201).json({ message: "Thêm mới nhân viên thành công!", adminId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};

exports.update = async (req, res, next) => { 
  const { id } = req.params;
  const { idAdmin, email, phone, name, roleId, address, gender, note } = req.body;

  try {
    
    if (id === '1') {
      return res.status(403).json({ message: "Không thể cập nhật thông tin nhân viên quản trị viên này!" });
    }

    const sql = `UPDATE admins SET email = ?, phone = ?, name = ?, role = ?, address = ?, gender = ?, note = ?  WHERE id = ?`;
    await db.pool.execute(sql, [email, phone, name, roleId, address, gender, note, id]);

    const logResult = await logAdminAction(idAdmin, "update");
    const logId = logResult[0].insertId;
    await logAuditTrail(
      logId, "admins",
      id,
      'email/phone/name/roleaddress/gender/note',
      '',
      `/${email || ''}/${phone || ''}/${name || ''}/${roleId}/${address || ''}/${gender || ''}/${note || ''}`
    );

    res.status(200).json({ message: "Cập nhật nhân viên thành công!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
}

// Lấy tất cả nhân viên
exports.getAllStaff = async (req, res, next) => {
  try {
    const sql = `SELECT * FROM admins`;
    const [staff] = await db.pool.execute(sql);
    // res.json(staff);
    res.status(200).json({
      data: staff,
      message: "Lấy thông tin nhân viên thành công!"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllStaffBasic = async (req, res, next) => {
  try {
    const sql = `SELECT id, username, name, email, role, phone, gender, note, address, status FROM admins`;
    const [staff] = await db.pool.execute(sql);

    const roleSql = `SELECT * FROM roles`;
    const [roles] = await db.pool.execute(roleSql);
    
    const roleMap = roles.reduce((acc, cur) => {
      acc[cur.id] = cur.name;
      return acc;
    }, {});

    const staffBasic = staff.map((staff) => {
      const roleId = staff.role; // Assuming 'role' in staff is the role ID
      return { 
        ...staff, 
        role: { id: roleId, name: roleMap[roleId] } // Tạo đối tượng role
      };
    });

    res.status(200).json({
      data: staffBasic,
      message: "Lấy thông tin nhân viên thành công!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy thông tin nhân viên theo ID
exports.getStaffById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const sql = `SELECT * FROM admins WHERE id = ?`;
    const [rows] = await db.pool.execute(sql, [id]);
    const staff = rows[0];


    // Lấy thông tin role của nhân viên
    const roleSql = `SELECT * FROM roles WHERE id = ?`;
    const [roles] = await db.pool.execute(roleSql, [staff.role]);
    const role = roles[0];


    if (!staff) {
      return res.status(404).json({ message: "staff not found" });
    }

    res.status(200).json({ ...staff, role: role.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật thông tin nhân viên
exports.updateadmin = async (req, res, next) => {
  const { id } = req.params;
  const { name, phone, address, gender, note } = req.body;

  // Kiểm tra nếu id là 1
  if (id === '1') {
    return res.status(403).json({ message: "Thông tin nhân viên này là cố định - không thể thay đổi" });
  }

  try {
    const sql = `UPDATE admins SET name = ?, phone = ?, address = ?, gender = ?, note = ? WHERE id = ?`;
    await db.pool.execute(sql, [name, phone, address, gender, note, id]);

    res.json({ message: "admin updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa nhân viên
exports.delete = async (req, res, next) => {
  const { id } = req.params;
  const { idAdmin } = req.body;

  // Kiểm tra nếu id là 1
  if (id === '1') {
    return res.status(403).json({ message: "Không thể xóa nhân viên quản trị viên này!" });
  }

  try {
    const sql = `DELETE FROM admins WHERE id = ?`;
    await db.pool.execute(sql, [id]);

    const logResult = await logAdminAction(idAdmin, "delete");
    const logId = logResult[0].insertId;
    await logAuditTrail(
      logId, "admins",
      id,
      '',
      '',
      ''
    );

    res.json({ message: "admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// exports.search = async (req, res, next) => {
//   const { query } = req.body;

//   try {
//     const sql = `
//       SELECT * FROM staff 
//       WHERE adminname LIKE ? OR phone LIKE ? OR address LIKE ? OR id LIKE ?
//     `;
//     const [staff] = await db.pool.execute(sql, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);

//     res.json(staff);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Lọc thông tin theo Role
// exports.filter = async (req, res, next) => {
//   const { role } = req.body;

//   try {
//     const sql = `SELECT * FROM staff WHERE role = ?`;
//     const [staff] = await db.pool.execute(sql, [role]);

//     res.json(staff);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// Khóa/mở khóa tài khoản nhân viên
exports.freeze = async (req, res, next) => {
  const { id } = req.params;
  const { idAdmin, type } = req.body;

  try {
    const status = type === 'unfreeze' ? 'offline' : '0';
    const sql = `UPDATE admins SET status = ? WHERE id = ?`;
    await db.pool.execute(sql, [status, id]);

    const logResult = await logAdminAction(idAdmin, "update");
    const logId = logResult[0].insertId;
    await logAuditTrail(
      logId, "admins",
      id,
      'status',
      status === 'offline' ? '0' : 'offline',
      status
    );

    res.json({ message: `staff ${type === 'unfreeze' ? 'unfrozen' : 'frozen'} successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
