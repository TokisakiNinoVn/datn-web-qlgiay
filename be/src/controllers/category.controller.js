const db = require('../config/db.config');

//Thêm danh mục
exports.addCategory = async (req, res, next) => { 
    const { name } = req.body;

    try {
        const [nameCheck] = await db.pool.execute('SELECT * FROM categories WHERE name = ?', [name]);
        if (nameCheck.length > 0) {
            return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Tên danh mục đã tồn tại', []), req, res, next);
        }

        const createdAt = new Date();
        await db.pool.execute('INSERT INTO categories (name, createdAt) VALUES (?, ?)', [name, createdAt]);
        const category = { name, createdAt };

        res.status(201).json({
            code: 201,
            status: 'success',
            data: category,
            message: 'Thêm danh mục thành công',
        });
    } catch (error) {
        console.error('Error in addCategory function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
}

//Cập nhật thông tin danh mục
exports.updateCategory = async (req, res, next) => { 
    const { id, name} = req.body;
    try {
        const [supplierCheck] = await db.pool.execute('SELECT * FROM categories WHERE id = ?', [id]);
        if (supplierCheck.length === 0) {
            return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Nhà cung cấp không tồn tại', []), req, res, next);
        }

        const updatedAt = new Date();
        await db.pool.execute('UPDATE categories SET name = ?, updateAt = ? WHERE id = ?', [name, updatedAt, id]);
        const category = { id, name, updatedAt };
        res.status(200).json({
            code: 200,
            status: 'success',
            data: category,
            message: 'Cập nhật thông tin danh mục thành công',
        });
    } catch (error) {
        console.error('Error in updateCategory function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
}

//Xóa danh mục
exports.deleteCategory = async (req, res, next) => { 
    const { id } = req.params;
    try {
        const [supplierCheck] = await db.pool.execute('SELECT * FROM categories WHERE id = ?', [id]);
        if (supplierCheck.length === 0) {
            return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'failed', 'Nhà cung cấp không tồn tại', []), req, res, next);
        }

        await db.pool.execute('DELETE FROM categories WHERE id = ?', [id]);
        //Câp nhật lại danh mục cho sản phẩm
        await db.pool.execute('UPDATE products SET category_id = NULL WHERE category_id = ?', [id]);

        res.status(200).json({
            code: 200,
            status: 'success',
            message: 'Xóa danh mục thành công',
        });
    } catch (error) {
        console.error('Error in deleteCategory function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
}

// Lấy danh sách danh mục
exports.getAllCategorys = async (req, res, next) => { 
    try {
        // Lấy danh sách danh mục
        const [categories] = await db.pool.execute('SELECT * FROM categories');
        
        // Lấy số lượng sản phẩm của từng danh mục
        const [products] = await db.pool.execute('SELECT category_id, COUNT(*) AS total FROM products GROUP BY category_id');
        
        // Tạo một map để lưu số lượng sản phẩm theo category_id
        const productsMap = products.reduce((acc, product) => {
            acc[product.category_id] = product.total;
            return acc;
        }, {});

        // Gán số lượng sản phẩm vào danh mục tương ứng
        const categoriesWithProductCount = categories.map(category => ({
            ...category,
            total_products: productsMap[category.id] || 0,
        }));

        res.status(200).json({
            code: 200,
            status: 'success',
            data: categoriesWithProductCount,
            message: 'Lấy danh sách danh mục thành công',
        });
    } catch (error) {
        console.error('Error in getAllCategorys function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
};


//Lấy thông tin danh mục theo ID
exports.getCategoryById = async (req, res, next) => { 
    const { id } = req.params;
    try {
        const [rows] = await db.pool.execute('SELECT * FROM categories WHERE id = ?', [id]);
        const category = rows[0];

        if (!category) {
            return res.status(404).json({ message: "Nhà cung cấp không tồn tại" });
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//Lấy danh sách danh mục đơn giản
// exports.getListCategorysSimple = async (req, res, next) => { 
//     try {
//         const [categories] = await db.pool.execute('SELECT id, name FROM categories');
//         res.status(200).json({
//             code: 200,
//             status: 'success',
//             data: categories,
//             message: 'Lấy danh sách danh mục đơn giản thành công',
//         });
//     } catch (error) {
//         console.error('Error in getListCategorysSimple function:', error);
//         res.status(500).json({ error: error.message });
//         next(error);
//     }
// }