const db = require('../config/db.config');
  
// create new warehouse - tạo phiếu xuất kho mới
exports.create = async (req, res, next) => { 
    const { idUser, idWarehouse, total_product, total_price, products, customer_name, customer_phone } = req.body;
    // console.log(req.body);
    try {
        // Tạo mã code 6 số làm mã phiếu xuất kho
        const code = Math.floor(100000 + Math.random() * 900000);
        let sql = `
            INSERT INTO stock_transactions (invoice_code, created_by, warehouse_id, transaction_type, transaction_status, total_product, total_price, customer_name, customer_phone, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `; 
        
        // Lưu thông tin phiếu xuất kho vào bảng stock_transactions
        await db.pool.execute(sql, [code, idUser, idWarehouse, 'Xuất kho', 'Đã xử lý', total_product, total_price, customer_name, customer_phone]);

        const timeNow = new Date().toISOString().slice(0, 19).replace('T', ' ');
        // Cập nhật số lượng sản phẩm trong kho
        for (let i = 0; i < products.length; i++) {
            // await db.pool.execute('UPDATE products SET stock_quantity = stock_quantity - ?, last_sale = ? WHERE id = ?', [products[i].quantity, products[i].id, timeNow]);
            // for (let i = 0; i < products.length; i++) {
                await db.pool.execute('UPDATE products SET stock_quantity = stock_quantity - ?, last_sale = ? WHERE id = ?', [products[i].quantity, timeNow, products[i].id]);
        }

        // Lưu thông tin sản phẩm vào bảng detail_transactions
        const sqlDetail = `
            INSERT INTO detail_transactions (transaction_id, product_id, quantity, price_per_unit, total)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        // Lấy id của phiếu xuất kho vừa tạo
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

        res.status(201).json({ message: 'Warehouse entry created successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}


// get all warehouse entries - lấy danh sách tất cả các phiếu xuất kho
// exports.getAll = async (req, res, next) => {
//     try {
//         const sql = `
//             SELECT st.*, u.full_name AS created_by 
//             FROM stock_transactions st
//             LEFT JOIN users u ON st.created_by = u.id
//             WHERE st.transaction_type = 'Xuất kho'
//         `;
//         const [warehouses] = await db.pool.execute(sql);
//         console.log(warehouses);

//         res.status(200).json(warehouses);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//         console.log(error);
//     }
// }

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
                WHERE st.transaction_type = 'Xuất kho'
            `;
            [warehousesEntries] = await db.pool.execute(sql);
        } else {
            const sql = `
                SELECT st.*, u.full_name AS created_by 
                FROM stock_transactions st
                LEFT JOIN users u ON st.created_by = u.id
                WHERE st.transaction_type = 'Xuất kho' AND st.warehouse_id = ?
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

// get warehouse entry by id - lấy phiếu xuất kho theo id
exports.getById = async (req, res, next) => {
    const id = req.params.id;
    try {
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

        // lấy ra tên kho
        const [warehouse] = await db.pool.execute('SELECT name FROM warehouses WHERE id = ?', [transaction[0].warehouse_id]);

        // gán tên nhà cung cấp và tên kho vào transaction
        // transaction[0].supplier_name = supplier.length ? supplier[0].name : 'Unknown supplier';
        transaction[0].warehouse_name = warehouse.length ? warehouse[0].name : 'Unknown warehouse';

        // lấy ra chi tiết phiếu xuất kho
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

// Xóa phiếu xuất kho
exports.delete = async (req, res, next) => {
    const id = req.params.id;
    try {
        // Kiểm tra xem phiếu xuất kho có tồn tại không
        const [transaction] = await db.pool.execute('SELECT * FROM stock_transactions WHERE id = ?', [id]);
        if (!transaction.length) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Xóa chi tiết phiếu xuất kho
        await db.pool.execute('DELETE FROM detail_transactions WHERE transaction_id = ?', [id]);
        // Xóa phiếu xuất kho
        await db.pool.execute('DELETE FROM stock_transactions WHERE id = ?', [id]);

        res.status(200).json({ message: 'Warehouse entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
};