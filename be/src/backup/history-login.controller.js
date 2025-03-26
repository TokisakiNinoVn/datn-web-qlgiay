const db = require('../config/db.config');

exports.getHistoryLogin = async (req, res, next) => {
    try {
        const [historyLogin] = await db.pool.execute(`
            SELECT log_login_admin.*, admins.username, admins.name AS admin_name, admins.role, roles.name AS role_name 
            FROM log_login_admin 
            INNER JOIN admins ON log_login_admin.id_admin = admins.id
            INNER JOIN roles ON admins.role = roles.id
        `);

        return res.json({
            status: 'success',
            data: historyLogin
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Lỗi khi lấy dữ liệu lịch sử đăng nhập: ' + error.message
        });
    }
};

//Lấy thông tin thống kê
exports.getInforStatistics = async (req, res, next) => { 
    try {
        //Lấy tổng số admin
        const [totalAdmin] = await db.pool.execute('SELECT COUNT(*) AS total_admin FROM admins');
        //Lấy tổng số role
        const [totalRole] = await db.pool.execute('SELECT COUNT(*) AS total_role FROM roles');
        //Lấy tổng số lịch sử đăng nhập
        const [totalHistoryLogin] = await db.pool.execute('SELECT COUNT(*) AS total_history_login FROM log_login_admin');
        //Lấy tổng số lịch sử đăng nhập trong ngày
        const [totalHistoryLoginToday] = await db.pool.execute('SELECT COUNT(*) AS total_history_login_today FROM log_login_admin WHERE DATE(createAt) = CURDATE()');

        //Lấy tổng số người dùng
        const [totalUser] = await db.pool.execute('SELECT COUNT(*) AS total_user FROM users');

        //Lấy tổng số giao dịch trong tháng
        const [totalTransaction] = await db.pool.execute('SELECT COUNT(*) AS total_transaction FROM transactions WHERE MONTH(createAt) = MONTH(CURDATE())');

        //Lấy tổng số giao dịch type = Thu
        // const [totalTransactionIncome] = await db.pool.execute('SELECT COUNT(*) AS total_transaction_income FROM transactions WHERE type = "Thu"');
        // Lấy tổng số giao dịch type = Thu
        const [totalTransactionIncome] = await db.pool.execute(`
            SELECT COUNT(*) AS total_transaction_income 
            FROM transactions t
            JOIN categorys c ON t.category = c.id
            WHERE c.type = "Thu"
        `);

        //Lấy tổng số giao dịch type = Chi
        const [totalTransactionExpense] = await db.pool.execute(`
            SELECT COUNT(*) AS total_transaction_expense 
            FROM transactions t
            JOIN categorys c ON t.category = c.id
            WHERE c.type = "Chi"
        `);

        //Lấy các khiếu nại chưa giải quyết
        const [totalComplaintUnresolved] = await db.pool.execute('SELECT COUNT(*) AS total_complaint_unresolved FROM complaints WHERE status = "0" OR status = 0');


        // Gộp các thông tin thống kê lại
        const statistics = {
            totalAdmin: totalAdmin[0].total_admin,
            totalRole: totalRole[0].total_role,
            totalHistoryLogin: totalHistoryLogin[0].total_history_login,
            totalHistoryLoginToday: totalHistoryLoginToday[0].total_history_login_today,
            totalUser: totalUser[0].total_user,
            totalTransaction: totalTransaction[0].total_transaction,
            totalTransactionIncome: totalTransactionIncome[0].total_transaction_income,
            totalTransactionExpense: totalTransactionExpense[0].total_transaction_expense,
            totalComplaintUnresolved: totalComplaintUnresolved[0].total_complaint_unresolved
        };

        return res.json({
            status: 'success',
            data: statistics
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Lỗi khi lấy thông tin thống kê: ' + error.message
        });
    }
}