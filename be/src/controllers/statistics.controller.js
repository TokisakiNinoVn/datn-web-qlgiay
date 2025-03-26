//statistics controller - Lấy các data kiểu thống kê để hiển thị trên trang chủ dạng biểu đồ
const db = require('../config/db.config');

exports.getGeneralInfo = async (req, res, next) => {
    const role = req.user.role;
    const warehouses = req.user.warehouses[0];
    try {

        if (role === 'admin') { 
            // Top 5 sản phẩm xuất kho nhiều nhất
            const [topExportedProducts] = await db.pool.execute(`
                SELECT dt.product_id, p.product_name, SUM(dt.quantity) AS totalExported
                FROM detail_transactions dt
                JOIN stock_transactions st ON dt.transaction_id = st.id
                JOIN products p ON dt.product_id = p.id
                WHERE st.transaction_type = 'Xuất kho'
                GROUP BY dt.product_id, p.product_name
                ORDER BY totalExported DESC
                LIMIT 5
            `) || [[]];
    
            // Top 5 sản phẩm nhập kho nhiều nhất
            const [topImportedProducts] = await db.pool.execute(`
                SELECT dt.product_id, p.product_name, SUM(dt.quantity) AS totalImported
                FROM detail_transactions dt
                JOIN stock_transactions st ON dt.transaction_id = st.id
                JOIN products p ON dt.product_id = p.id
                WHERE st.transaction_type = 'Nhập kho'
                GROUP BY dt.product_id, p.product_name
                ORDER BY totalImported DESC
                LIMIT 5
            `) || [[]];
    
            // Danh sách sản phẩm tồn kho (không có xuất kho trong 30 ngày gần nhất)
            const [stockProducts] = await db.pool.execute(`
                SELECT id, product_name, stock_quantity
                FROM products
                WHERE last_sale IS NULL OR last_sale < DATE_SUB(NOW(), INTERVAL 30 DAY)
            `) || [[]];
    
            // Danh sách sản phẩm hết hàng (tồn kho = 0)
            const [outOfStockProducts] = await db.pool.execute(`
                SELECT id, product_name
                FROM products
                WHERE stock_quantity = 0
            `) || [[]];
    
            // Danh sách sản phẩm sắp hết hàng (stock_quantity < 10)
            const [lowStockProducts] = await db.pool.execute(`
                SELECT id, product_name, stock_quantity
                FROM products
                WHERE stock_quantity > 0 AND stock_quantity < 10
            `) || [[]];
    
            // Tổng giá trị nhập và xuất kho trong 6 tháng gần nhất
            const [stockSummary] = await db.pool.execute(`
                SELECT 
                    DATE_FORMAT(createdAt, '%Y-%m') AS monthYear, 
                    SUM(CASE WHEN transaction_type = 'Nhập kho' THEN total_price ELSE 0 END) AS totalImportPrice,
                    SUM(CASE WHEN transaction_type = 'Xuất kho' THEN total_price ELSE 0 END) AS totalExportPrice
                FROM stock_transactions
                WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                GROUP BY monthYear
                ORDER BY monthYear ASC
            `) || [[]];
    
            res.status(200).json({
                code: 200,
                status: 'success',
                data: {
                    topExportedProducts: topExportedProducts.length ? topExportedProducts : [],
                    topImportedProducts: topImportedProducts.length ? topImportedProducts : [],
                    stockProducts: stockProducts.length ? stockProducts : [],
                    outOfStockProducts: outOfStockProducts.length ? outOfStockProducts : [],
                    lowStockProducts: lowStockProducts.length ? lowStockProducts : [],
                    stockSummary: stockSummary.length ? stockSummary : []
                },
                message: 'Lấy thông tin thống kê thành công',
            });
        }
        else { 
            // Top 5 sản phẩm xuất kho nhiều nhất
            const [topExportedProducts] = await db.pool.execute(`
                SELECT dt.product_id, p.product_name, SUM(dt.quantity) AS totalExported
                FROM detail_transactions dt
                JOIN stock_transactions st ON dt.transaction_id = st.id
                JOIN products p ON dt.product_id = p.id
                WHERE st.transaction_type = 'Xuất kho' AND st.warehouse_id = ${warehouses}
                GROUP BY dt.product_id, p.product_name
                ORDER BY totalExported DESC
                LIMIT 5
            `) || [[]];
    
            // Top 5 sản phẩm nhập kho nhiều nhất
            const [topImportedProducts] = await db.pool.execute(`
                SELECT dt.product_id, p.product_name, SUM(dt.quantity) AS totalImported
                FROM detail_transactions dt
                JOIN stock_transactions st ON dt.transaction_id = st.id
                JOIN products p ON dt.product_id = p.id
                WHERE st.transaction_type = 'Nhập kho' AND st.warehouse_id = ${warehouses}
                GROUP BY dt.product_id, p.product_name
                ORDER BY totalImported DESC
                LIMIT 5
            `) || [[]];
    
            // Danh sách sản phẩm tồn kho (không có xuất kho trong 30 ngày gần nhất)
            const [stockProducts] = await db.pool.execute(`
                SELECT id, product_name, stock_quantity
                FROM products
                WHERE last_sale IS NULL OR last_sale < DATE_SUB(NOW(), INTERVAL 30 DAY) AND warehouse_id = ${warehouses}
            `) || [[]];
    
            // Danh sách sản phẩm hết hàng (tồn kho = 0)
            const [outOfStockProducts] = await db.pool.execute(`
                SELECT id, product_name
                FROM products
                WHERE stock_quantity = 0 AND warehouse_id = ${warehouses}
            `) || [[]];
    
            // Danh sách sản phẩm sắp hết hàng (stock_quantity < 10)
            const [lowStockProducts] = await db.pool.execute(`
                SELECT id, product_name, stock_quantity
                FROM products
                WHERE stock_quantity > 0 AND stock_quantity < 10 AND warehouse_id = ${warehouses}
            `) || [[]];
    
            // Tổng giá trị nhập và xuất kho trong 6 tháng gần nhất
            const [stockSummary] = await db.pool.execute(`
                SELECT 
                    DATE_FORMAT(createdAt, '%Y-%m') AS monthYear, 
                    SUM(CASE WHEN transaction_type = 'Nhập kho' THEN total_price ELSE 0 END) AS totalImportPrice,
                    SUM(CASE WHEN transaction_type = 'Xuất kho' THEN total_price ELSE 0 END) AS totalExportPrice
                FROM stock_transactions
                WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH) AND warehouse_id = ${warehouses}
                GROUP BY monthYear
                ORDER BY monthYear ASC
            `) || [[]];

            res.status(200).json({
                code: 200,
                status: 'success',
                data: {
                    topExportedProducts: topExportedProducts.length ? topExportedProducts : [],
                    topImportedProducts: topImportedProducts.length ? topImportedProducts : [],
                    stockProducts: stockProducts.length ? stockProducts : [],
                    outOfStockProducts: outOfStockProducts.length ? outOfStockProducts : [],
                    lowStockProducts: lowStockProducts.length ? lowStockProducts : [],
                    stockSummary: stockSummary.length ? stockSummary : []
                },
                message: 'Lấy thông tin thống kê thành công',
            });
        }
    } catch (error) {
        console.error('Error in getGeneralInfo function:', error);
        res.status(500).json({ error: error.message });
        next(error);
    }
};


// exports.getGeneralInfo = async (req, res, next) => {
//     try {
//         // Top 5 sản phẩm xuất kho nhiều nhất
//         const topExportedProducts = await db.pool.execute(`
//             SELECT dt.product_id, p.product_name, SUM(dt.quantity) AS totalExported
//             FROM detail_transactions dt
//             JOIN stock_transactions st ON dt.transaction_id = st.id
//             JOIN products p ON dt.product_id = p.id
//             WHERE st.transaction_type = 'Xuất kho'
//             GROUP BY dt.product_id, p.product_name
//             ORDER BY totalExported DESC
//             LIMIT 5
//         `);

//         // Top 5 sản phẩm nhập kho nhiều nhất
//         const topImportedProducts = await db.pool.execute(`
//             SELECT dt.product_id, p.product_name, SUM(dt.quantity) AS totalImported
//             FROM detail_transactions dt
//             JOIN stock_transactions st ON dt.transaction_id = st.id
//             JOIN products p ON dt.product_id = p.id
//             WHERE st.transaction_type = 'Nhập kho'
//             GROUP BY dt.product_id, p.product_name
//             ORDER BY totalImported DESC
//             LIMIT 5
//         `);

//         // Danh sách sản phẩm tồn kho (không có xuất kho trong 30 ngày gần nhất)
//         const stockProducts = await db.pool.execute(`
//             SELECT p.id, p.product_name, p.stock_quantity
//             FROM products p
//             WHERE p.id NOT IN (
//                 SELECT DISTINCT dt.product_id
//                 FROM detail_transactions dt
//                 JOIN stock_transactions st ON dt.transaction_id = st.id
//                 WHERE st.transaction_type = 'Xuất kho' AND st.createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
//             )
//         `);

//         // Danh sách sản phẩm hết hàng (tồn kho = 0)
//         const outOfStockProducts = await db.pool.execute(`
//             SELECT id, product_name
//             FROM products
//             WHERE stock_quantity = 0
//         `);

//         // Tổng giá trị nhập và xuất kho trong 6 tháng gần nhất
//         const stockSummary = await db.pool.execute(`
//             SELECT 
//                 DATE_FORMAT(createdAt, '%Y-%m') AS monthYear, 
//                 SUM(CASE WHEN transaction_type = 'Nhập kho' THEN total_price ELSE 0 END) AS totalImportPrice,
//                 SUM(CASE WHEN transaction_type = 'Xuất kho' THEN total_price ELSE 0 END) AS totalExportPrice
//             FROM stock_transactions
//             WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
//             GROUP BY monthYear
//             ORDER BY monthYear ASC
//         `);

//         res.status(200).json({
//             code: 200,
//             status: 'success',
//             data: {
//                 topExportedProducts,
//                 topImportedProducts,
//                 stockProducts,
//                 outOfStockProducts,
//                 stockSummary
//             },
//             message: 'Lấy thông tin thống kê thành công',
//         });
//     } catch (error) {
//         console.error('Error in getGeneralInfo function:', error);
//         res.status(500).json({ error: error.message });
//         next(error);
//     }
// };


// // Lấy các thông tin chung
// exports.getGeneralInfo = async (req, res, next) => {
//     const { monthNow, yearNow } = req.query;
//     try {
//         // bảng stock_transactions:
//         // `id` int NOT NULL AUTO_INCREMENT,
//         // `invoice_code` int NOT NULL DEFAULT '0' COMMENT 'Mã  hóa đơn gồm 6 số random',
//         // `created_by` int DEFAULT NULL,
//         // `supplier_id` int DEFAULT NULL,
//         // `warehouse_id` int DEFAULT NULL,
//         // `transaction_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'Nhập kho hoặc Xuất kho',
//         // `transaction_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
//         // `is_returns` int DEFAULT NULL COMMENT '1: trả hàng, 0: không trả hàng',
//         // `total_product` int DEFAULT NULL,
//         // `total_price` int DEFAULT NULL,
//         // `status` int DEFAULT NULL,
//         // `customer_name` varchar(255) DEFAULT NULL,
//         // `customer_phone` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
//         // `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,


//         // bảng CREATE TABLE IF NOT EXISTS `detail_transactions` (
//         //   `id` int NOT NULL AUTO_INCREMENT,
//         //   `transaction_id` int DEFAULT NULL,
//         //   `product_id` int DEFAULT NULL,
//         //   `quantity` int DEFAULT '1',
//         //   `price_per_unit` bigint DEFAULT NULL,
//         //   `import_price` bigint DEFAULT NULL,
//         //   `total` bigint DEFAULT NULL,
//         //   `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
//         //   PRIMARY KEY (`id`)
//         // ) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

//         // bảng CREATE TABLE IF NOT EXISTS `products` (
//         //   `id` int NOT NULL AUTO_INCREMENT,
//         //   `warehouse_id` int DEFAULT NULL,
//         //   `supplier_id` int DEFAULT NULL,
//         //   `category_id` int DEFAULT NULL,
//         //   `brand_id` int DEFAULT NULL,
//         //   `product_name` varchar(255) NOT NULL,
//         //   `price` bigint NOT NULL DEFAULT '0',
//         //   `stock_quantity` int DEFAULT '0',
//         //   `size` varchar(50) DEFAULT NULL,
//         //   `color` varchar(50) DEFAULT NULL,
//         //   `description` text,
//         //   `material` varchar(100) DEFAULT NULL,
//         //   `discount` bigint DEFAULT NULL,
//         //   `status` int DEFAULT '1',
//         //   `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
//         //   `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         //   `image_url` varchar(255) DEFAULT NULL,
//         //   `discount_type` varchar(50) DEFAULT 'fixed',
//         //   PRIMARY KEY (`id`)
//         // ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

        
//         // Lấy tổng giá trị nhập kho của 5 tháng gần nhất
//         const totalImportPrice = await db.pool.execute(
//             `SELECT SUM(total_price) AS totalImportPrice FROM stock_transactions WHERE transaction_type = 'Nhập kho' AND MONTH(createdAt) = ${monthNow} AND YEAR(createdAt) = ${yearNow}`
//         );
//         // Lấy tổng giá trị xuất kho của 5 tháng gần nhất
//         const totalExportPrice = await db.pool.execute(
//             `SELECT SUM(total_price) AS totalExportPrice FROM stock_transactions WHERE transaction_type = 'Xuất kho' AND MONTH(createdAt) = ${monthNow} AND YEAR(createdAt) = ${yearNow}`
//         );

//         // Lấy số đơn hàng nhập kho có is_returns = 1
//         const totalImportReturns = await db.pool.execute(
//             `SELECT COUNT(*) AS totalImportReturns FROM stock_transactions WHERE transaction_type = 'Nhập kho' AND is_returns = 1 AND MONTH(createdAt) = ${monthNow} AND YEAR(createdAt) = ${yearNow}`
//         );


//         res.status(200).json({
//             code: 200,
//             status: 'success',
//             data: {
                
//             },
//             message: 'Lấy thông tin chung thành công',
//         });
//     } catch (error) {
//         console.error('Error in getGeneralInfo function:', error);
//         res.status(500).json({ error: error.message });
//         next(error);
//     }
// }