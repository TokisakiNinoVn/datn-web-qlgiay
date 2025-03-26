const db = require('../config/db.config');
const AppError = require('../utils/app-error.js');
const { HTTP_STATUS } = require('../constants/status-code.js');

//Thêm thương hiệu
exports.addBrand = async (req, res, next) => { 
    const { name, warehouse_id } = req.body;
    const warehouseId = req.user.warehouses[0];
    const role = req.user.role;
    try {
        if (role === 'admin') {
            const [nameCheck] = await db.pool.execute('SELECT * FROM brands WHERE name = ? AND warehouse_id = ?', [name, warehouse_id]);
            if (nameCheck.length > 0) {
                return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Tên thương hiệu đã tồn tại', []), req, res, next);
            }

            const createdAt = new Date();
            await db.pool.execute('INSERT INTO brands (name, warehouse_id, createdAt) VALUES (?, ?, ?)', [name, warehouse_id, createdAt]);
            const brand = { name, createdAt };
    
            res.status(201).json({
                code: 201,
                status: 'success',
                data: brand,
                message: 'Thêm thương hiệu thành công',
            });
            
        } else { 
            const [nameCheck] = await db.pool.execute('SELECT * FROM brands WHERE name = ? AND warehouse_id = ?', [name, warehouseId]);
            if (nameCheck.length > 0) {
                return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Tên thương hiệu đã tồn tại', []), req, res, next);
            }

            const createdAt = new Date();
            await db.pool.execute('INSERT INTO brands (name, warehouse_id, createdAt) VALUES (?, ?, ?)', [name, warehouseId,createdAt]);
            const brand = { name, createdAt };
    
            res.status(201).json({
                code: 201,
                status: 'success',
                data: brand,
                message: 'Thêm thương hiệu thành công',
            });
        }

    } catch (error) {
        console.error('Error in addBrand function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
}

//Cập nhật thông tin thương hiệu
exports.updateBrand = async (req, res, next) => { 
    const { id, name } = req.body;
    try {
        const [supplierCheck] = await db.pool.execute('SELECT * FROM brands WHERE id = ?', [id]);
        if (supplierCheck.length === 0) {
            return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Nhà cung cấp không tồn tại', []), req, res, next);
        }

        // kiểm tra trùng lặp tên thương hiệu
        const [nameCheck] = await db.pool.execute('SELECT * FROM brands WHERE name = ? AND id != ?', [name, id]);
        if (nameCheck.length > 0) {
            return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Tên thương hiệu đã tồn tại', []), req, res, next);
        }

        const updatedAt = new Date();
        await db.pool.execute('UPDATE brands SET name = ?, updateAt = ? WHERE id = ?', [name, updatedAt, id]);
        const brand = { id, name, updatedAt };
        res.status(200).json({
            code: 200,
            status: 'success',
            data: brand,
            message: 'Cập nhật thông tin thương hiệu thành công',
        });
    } catch (error) {
        console.error('Error in updateBrand function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
}

//Xóa thương hiệu
exports.deleteBrand = async (req, res, next) => { 
    const { id } = req.params;
    try {
        const [supplierCheck] = await db.pool.execute('SELECT * FROM brands WHERE id = ?', [id]);
        if (supplierCheck.length === 0) {
            return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Nhà cung cấp không tồn tại', []), req, res, next);
        }

        await db.pool.execute('DELETE FROM brands WHERE id = ?', [id]);
        //Câp nhật lại thương hiệu cho sản phẩm
        await db.pool.execute('UPDATE products SET brand_id = NULL WHERE brand_id = ?', [id]);

        res.status(200).json({
            code: 200,
            status: 'success',
            message: 'Xóa thương hiệu thành công',
        });
    } catch (error) {
        console.error('Error in deleteBrand function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
}

// Lấy danh sách thương hiệu
exports.getAllBrands = async (req, res, next) => { 
    const { role, warehouses } = req.user;
    
    try {
        let brandsWithProductCount;

        if (role === 'admin') {
            // Lấy danh sách thương hiệu
            const [brands] = await db.pool.execute('SELECT * FROM brands');
        
            // Lấy số lượng sản phẩm của từng thương hiệu
            const [products] = await db.pool.execute('SELECT brand_id, COUNT(*) AS total FROM products GROUP BY brand_id');
        
            // Tạo một map để lưu số lượng sản phẩm theo brand_id
            const productsMap = products.reduce((acc, product) => {
                acc[product.brand_id] = product.total;
                return acc;
            }, {});

            // Gán số lượng sản phẩm vào thương hiệu tương ứng
            brandsWithProductCount = brands.map(brand => ({
                ...brand,
                total_products: productsMap[brand.id] || 0,
            }));
        } else { 
            const [brands] = await db.pool.execute('SELECT * FROM brands WHERE warehouse_id = ?', [warehouses[0]]);
            
            const [products] = await db.pool.execute('SELECT brand_id, COUNT(*) AS total FROM products WHERE warehouse_id = ? GROUP BY brand_id', [warehouses[0]]);
            const productsMap = products.reduce((acc, product) => {
                acc[product.brand_id] = product.total;
                return acc;
            }, {});
            
            // Gán số lượng sản phẩm vào thương hiệu tương ứng
            brandsWithProductCount = brands.map(brand => ({
                ...brand,
                total_products: productsMap[brand.id] || 0,
            }));
        }

        res.status(200).json({
            code: 200,
            status: 'success',
            data: brandsWithProductCount,
            message: 'Lấy danh sách thương hiệu thành công',
        });
    } catch (error) {
        console.error('Error in getAllBrands function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
};


//Lấy thông tin thương hiệu theo ID
exports.getBrandById = async (req, res, next) => { 
    const { id } = req.params;
    try {
        const [rows] = await db.pool.execute('SELECT * FROM brands WHERE id = ?', [id]);
        const brand = rows[0];

        if (!brand) {
            return res.status(404).json({ message: "Nhà cung cấp không tồn tại" });
        }

        res.json(brand);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//Lấy danh sách thương hiệu đơn giản
// exports.getListBrandsSimple = async (req, res, next) => {
//     try {
//         const [brands] = await db.pool.execute('SELECT id, name FROM brands');
//         res.status(200).json({
//             code: 200,
//             status: 'success',
//             data: brands,
//             message: 'Lấy danh sách thương hiệu đơn giản thành công',
//         });
//     } catch (error) {
//         console.error('Error in getListBrandsSimple function:', error);
//         res.status(500).json({ error: error.message });
//         next(error);
//     }
// }

// lấy id, name của tất cả thương hiệu
exports.getSimpleBrands = async (req, res, next) => { 
    try {
        const [brands] = await db.pool.execute('SELECT id, name FROM brands');
        res.status(200).json({
            code: 200,
            status: 'success',
            data: brands,
            message: 'Lấy danh sách thương hiệu thành công',
        });
    } catch (error) {
        console.error('Error in getBasicBrands function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
}