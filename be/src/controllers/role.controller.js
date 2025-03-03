const db = require('../config/db.config');
const { logAdminAction, logAuditTrail } = require('../middlewares/logger-middleware');

exports.addRole = async (req, res, next) => {
    const { name, description, idAdmin, roles } = req.body;

    if (!name || !idAdmin || !Array.isArray(roles)) {
        return res.status(400).json({ error: "Thiếu thông tin bắt buộc hoặc sai định dạng dữ liệu!" });
    }

    try {
        const roleColumns = {
            history_login: 0,
            history_log: 0,
            manage_role: 0,
            manage_staff: 0,
            manage_user: 0,
            manage_complaint: 0,
            manage_noti: 0,
        };

        roles.forEach(role => {
            if (roleColumns.hasOwnProperty(role.column)) {
                roleColumns[role.column] = role.selected ? 1 : 0;
            }
        });

        // Chèn vai trò mới vào bảng roles
        const sqlInsertRole = `
            INSERT INTO roles (name, description, history_login, history_log, manage_role, manage_staff, manage_user, manage_complaint, manage_noti)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [insertResult] = await db.pool.execute(sqlInsertRole, [
            name,
            description || null,
            roleColumns.history_login,
            roleColumns.history_log,
            roleColumns.manage_role,
            roleColumns.manage_staff,
            roleColumns.manage_user,
            roleColumns.manage_complaint,
            roleColumns.manage_noti,
        ]);

        const roleId = insertResult.insertId;

        const logResult = await logAdminAction(idAdmin, "create");
        const logId = logResult[0].insertId;

        await logAuditTrail(
            logId, "roles",
            roleId,
            'name/descriptionhistory_login/history_log/manage_role/manage_staff/manage_user/manage_complaint/manage_noti',
            '',
            `${name}/${description || ''}/${roleColumns.history_login}/${roleColumns.history_log}/${roleColumns.manage_role}/${roleColumns.manage_staff}/${roleColumns.manage_user}/${roleColumns.manage_complaint}/${roleColumns.manage_noti}`
        );

        res.status(200).json({ message: "Thêm role thành công!", roleId });
    } catch (error) {
        console.error("Error in addRole:", error);
        res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình thêm role." });
    }
};

//Chỉnh sửa role
exports.editRole = async (req, res, next) => { 
    const { id, name, description, idAdmin, roles } = req.body;
    try {
        const [oldRole] = await db.pool.execute(`SELECT * FROM roles WHERE id = ?`, [id]);
        if (!oldRole || oldRole.length === 0) {
            return res.status(404).json({ message: "Role không tồn tại" });
        }

        const roleColumns = {
            history_login: 0,
            history_log: 0,
            manage_role: 0,
            manage_staff: 0,
            manage_user: 0,
            manage_complaint: 0,
            manage_noti: 0,
        };

        roles.forEach(role => {
            for (let column in role) {
                if (roleColumns.hasOwnProperty(column)) {
                    roleColumns[column] = role[column] ? 1 : 0;
                }
            }
        });

        const sqlUpdateRole = `
            UPDATE roles 
            SET name = ?, description = ?, history_login = ?, history_log = ?, 
                manage_role = ?, manage_staff = ?, manage_user = ?, 
                manage_complaint = ?, manage_noti = ?
            WHERE id = ?
        `;
        await db.pool.execute(sqlUpdateRole, [
            name,
            description || null,
            roleColumns.history_login,
            roleColumns.history_log,
            roleColumns.manage_role,
            roleColumns.manage_staff,
            roleColumns.manage_user,
            roleColumns.manage_complaint,
            roleColumns.manage_noti,
            id
        ]);

        // Ghi lại hành động của admin
        const logResult = await logAdminAction(idAdmin, "update");
        const logId = logResult[0].insertId;

        // Ghi lại audit trail
        await logAuditTrail(
            logId,
            "roles",
            id,
            'name/description/history_login/history_log/manage_role/manage_staff/manage_user/manage_complaint/manage_noti',
            `${oldRole[0].name || ''}/${oldRole[0].description || ''}/${oldRole[0].history_login}/${oldRole[0].history_log}/${oldRole[0].manage_role}/${oldRole[0].manage_staff}/${oldRole[0].manage_user}/${oldRole[0].manage_complaint}/${oldRole[0].manage_noti}`,
            `${name}/${description || ''}/${roleColumns.history_login}/${roleColumns.history_log}/${roleColumns.manage_role}/${roleColumns.manage_staff}/${roleColumns.manage_user}/${roleColumns.manage_complaint}/${roleColumns.manage_noti}`
        );

        res.status(200).json({ message: "Chỉnh sửa role thành công!" });
    } catch (error) {
        console.error("Error in editRole:", error);
        res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình chỉnh sửa role." });
    }
};


// Lấy tất cả role
exports.getAllRoles = async (req, res, next) => { 
    try {
        // Lấy tất cả roles
        const sql = `SELECT * FROM roles`;
        const [roles] = await db.pool.execute(sql);

        if (roles.length === 0) {
            return res.json([]); // Không có roles, trả về mảng rỗng
        }

        // Lấy danh sách role IDs
        const roleIds = roles.map(role => role.id);

        // Lấy số lượng nhân viên của mỗi role
        const placeholders = roleIds.map(() => '?').join(', '); // Tạo danh sách placeholder (?, ?, ...)
        const [staffCounts] = await db.pool.execute(
            `SELECT role, COUNT(*) as count FROM admins WHERE role IN (${placeholders}) GROUP BY role`,
            roleIds
        );

        const staffCountMap = staffCounts.reduce((acc, { role, count }) => {
            acc[role] = count;
            return acc;
        }, {});

        roles.forEach(role => {
            role.staffs = staffCountMap[role.id] || 0;
        });

        res.status(200).json({
            data: roles,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//xóa role
exports.deleteRole = async (req, res, next) => { 
    // const { } = req.params;
    const { id, idAdmin } = req.body;
    try {
        const [role] = await db.pool.execute(`SELECT * FROM roles WHERE id = ?`, [id]);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        await db.pool.execute(`DELETE FROM roles WHERE id = ?`, [id]);

        await logAdminAction(idAdmin, "delete");
        await logAuditTrail(idAdmin, "roles", id, '', '', '');

        res.status(200).json({ message: "Xóa role thành công!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getStaffByRole = async (req, res, next) => { 
    const { id } = req.params;
    try {
        const sql = `SELECT id, username, name, phone FROM admins WHERE role = ?`;
        const [staffs] = await db.pool.execute(sql, [id]);

        res.json(staffs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.getBasicRoleController = async (req, res, next) => { 
    try {
        const sql = `SELECT id, name FROM roles`;
        const [roles] = await db.pool.execute(sql);

        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}