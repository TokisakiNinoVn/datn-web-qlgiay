const db = require('../config/db.config');

//Tạo kho mới
exports.createWarehouse = async (req, res, next) => { 
    const { name, address, description, idManager } = req.body;
    try {
        const [nameCheck] = await db.pool.execute('SELECT * FROM warehouses WHERE name = ?', [name]);
        if (nameCheck.length > 0) {
            return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Tên kho đã tồn tại', []), req, res, next);
        }
        
        // Lấy role code của user manager
        const [getIdRoleManager] = await db.pool.execute('SELECT role_id FROM users WHERE id = ?', [idManager]);
        const idRoleManager = getIdRoleManager[0].role_id;
        const roleCodeUserManager = await db.pool.execute('SELECT code FROM roles WHERE id = ?', [idRoleManager]);
        if (roleCodeUserManager[0][0].code === 'staff') {
            await db.pool.execute('UPDATE users SET role_id = ? WHERE id = ?', [2, idManager]);
        }

        const createdAt = new Date();
        await db.pool.execute('INSERT INTO warehouses (name, address, description, manager_id, createdAt) VALUES (?, ?, ?, ?, ?)', [name, address, description, idManager, createdAt]);
        const warehouse = { name, address, description, idManager, createdAt };

        res.status(201).json({
            code: 201,
            status: 'success',
            data: warehouse,
            message: 'Tạo kho thành công',
        });
    } catch (error) {
        console.error('Error in createWarehouse function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
}

//Cập nhật thông tin kho
exports.updateWarehouse = async (req, res, next) => { 
    const { id, name, address, description, idManager } = req.body;
    // console.log(req.body);
    try {
        const [warehouseCheck] = await db.pool.execute('SELECT * FROM warehouses WHERE id = ?', [id]);
        if (warehouseCheck.length === 0) {
            return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Kho không tồn tại', []), req, res, next);
        }

        const updatedAt = new Date();
        // await db.pool.execute('UPDATE warehouses SET name = ?, address = ?, description = ?, manager_id = ?, updateAt = ? WHERE id = ?', [name, address, description, idManager, id]);
        await db.pool.execute(
            'UPDATE warehouses SET name = ?, address = ?, description = ?, manager_id = ?, updateAt = ? WHERE id = ?',
            [name, address, description, idManager, updatedAt, id] // <-- thêm updatedAt
        );
        
        const warehouse = { id, name, address, description, idManager, updatedAt };
        res.status(200).json({
            code: 200,
            status: 'success',
            data: warehouse,
            message: 'Cập nhật thông tin kho thành công',
        });
    } catch (error) {
        console.error('Error in updateWarehouse function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
}

// //Xóa kho
// exports.deleteWarehouse = async (req, res, next) => {
//     const { id } = req.params;
//     try {
//         const [warehouseCheck] = await db.pool.execute('SELECT * FROM warehouses WHERE id = ?', [id]);
//         if (warehouseCheck.length === 0) {
//             return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Kho không tồn tại', []), req, res, next);
//         }

//         await db.pool.execute('DELETE FROM warehouses WHERE id = ?', [id]);

//         //Map qua bảng products để xóa sản phẩm trong kho
//         const [products] = await db.pool.execute('SELECT id FROM products WHERE warehouse_id = ?', [id]);

//         if (products.length > 0) {
//             const productIds = products.map(product => product.id);
//             await db.pool.query('DELETE FROM products WHERE id IN (?)', [productIds]);
//         }

//         // Map qua bảng stock_transactions để xóa giao dịch trong kho
//         const [stockTransactions] = await db.pool.execute('SELECT id FROM stock_transactions WHERE warehouse_id = ?', [id]);
//         if (stockTransactions.length > 0) {
//             const stockTransactionIds = stockTransactions.map(stockTransaction => stockTransaction.id);
//             await db.pool.query('DELETE FROM stock_transactions WHERE id IN (?)', [stockTransactionIds]);
//         }

//         // Map qua bảng detail_transactions để xóa chi tiết giao dịch (transaction_id tương ứng) trong kho
//         const [stockTransactionDetails] = await db.pool.execute('SELECT id FROM detail_transactions WHERE transaction_id = ?', [id]);
//         if (stockTransactionDetails.length > 0) {
//             const stockTransactionDetailIds = stockTransactionDetails.map(stockTransactionDetail => stockTransactionDetail.id);
//             await db.pool.query('DELETE FROM detail_transactions WHERE id IN (?)', [stockTransactionDetailIds]);
//         }

//         res.status(200).json({
//             code: 200,
//             status: 'success',
//             message: 'Xóa kho thành công',
//         });
//     } catch (error) {
//         console.error('Error in deleteWarehouse function:', error);
//         res.status(500).json({ error: error.message });
//         next(error);
//     }
// }

// Xóa kho
exports.deleteWarehouse = async (req, res, next) => { 
    const { id } = req.params;
    try {
        // Kiểm tra xem kho có tồn tại không
        const [warehouseCheck] = await db.pool.execute('SELECT * FROM warehouses WHERE id = ?', [id]);
        if (warehouseCheck.length === 0) {
            return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Kho không tồn tại', []));
        }

        // Lấy danh sách ID giao dịch trong kho
        const [stockTransactions] = await db.pool.execute('SELECT id FROM stock_transactions WHERE warehouse_id = ?', [id]);
        const stockTransactionIds = stockTransactions.map(tran => tran.id);

        // Nếu có giao dịch, xóa chi tiết giao dịch trước
        if (stockTransactionIds.length > 0) {
            await db.pool.query('DELETE FROM detail_transactions WHERE transaction_id IN (?)', [stockTransactionIds]);
            await db.pool.query('DELETE FROM stock_transactions WHERE warehouse_id = ?', [id]);
        }

        // Xóa sản phẩm trong kho
        await db.pool.query('DELETE FROM products WHERE warehouse_id = ?', [id]);

        // Cuối cùng, xóa kho
        await db.pool.execute('DELETE FROM warehouses WHERE id = ?', [id]);

        res.status(200).json({
            code: 200,
            status: 'success',
            message: 'Xóa kho thành công',
        });
    } catch (error) {
        console.error('Error in deleteWarehouse function:', error);
        return next(error); // Không gửi response nếu đã gọi next(error)
    }
}


exports.getListWarehouses = async (req, res, next) => { 
    try {
        const [rows] = await db.pool.execute('SELECT * FROM warehouses');

        const managerIds = rows.map(row => row.manager_id).filter(id => id !== null);
        
        let managerMap = {};
        if (managerIds.length > 0) {
            const placeholders = managerIds.map(() => '?').join(',');
            const [rowsManager] = await db.pool.query(
                `SELECT id, full_name, phone, address, email FROM users WHERE id IN (${placeholders})`,
                managerIds
            );

            managerMap = rowsManager.reduce((acc, row) => {
                acc[row.id] = {
                    id: row.id,
                    full_name: row.full_name,
                    phone: row.phone,
                    address: row.address,
                    email: row.email
                };
                return acc;
            }, {});
        }

        const warehouses = rows.map(row => ({
            id: row.id,
            name: row.name,
            address: row.address,
            description: row.description,
            manager_id: row.manager_id,
            manager_info: managerMap[row.manager_id] || null, // Nếu không có, trả về null
            createdAt: row.createdAt,
            updateAt: row.updateAt,
        }));

        res.status(200).json({
            code: 200,
            status: 'success',
            data: warehouses,
            message: 'Lấy danh sách kho thành công',
        });
       
    } catch (error) {
        console.error('Error in getWarehouses function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
};

