const db = require('../config/db.config');
const { HTTP_STATUS } = require('../constants/status-code.js');
const AppError = require('../utils/app-error.js');

//Thêm nhà cung cấp
exports.addSupplier = async (req, res, next) => { 
    const warehouseId = req.user.warehouses[0];
    const { name, contact_person, phone, email, address, warehouse_id } = req.body;
    const role = req.user.role;

    try {
        if (role === 'admin') {
            const [nameCheck] = await db.pool.execute('SELECT * FROM suppliers WHERE name = ? AND warehouse_id = ?', [name, warehouse_id]);
            if (nameCheck.length > 0) {
                return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Tên nhà cung cấp đã tồn tại', []), req, res, next);
            }

            const createdAt = new Date();
            await db.pool.execute('INSERT INTO suppliers (name, warehouse_id, contact_person, phone, email, address, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, warehouse_id, contact_person, phone, email, address, createdAt]);
            // const supplier = { name, contact_person, phone, email, address, createdAt };
            
            res.status(201).json({
                code: 201,
                status: 'success',
                // data: supplier,
                message: 'Thêm nhà cung cấp thành công',
            });
        } else {
            const [nameCheck] = await db.pool.execute('SELECT * FROM suppliers WHERE name = ? AND warehouse_id = ?', [name, warehouseId]);
            if (nameCheck.length > 0) {
                return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Tên nhà cung cấp đã tồn tại', []), req, res, next);
            }

            const createdAt = new Date();
            await db.pool.execute('INSERT INTO suppliers (name, warehouse_id, contact_person, phone, email, address, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, warehouseId, contactPerson, phone, email, address, createdAt]);
            const supplier = { name, contactPerson, phone, email, address, createdAt };

            res.status(201).json({
                code: 201,
                status: 'success',
                data: supplier,
                message: 'Thêm nhà cung cấp thành công',
            });
        }
    } catch (error) {
        console.error('Error in addSupplier function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
}

//Cập nhật thông tin nhà cung cấp
exports.updateSupplier = async (req, res, next) => { 
    const { id, name, contactPerson, phone, email, address, warehouse_id } = req.body;
    const warehouseId = req.user.warehouses[0];
    // const { name, contact_person, phone, email, address, warehouse_id } = req.body;
    const role = req.user.role;
    try {
        if (role === 'admin') { 
            // Kiểm tra nhà cung cấp có tồn tại không
            const [supplierCheck] = await db.pool.execute('SELECT * FROM suppliers WHERE id = ?', [id]);
            if (supplierCheck.length === 0) {
                return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Nhà cung cấp không tồn tại', []), req, res, next);
            }

            // Kiểm tra tên nhà cung cấp đã tồn tại chưa
            const [nameCheck] = await db.pool.execute('SELECT * FROM suppliers WHERE name = ? AND warehouse_id = ? AND id != ?', [name, warehouse_id, id]);
            if (nameCheck.length > 0) {
                return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Tên nhà cung cấp đã tồn tại', []), req, res, next);
            }

            const updatedAt = new Date();
            await db.pool.execute('UPDATE suppliers SET name = ?, contact_person = ?, phone = ?, email = ?, address = ?, updateAt = ? WHERE id = ?', [name, contactPerson, phone, email, address, updatedAt, id]);
            const supplier = { id, name, contactPerson, phone, email, address, updatedAt };
            res.status(200).json({
                code: 200,
                status: 'success',
                data: supplier,
                message: 'Cập nhật thông tin nhà cung cấp thành công',
            });
        } else {
            const [supplierCheck] = await db.pool.execute('SELECT * FROM suppliers WHERE id = ?', [id]);
            if (supplierCheck.length === 0) {
                return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Nhà cung cấp không tồn tại', []), req, res, next);
            }

            // Kiểm tra tên nhà cung cấp đã tồn tại chưa
            const [nameCheck] = await db.pool.execute('SELECT * FROM suppliers WHERE name = ? AND warehouse_id = ? AND id != ?', [name, warehouseId, id]);
            if (nameCheck.length > 0) {
                return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Tên nhà cung cấp đã tồn tại', []), req, res, next);
            }
    
            const updatedAt = new Date();
            await db.pool.execute('UPDATE suppliers SET name = ?, contact_person = ?, phone = ?, email = ?, address = ?, updateAt = ? WHERE id = ?', [name, contactPerson, phone, email, address, updatedAt, id]);
            const supplier = { id, name, contactPerson, phone, email, address, updatedAt };
            res.status(200).json({
                code: 200,
                status: 'success',
                data: supplier,
                message: 'Cập nhật thông tin nhà cung cấp thành công',
            });
        }
    } catch (error) {
        console.error('Error in updateSupplier function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
}

//Xóa nhà cung cấp
exports.deleteSupplier = async (req, res, next) => { 
    const { id } = req.params;
    try {
        const [supplierCheck] = await db.pool.execute('SELECT * FROM suppliers WHERE id = ?', [id]);
        if (supplierCheck.length === 0) {
            return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Nhà cung cấp không tồn tại', []), req, res, next);
        }

        await db.pool.execute('DELETE FROM suppliers WHERE id = ?', [id]);
        //Cập nhật lại các sản phẩm có nhà cung cấp này
        await db.pool.execute('UPDATE products SET supplier_id = NULL WHERE supplier_id = ?', [id]);
        res.status(200).json({
            code: 200,
            status: 'success',
            message: 'Xóa nhà cung cấp thành công',
        });
    } catch (error) {
        console.error('Error in deleteSupplier function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
}

//Lấy danh sách nhà cung cấp
// exports.getAllSuppliers = async (req, res, next) => { 
//     try {
//         const [suppliers] = await db.pool.execute('SELECT * FROM suppliers');
//         res.status(200).json({
//             code: 200,
//             status: 'success',
//             data: suppliers,
//             message: 'Lấy danh sách nhà cung cấp thành công',
//         });
//     } catch (error) {
//         console.error('Error in getListSuppliers function:', error);
//         res.status(500).json({ error: error.message });
//         next(error);
//     }
// }
// Lấy danh sách nhà cung cấp
exports.getAllSuppliers = async (req, res, next) => { 
    const { role, warehouses } = req.user;

    try {
        let suppliersWithProductCount;

        if (role === 'admin') {
            // Lấy danh sách nhà cung cấp
            const [suppliers] = await db.pool.execute('SELECT * FROM suppliers');
        
            // Lấy số lượng sản phẩm của từng nhà cung cấp
            const [products] = await db.pool.execute('SELECT supplier_id, COUNT(*) AS total FROM products GROUP BY supplier_id');
        
            // Tạo một map để lưu số lượng sản phẩm theo supplier_id
            const productsMap = products.reduce((acc, product) => {
                acc[product.supplier_id] = product.total;
                return acc;
            }, {});

            // Gán số lượng sản phẩm vào nhà cung cấp tương ứng
            suppliersWithProductCount = suppliers.map(supplier => ({
                ...supplier,
                total_products: productsMap[supplier.id] || 0,
            }));
        } else { 
            const [suppliers] = await db.pool.execute('SELECT * FROM suppliers WHERE warehouse_id = ?', [warehouses[0]]);
            
            const [products] = await db.pool.execute('SELECT supplier_id, COUNT(*) AS total FROM products WHERE warehouse_id = ? GROUP BY supplier_id', [warehouses[0]]);
            const productsMap = products.reduce((acc, product) => {
                acc[product.supplier_id] = product.total;
                return acc;
            }, {});
            
            // Gán số lượng sản phẩm vào nhà cung cấp tương ứng
            suppliersWithProductCount = suppliers.map(supplier => ({
                ...supplier,
                total_products: productsMap[supplier.id] || 0,
            }));
        }

        res.status(200).json({
            code: 200,
            status: 'success',
            data: suppliersWithProductCount,
            message: 'Lấy danh sách nhà cung cấp thành công',
        });
    } catch (error) {
        console.error('Error in getAllSuppliers function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
};
//Lấy thông tin nhà cung cấp theo ID
exports.getSupplierById = async (req, res, next) => { 
    const { id } = req.params;
    try {
        const [rows] = await db.pool.execute('SELECT * FROM suppliers WHERE id = ?', [id]);
        const supplier = rows[0];

        if (!supplier) {
            return res.status(404).json({ message: "Nhà cung cấp không tồn tại" });
        }

        res.json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//Lấy danh sách nhà cung cấp đơn giản
exports.getListSuppliersSimple = async (req, res, next) => { 
    try {
        const [suppliers] = await db.pool.execute('SELECT id, name FROM suppliers');
        res.status(200).json({
            code: 200,
            status: 'success',
            data: suppliers,
            message: 'Lấy danh sách nhà cung cấp đơn giản thành công',
        });
    } catch (error) {
        console.error('Error in getListSuppliersSimple function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
}