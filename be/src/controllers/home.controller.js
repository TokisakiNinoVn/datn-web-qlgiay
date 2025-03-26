//Home controller - Lấy các data kiểu thống kê để hiển thị trên trang chủ dạng biểu đồ
const db = require('../config/db.config');


// // Lấy các thông tin chung
exports.getGeneralInfo = async (req, res, next) => {
    const role = req.user.role;
    const warehouses = req.user.warehouses[0];

    try {
        if (role === 'admin') {
            const [totalUsers] = await db.pool.execute('SELECT COUNT(*) as totalUsers FROM users');
            const [totalProducts] = await db.pool.execute('SELECT COUNT(*) as totalProducts FROM products');
            const [totalCategories] = await db.pool.execute('SELECT COUNT(*) as totalCategories FROM categories');
            const [totalBrands] = await db.pool.execute('SELECT COUNT(*) as totalBrands FROM brands');
            const [totalSuppliers] = await db.pool.execute('SELECT COUNT(*) as totalSuppliers FROM suppliers');

            const [totalTurnEnterWarehouse] = await db.pool.execute('SELECT COUNT(*) as totalEnter FROM stock_transactions WHERE transaction_type = "Nhập kho"');
            const [totalTurnExportWarehouse] = await db.pool.execute('SELECT COUNT(*) as totalExport FROM stock_transactions WHERE transaction_type = "Xuất kho"');

            const [totalEnterWarehouse] = await db.pool.execute('SELECT SUM(total_price) as totalEnterAmount FROM stock_transactions WHERE transaction_type = "Nhập kho"');
            const [totalExportWarehouse] = await db.pool.execute('SELECT SUM(total_price) as totalExportAmount FROM stock_transactions WHERE transaction_type = "Xuất kho"');

            res.status(200).json({
                code: 200,
                status: 'success',
                data: {
                    totalUsers: totalUsers[0].totalUsers,
                    totalProducts: totalProducts[0].totalProducts,
                    totalCategories: totalCategories[0].totalCategories,
                    totalBrands: totalBrands[0].totalBrands,
                    totalSuppliers: totalSuppliers[0].totalSuppliers,
                    totalEnterWarehouse: totalEnterWarehouse[0].totalEnterAmount,
                    totalExportWarehouse: totalExportWarehouse[0].totalExportAmount,
                    totalTurnEnterWarehouse: totalTurnEnterWarehouse[0].totalEnter,
                    totalTurnExportWarehouse: totalTurnExportWarehouse[0].totalExport,
                },
                message: 'Lấy thông tin chung thành công',
            });
            
        } else {
            const [totalUsers] = await db.pool.execute('SELECT COUNT(*) as totalUsers FROM warehouse_user WHERE warehouse_id = ?', [warehouses]);

            const [totalProducts] = await db.pool.execute('SELECT COUNT(*) as totalProducts FROM products WHERE warehouse_id = ?', [warehouses]);
            const [totalCategories] = await db.pool.execute('SELECT COUNT(*) as totalCategories FROM categories WHERE warehouse_id = ?', [warehouses]);
            const [totalBrands] = await db.pool.execute('SELECT COUNT(*) as totalBrands FROM brands WHERE warehouse_id = ?', [warehouses]);
            const [totalSuppliers] = await db.pool.execute('SELECT COUNT(*) as totalSuppliers FROM suppliers WHERE warehouse_id = ?', [warehouses]);

            const [totalTurnEnterWarehouse] = await db.pool.execute('SELECT COUNT(*) as totalEnter FROM stock_transactions WHERE transaction_type = "Nhập kho" AND warehouse_id = ?', [warehouses]);
            const [totalTurnExportWarehouse] = await db.pool.execute('SELECT COUNT(*) as totalExport FROM stock_transactions WHERE transaction_type = "Xuất kho" AND warehouse_id = ?', [warehouses]);

            const [totalEnterWarehouse] = await db.pool.execute('SELECT SUM(total_price) as totalEnterAmount FROM stock_transactions WHERE transaction_type = "Nhập kho" AND warehouse_id = ?', [warehouses]);
            const [totalExportWarehouse] = await db.pool.execute('SELECT SUM(total_price) as totalExportAmount FROM stock_transactions WHERE transaction_type = "Xuất kho" AND warehouse_id = ?', [warehouses]);

            res.status(200).json({
                code: 200,
                status: 'success',
                data: {
                    totalUsers: totalUsers[0].totalUsers,
                    totalProducts: totalProducts[0].totalProducts,
                    totalCategories: totalCategories[0].totalCategories,
                    totalBrands: totalBrands[0].totalBrands,
                    totalSuppliers: totalSuppliers[0].totalSuppliers,
                    totalEnterWarehouse: totalEnterWarehouse[0].totalEnterAmount,
                    totalExportWarehouse: totalExportWarehouse[0].totalExportAmount,
                    totalTurnEnterWarehouse: totalTurnEnterWarehouse[0].totalEnter,
                    totalTurnExportWarehouse: totalTurnExportWarehouse[0].totalExport,
                },
                message: 'Lấy thông tin chung thành công',
            });
        }
    } catch (error) {
        console.error('Error in getGeneralInfo function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
}