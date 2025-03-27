const db = require('../config/db.config');
  
// create new warehouse - tạo phiếu nhập kho mới
exports.create = async (req, res, next) => { 
    const { idUser, idSupplier, idWarehouse, total_product, total_price, products, isReturn } = req.body;
    // console.log(req.body);
    try {
        // Tạo mã code 6 số làm mã phiếu nhập kho
        const code = Math.floor(100000 + Math.random() * 900000);
        let sql;
        if (isReturn) { 
            sql = `
                INSERT INTO stock_transactions (invoice_code, created_by, supplier_id, warehouse_id, is_returns, transaction_type, transaction_status, total_product, total_price, createdAt)
                VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, NOW())
            `;
        } else {
            sql = `
                INSERT INTO stock_transactions (invoice_code, created_by, supplier_id, warehouse_id, transaction_type, transaction_status, total_product, total_price, createdAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `; 
        }
        
        // Lưu thông tin phiếu nhập kho vào bảng stock_transactions
        await db.pool.execute(sql, [code, idUser, idSupplier, idWarehouse, 'Nhập kho', 'Đã xử lý', total_product, total_price]);

        // Cập nhật số lượng sản phẩm trong kho
        for (let i = 0; i < products.length; i++) {
            await db.pool.execute('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?', [products[i].quantity, products[i].id]);
        }

        // Lưu thông tin sản phẩm vào bảng detail_transactions
        const sqlDetail = `
            INSERT INTO detail_transactions (transaction_id, product_id, quantity, price_per_unit, total)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        // Lấy id của phiếu nhập kho vừa tạo
        const [transaction] = await db.pool.execute('SELECT id FROM stock_transactions WHERE invoice_code = ?', [code]);
        if (transaction.length > 0) {
            const transactionId = transaction[0].id;

            // Lưu thông tin từng sản phẩm vào bảng detail_transactions
            for (let i = 0; i < products.length; i++) {
                await db.pool.execute(sqlDetail, [transactionId, products[i].id, products[i].quantity, products[i].price_per_unit, products[i].total]);
            }
        } else {
            throw new Error('Transaction not found');
        }

        res.status(201).json({
            code: 201,
            status: 'success',
            message: 'Warehouse entry created successfully'
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}


// get all warehouse entries - lấy danh sách tất cả các phiếu nhập kho
exports.getAll = async (req, res, next) => {
    const { role, warehouses } = req.user;
    const warehouseId = warehouses[0];
    try {
        let warehousesEntries;
        if (role === 'admin') {
            const sql = `
                SELECT st.*, u.full_name AS created_by 
                FROM stock_transactions st
                LEFT JOIN users u ON st.created_by = u.id
                WHERE st.transaction_type = 'Nhập kho'
            `;
            [warehousesEntries] = await db.pool.execute(sql);
        } else {
            const sql = `
                SELECT st.*, u.full_name AS created_by 
                FROM stock_transactions st
                LEFT JOIN users u ON st.created_by = u.id
                WHERE st.transaction_type = 'Nhập kho' AND st.warehouse_id = ?
            `;
            [warehousesEntries] = await db.pool.execute(sql, [warehouseId]);            
        }

        res.status(200).json({
            code: 200,
            status: 'success',
            data: warehousesEntries,
            message: 'Lấy danh sách phiếu nhập kho thành công',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}

// get warehouse entry by id - lấy phiếu nhập kho theo id
exports.getById = async (req, res, next) => {
    const id = req.params.id;
    try {
        // tách hết câu lệnh sql ra ngoài để dễ debug
        // const sql = `
        // SELECT *
        // FROM stock_transactions WHERE id = ?
        // LEFT JOIN users u ON st.created_by = u.id`;
        // const [transaction] = await db.pool.execute(sql, [id]);
        const sql = `
            SELECT st.*, u.full_name AS person_created
            FROM stock_transactions st
            LEFT JOIN users u ON st.created_by = u.id
            WHERE st.id = ?`;
        const [transaction] = await db.pool.execute(sql, [id]);

        // Kiểm tra xem transaction có tồn tại không
        if (!transaction.length) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // lấy ra tên nhà cung cấp
        const [supplier] = await db.pool.execute('SELECT name FROM suppliers WHERE id = ?', [transaction[0].supplier_id]);
        // lấy ra tên kho
        const [warehouse] = await db.pool.execute('SELECT name FROM warehouses WHERE id = ?', [transaction[0].warehouse_id]);

        // gán tên nhà cung cấp và tên kho vào transaction
        transaction[0].supplier_name = supplier.length ? supplier[0].name : 'Unknown supplier';
        transaction[0].warehouse_name = warehouse.length ? warehouse[0].name : 'Unknown warehouse';

        // lấy ra chi tiết phiếu nhập kho
        const sqlDetail = `SELECT * FROM detail_transactions WHERE transaction_id = ?`;
        const [details] = await db.pool.execute(sqlDetail, [id]);

        // map cái product_id trong details qua bảng products để lấy ra tên sản phẩm
        const products = await Promise.all(details.map(async (detail) => {
            const [product] = await db.pool.execute('SELECT product_name FROM products WHERE id = ?', [detail.product_id]);
            return {
                ...detail,
                product_name: product.length ? product[0].product_name : 'Unknown product'
            };
        }));

        // gán danh sách sản phẩm vào transaction
        transaction[0].products = products;

        res.status(200).json({
            transaction: transaction[0],
            message: 'Warehouse entry retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
};

// Xóa phiếu nhập kho
exports.delete = async (req, res, next) => {
    const id = req.params.id;
    try {
        // Kiểm tra xem phiếu nhập kho có tồn tại không
        const [transaction] = await db.pool.execute('SELECT * FROM stock_transactions WHERE id = ?', [id]);
        if (!transaction.length) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Xóa chi tiết phiếu nhập kho
        await db.pool.execute('DELETE FROM detail_transactions WHERE transaction_id = ?', [id]);
        // Xóa phiếu nhập kho
        await db.pool.execute('DELETE FROM stock_transactions WHERE id = ?', [id]);

        res.status(200).json({
            code: 200,
            status: 'success',
            message: 'Warehouse entry deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
};