const db = require('../config/db.config');
const { HTTP_STATUS } = require('../constants/status-code.js');
const AppError = require('../utils/app-error.js');
//Thêm sản phẩm
exports.addProduct = async (req, res, next) => { 
    const {
        warehouseId,
        supplierId,
        categoryId,
        brandId,
        productName,
        price,
        stockQuantity,
        size,
        color,
        description,
        material,
        discount,
        imageUrl,
        discountType
    } = req.body;

    try {
        const [productCheck] = await db.pool.execute(
            'SELECT * FROM products WHERE product_name = ? AND warehouse_id = ? AND supplier_id = ? AND category_id = ? AND brand_id = ? AND price = ?',
            [productName, warehouseId, supplierId, categoryId, brandId, price]
        );
        if (productCheck.length > 0) {
            return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Sản phẩm đã tồn tại', []), req, res, next);
        }

        // Kiểm tra trùng lặp tên sản phẩm trong cùng 1 kho
        const [productCheckName] = await db.pool.execute(
            'SELECT * FROM products WHERE product_name = ? AND warehouse_id = ?', [productName, warehouseId]
        );
        if (productCheckName.length > 0) {
            return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Tên sản phẩm đã tồn tại', []), req, res, next);
        }

        const createdAt = new Date();
        const [result] = await db.pool.execute(`
            INSERT INTO products (warehouse_id, supplier_id, category_id, brand_id, product_name, price, stock_quantity, size, color, description, material, discount, image_url, discount_type, createdAt) 
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [warehouseId, supplierId, categoryId, brandId, productName, price, stockQuantity, size, color, description, material, discount, imageUrl, discountType, createdAt]
        );

        const [product] = await db.pool.execute('SELECT * FROM products WHERE id = ?', [result.insertId]);

        res.status(201).json({
            code: 201,
            status: 'success',
            data: product[0],
            message: 'Thêm sản phẩm thành công',
        });
    } catch (error) {
        console.error('Error in addProduct function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
};

// Lấy thông tin id, name của brands, categories, suppliers, warehouses
exports.getSimpleInfor = async (req, res, next) => { 
    const { role, warehouses } = req.user;
    const warehouseId = warehouses[0];
    try {
        if (role === 'admin') {
            const [brands] = await db.pool.execute('SELECT id, name FROM brands');
            const [categories] = await db.pool.execute('SELECT id, name FROM categories');
            const [suppliers] = await db.pool.execute('SELECT id, name FROM suppliers');
            const [warehouses] = await db.pool.execute('SELECT id, name FROM warehouses');
            res.status(200).json({
                code: 200,
                status: 'success',
                data: { brands, categories, suppliers, warehouses },
                message: 'Lấy thông tin thành công',
            });
            return
        }

        const [brands] = await db.pool.execute('SELECT id, name FROM brands where warehouse_id = ?', [warehouseId]);
        const [categories] = await db.pool.execute('SELECT id, name FROM categories where warehouse_id = ?', [warehouseId]);
        const [suppliers] = await db.pool.execute('SELECT id, name FROM suppliers where warehouse_id = ?', [warehouseId]);
        const [warehouses] = await db.pool.execute('SELECT id, name FROM warehouses');
        res.status(200).json({
            code: 200,
            status: 'success',
            data: { brands, categories, suppliers, warehouses },
            message: 'Lấy thông tin thành công',
        });
    } catch (error) {
        console.error('Error in getSimpleInfor function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
}

// Sửa thông tin sản phẩm
exports.updateProduct = async (req, res, next) => { 
    const { id, warehouseId, supplierId, categoryId, brandId, productName, price, stockQuantity, size, color, description, material, discount, imageUrl, discountType } = req.body;

    try {
        const [productCheck] = await db.pool.execute('SELECT * FROM products WHERE id = ?', [id]);
        if (productCheck.length === 0) {
            return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Sản phẩm không tồn tại', []), req, res, next);
        }

        // Kiểm tra trùng lặp tên sản phẩm
        const [productCheckName] = await db.pool.execute(
            'SELECT * FROM products WHERE product_name = ? AND id != ?', [productName, id]
        );
        if (productCheckName.length > 0) {
            return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Tên sản phẩm đã tồn tại', []), req, res, next);
        }
        const updatedAt = new Date();
        await db.pool.execute(
            'UPDATE products SET warehouse_id = ?, supplier_id = ?, category_id = ?, brand_id = ?, product_name = ?, price = ?, stock_quantity = ?, size = ?, color = ?, description = ?, material = ?, discount = ?, image_url = ?, updatedAt = ?, discount_type = ? WHERE id = ?',
            [warehouseId, supplierId, categoryId, brandId, productName, price, stockQuantity, size, color, description, material, discount, imageUrl, updatedAt, discountType, id]
        );

        const [product] = await db.pool.execute('SELECT * FROM products WHERE id = ?', [id]);

        res.status(200).json({
            code: 200,
            status: 'success',
            data: product[0],
            message: 'Cập nhật thông tin sản phẩm thành công',
        });
    } catch (error) {
        console.error('Error in updateProduct function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res, next) => { 
    const { id } = req.params;

    try {
        const [productCheck] = await db.pool.execute('SELECT * FROM products WHERE id = ?', [id]);
        if (productCheck.length === 0) {
            return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Sản phẩm không tồn tại', []), req, res, next);
        }

        await db.pool.execute('DELETE FROM products WHERE id = ?', [id]);

        res.status(200).json({
            code: 200,
            status: 'success',
            message: 'Xóa sản phẩm thành công',
        });
    } catch (error) {
        console.error('Error in deleteProduct function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
};

// // Lấy danh sách sản phẩm
// exports.getAllProducts = async (req, res, next) => { 
//     try {
//         const [products] = await db.pool.execute(`
//             SELECT 
//                 p.id, 
//                 p.product_name, 
//                 p.price, 
//                 p.stock_quantity, 
//                 p.size, 
//                 p.color, 
//                 p.description, 
//                 p.image_url, 
//                 p.material, 
//                 p.discount, 
//                 p.status, 
//                 p.createdAt, 
//                 p.updatedAt,
//                 w.name AS warehouse_name, 
//                 s.name AS supplier_name, 
//                 c.name AS category_name, 
//                 b.name AS brand_name
//             FROM products p
//             LEFT JOIN warehouses w ON p.warehouse_id = w.id
//             LEFT JOIN suppliers s ON p.supplier_id = s.id
//             LEFT JOIN categories c ON p.category_id = c.id
//             LEFT JOIN brands b ON p.brand_id = b.id
//         `);

//         res.status(200).json({
//             code: 200,
//             status: 'success',
//             data: products,
//             message: 'Lấy danh sách sản phẩm thành công',
//         });
//     } catch (error) {
//         console.error('Error in getAllProducts function:', error);
//         res.status(500).json({ 
//             code: 500,
//             status: 'error',
//             message: 'Có lỗi xảy ra khi lấy danh sách sản phẩm',
//             error: error.message 
//         });
//         next(error);
//     }
// };

// Lấy danh sách sản phẩm
exports.getAllProducts = async (req, res, next) => { 
    const { role, warehouses } = req.user;
    const warehouseId = warehouses[0];
    try {
        let products;
        if (role === 'admin') {
            products = await db.pool.execute(`
            SELECT 
                p.id, 
                p.product_name, 
                p.price, 
                p.stock_quantity, 
                p.size, 
                p.color, 
                p.description, 
                p.image_url, 
                p.material, 
                p.discount, 
                p.status, 
                p.createdAt, 
                p.updatedAt,
                w.name AS warehouse_name, 
                s.name AS supplier_name, 
                c.name AS category_name, 
                b.name AS brand_name
            FROM products p
            LEFT JOIN warehouses w ON p.warehouse_id = w.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN brands b ON p.brand_id = b.id
        `);
        } else {
            products = await db.pool.execute(`
                SELECT 
                    p.id, 
                    p.product_name, 
                    p.price, 
                    p.stock_quantity, 
                    p.size, 
                    p.color, 
                    p.description, 
                    p.image_url, 
                    p.material, 
                    p.discount, 
                    p.status, 
                    p.createdAt, 
                    p.updatedAt,
                    w.name AS warehouse_name, 
                    s.name AS supplier_name, 
                    c.name AS category_name, 
                    b.name AS brand_name
                FROM products p
                LEFT JOIN warehouses w ON p.warehouse_id = w.id
                LEFT JOIN suppliers s ON p.supplier_id = s.id
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN brands b ON p.brand_id = b.id
                WHERE p.warehouse_id IN (${warehouseId})
            `);
        }

        products.pop();

        products = products[0];

        res.status(200).json({
            code: 200,
            status: 'success',
            data: products,
            message: 'Lấy danh sách sản phẩm thành công',
        });
    } catch (error) {
        console.error('Error in getAllProducts function:', error);
        res.status(500).json({ 
            code: 500,
            status: 'error',
            message: 'Có lỗi xảy ra khi lấy danh sách sản phẩm',
            error: error.message 
        });
        next(error);
    }
};


// Lấy thông tin chi tiết của sản phẩm
exports.getProduct = async (req, res, next) => { 
    const { id } = req.params;

    try {
        const [product] = await db.pool.execute('SELECT * FROM products WHERE id = ?', [id]);
        if (product.length === 0) {
            return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Sản phẩm không tồn tại', []), req, res, next);
        }
        
        const [productDetail] = await db.pool.execute(`
            SELECT 
                p.id, 
                p.product_name, 
                p.warehouse_id,
                p.supplier_id,
                p.category_id,
                p.brand_id,
                p.price, 
                p.stock_quantity, 
                p.size, 
                p.color, 
                p.description, 
                p.image_url, 
                p.material, 
                p.discount, 
                p.status, 
                p.createdAt, 
                p.updatedAt,
                w.name AS warehouse_name, 
                s.name AS supplier_name, 
                c.name AS category_name, 
                b.name AS brand_name
            FROM products p
            LEFT JOIN warehouses w ON p.warehouse_id = w.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN brands b ON p.brand_id = b.id
            WHERE p.id = ?
        `, [id]);

        // Kiểm tra xem productDetail có dữ liệu hay không
        if (productDetail.length === 0) {
            return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Không tìm thấy chi tiết sản phẩm', []), req, res, next);
        }

        // Trả về đối tượng productDetail
        res.status(200).json({
            code: 200,
            status: 'success',
            data: productDetail[0], // Trả về đối tượng đầu tiên
            message: 'Lấy thông tin sản phẩm thành công',
        });
    } catch (error) {
        console.error('Error in getProduct function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
};

// Lấy 1 vài thông tin sản phẩm
exports.getSimpleProduct = async (req, res, next) => { 
    const { role, warehouses } = req.user;
    const warehouseId = warehouses[0];
    try {
        let products;
        if (role === 'admin') {
            products = await db.pool.execute(`
            SELECT 
                p.id, 
                p.product_name, 
                p.price, 
                p.stock_quantity, 
                p.image_url, 
                p.warehouse_id
            FROM products p
        `);
        } else {
            products = await db.pool.execute(`
                SELECT 
                    p.id, 
                    p.product_name, 
                    p.price, 
                    p.stock_quantity, 
                    p.image_url, 
                    p.warehouse_id
                FROM products p
                WHERE p.warehouse_id IN (${warehouseId})
            `);
        }

        products = products[0];

        res.status(200).json({
            code: 200,
            status: 'success',
            data: products,
            message: 'Lấy danh sách sản phẩm thành công',
        });
    } catch (error) {
        console.error('Error in getSomeProduct function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
};