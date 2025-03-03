-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for datn_qlgiay
CREATE DATABASE IF NOT EXISTS `datn_qlgiay` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `datn_qlgiay`;

-- Dumping structure for table datn_qlgiay.brands
CREATE TABLE IF NOT EXISTS `brands` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table datn_qlgiay.brands: ~7 rows (approximately)
DELETE FROM `brands`;
INSERT INTO `brands` (`id`, `name`, `createdAt`) VALUES
	(1, 'Nike', '2025-02-27 01:25:15'),
	(2, 'Adidas', '2025-02-27 01:25:15'),
	(3, 'Puma', '2025-02-27 01:25:15'),
	(4, 'Vans', '2025-02-27 01:25:15'),
	(5, 'Converse', '2025-02-27 01:25:15'),
	(6, 'Bitis', '2025-02-27 01:25:15'),
	(7, 'Dr. Martens', '2025-02-27 01:25:15');

-- Dumping structure for table datn_qlgiay.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table datn_qlgiay.categories: ~8 rows (approximately)
DELETE FROM `categories`;
INSERT INTO `categories` (`id`, `name`, `createdAt`, `updateAt`) VALUES
	(1, 'Giày thể thao', '2025-02-27 01:25:15', '2025-03-01 22:02:09'),
	(2, 'Giày da', '2025-02-27 01:25:15', '2025-03-01 22:02:10'),
	(3, 'Giày cao gót', '2025-02-27 01:25:15', '2025-03-01 22:02:11'),
	(4, 'Giày lười', '2025-02-27 01:25:15', '2025-03-01 22:02:12'),
	(5, 'Sandal', '2025-02-27 01:25:15', '2025-03-01 22:02:12'),
	(6, 'Boots', '2025-02-27 01:25:15', '2025-03-01 22:02:13'),
	(7, 'Dép', '2025-02-27 01:25:15', '2025-03-01 22:02:14');

-- Dumping structure for table datn_qlgiay.detail_transactions
CREATE TABLE IF NOT EXISTS `detail_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transaction_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `price_per_unit` decimal(10,2) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table datn_qlgiay.detail_transactions: ~5 rows (approximately)
DELETE FROM `detail_transactions`;
INSERT INTO `detail_transactions` (`id`, `transaction_id`, `product_id`, `quantity`, `price_per_unit`, `total_price`, `createdAt`) VALUES
	(1, 1, 1, 10, 2500000.00, 25000000.00, '2025-02-27 01:25:15'),
	(2, 2, 2, 5, 2200000.00, 11000000.00, '2025-02-27 01:25:15'),
	(3, 3, 3, 7, 1800000.00, 12600000.00, '2025-02-27 01:25:15'),
	(4, 4, 4, 3, 1500000.00, 4500000.00, '2025-02-27 01:25:15'),
	(5, 5, 5, 6, 2700000.00, 16200000.00, '2025-02-27 01:25:15');

-- Dumping structure for table datn_qlgiay.files
CREATE TABLE IF NOT EXISTS `files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `user_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table datn_qlgiay.files: ~0 rows (approximately)
DELETE FROM `files`;

-- Dumping structure for table datn_qlgiay.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `warehouse_id` int DEFAULT NULL,
  `supplier_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `brand_id` int DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int DEFAULT '0',
  `size` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `description` text,
  `material` varchar(100) DEFAULT NULL,
  `discount` decimal(5,2) DEFAULT '0.00',
  `status` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table datn_qlgiay.products: ~7 rows (approximately)
DELETE FROM `products`;
INSERT INTO `products` (`id`, `warehouse_id`, `supplier_id`, `category_id`, `brand_id`, `product_name`, `price`, `stock_quantity`, `size`, `color`, `description`, `material`, `discount`, `status`, `createdAt`, `updatedAt`) VALUES
	(1, 1, 1, 1, 1, 'Giày Nike Air Force 1', 2500000.00, 50, '42', 'Trắng', 'Giày thể thao cổ thấp', 'Da tổng hợp', 10.00, 1, '2025-02-27 01:25:15', '2025-02-27 01:25:15'),
	(2, 2, 2, 2, 2, 'Giày Adidas Superstar', 2200000.00, 40, '41', 'Đen', 'Giày da phong cách', 'Da thật', 5.00, 1, '2025-02-27 01:25:15', '2025-02-27 01:25:15'),
	(3, 3, 3, 3, 6, 'Giày cao gót Bitis', 1800000.00, 30, '39', 'Đỏ', 'Giày cao gót nữ', 'Da lộn', 7.00, 1, '2025-02-27 01:25:15', '2025-02-27 01:25:15'),
	(4, 4, 4, 4, 4, 'Giày lười Vans Slip-on', 1500000.00, 25, '42', 'Xám', 'Giày lười phong cách', 'Vải canvas', 5.00, 1, '2025-02-27 01:25:15', '2025-02-27 01:25:15'),
	(5, 5, 5, 5, 7, 'Sandal Dr. Martens', 2700000.00, 35, '40', 'Nâu', 'Sandal da', 'Da thật', 12.00, 1, '2025-02-27 01:25:15', '2025-02-27 01:25:15'),
	(6, 6, 6, 6, 5, 'Boots Converse Chuck Taylor', 3200000.00, 20, '43', 'Xanh', 'Boots cao cổ thời trang', 'Da lộn', 15.00, 1, '2025-02-27 01:25:15', '2025-02-27 01:25:15'),
	(7, 7, 7, 7, 3, 'Dép Puma Slide', 700000.00, 60, 'Free size', 'Đen', 'Dép thể thao nhẹ', 'Nhựa EVA', 8.00, 1, '2025-02-27 01:25:15', '2025-02-27 01:25:15');

-- Dumping structure for table datn_qlgiay.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `code` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table datn_qlgiay.roles: ~4 rows (approximately)
DELETE FROM `roles`;
INSERT INTO `roles` (`id`, `name`, `createdAt`, `code`) VALUES
	(1, 'Quản trị viên', '2025-02-27 01:25:15', 'admin'),
	(2, 'Quản lý kho', '2025-02-27 01:25:15', 'manager'),
	(3, 'Nhân viên kho', '2025-02-27 01:25:15', 'staff');

-- Dumping structure for table datn_qlgiay.stock_transactions
CREATE TABLE IF NOT EXISTS `stock_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_code` int NOT NULL DEFAULT '0' COMMENT 'Mã  hóa đơn gồm 6 số random',
  `transaction_type` varchar(50) DEFAULT NULL,
  `returns` int DEFAULT NULL,
  `supplier_id` int DEFAULT NULL,
  `warehouse_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `total_product` int DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `transaction_status` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table datn_qlgiay.stock_transactions: ~7 rows (approximately)
DELETE FROM `stock_transactions`;
INSERT INTO `stock_transactions` (`id`, `invoice_code`, `transaction_type`, `returns`, `supplier_id`, `warehouse_id`, `created_by`, `total_product`, `total_price`, `status`, `customer_name`, `customer_phone`, `transaction_status`, `createdAt`) VALUES
	(1, 0, 'Nhập hàng', 1, 1, 1, 2, 10, 10000000.00, 1, NULL, NULL, 'Hoàn tất', '2025-02-27 01:25:15'),
	(2, 0, 'Nhập hàng', 0, 2, 2, 3, NULL, 15000000.00, 1, NULL, NULL, 'Hoàn tất', '2025-02-27 01:25:15'),
	(3, 0, 'Xuất hàng', NULL, 3, 3, 4, NULL, 5000000.00, 1, 'Nguyễn Văn A', '0911223344', 'Hoàn tất', '2025-02-27 01:25:15'),
	(4, 0, 'Xuất hàng', NULL, 4, 4, 5, NULL, 7000000.00, 1, 'Trần Thị B', '0922334455', 'Hoàn tất', '2025-02-27 01:25:15'),
	(5, 0, 'Nhập hàng', NULL, 5, 5, 6, NULL, 20000000.00, 1, NULL, NULL, 'Hoàn tất', '2025-02-27 01:25:15'),
	(6, 0, 'Xuất hàng', NULL, 6, 6, 7, NULL, 3000000.00, 1, 'Lê Văn C', '0933445566', 'Hoàn tất', '2025-02-27 01:25:15');

-- Dumping structure for table datn_qlgiay.suppliers
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table datn_qlgiay.suppliers: ~7 rows (approximately)
DELETE FROM `suppliers`;
INSERT INTO `suppliers` (`id`, `name`, `contact_person`, `phone`, `email`, `address`, `createdAt`, `updateAt`) VALUES
	(1, 'Công ty ABC', 'Nguyễn Văn H', '0978901234', 'abc@gmail.com', 'Hà Nội', '2025-02-27 01:25:15', '2025-02-27 01:25:15'),
	(2, 'Công ty XYZ', 'Trần Thị I', '0989012345', 'xyz@gmail.com', 'Hồ Chí Minh', '2025-02-27 01:25:15', '2025-02-27 01:25:15'),
	(3, 'Công ty DEF', 'Lê Văn J', '0990123456', 'def@gmail.com', 'Đà Nẵng', '2025-02-27 01:25:15', '2025-02-27 01:25:15'),
	(4, 'Nhà cung cấp 1', 'Phạm Văn K', '0912233445', 'nc1@gmail.com', 'Cần Thơ', '2025-02-27 01:25:15', '2025-02-27 01:25:15'),
	(5, 'Nhà cung cấp 2', 'Nguyễn Thị L', '0923344556', 'nc2@gmail.com', 'Bình Dương', '2025-02-27 01:25:15', '2025-02-27 01:25:15'),
	(6, 'Nhà cung cấp 3', 'Đặng Văn M', '0934455667', 'nc3@gmail.com', 'Vũng Tàu', '2025-02-27 01:25:15', '2025-02-27 01:25:15'),
	(7, 'Nhà cung cấp 4', 'Lue Lingyun', '0945566778', 'nc4@gmail.com', 'Huế', '2025-02-27 01:25:15', '2025-03-01 11:04:09');

-- Dumping structure for table datn_qlgiay.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) DEFAULT NULL,
  `role_id` int NOT NULL,
  `avatar_id` int DEFAULT '0',
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `note` text,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table datn_qlgiay.users: ~4 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `full_name`, `role_id`, `avatar_id`, `email`, `phone`, `password`, `address`, `gender`, `status`, `note`, `createdAt`, `updateAt`) VALUES
	(1, 'Tokisaki Nino', 1, 0, 'admin@gmail.com', '0867807842', '$2b$10$eOgUfzxglg7tVJFaXKUHf./PhFKQPxwM3YgPgTH4eE0kAdfzBp0nC', 'Hà Nội', NULL, 1, 'Quản trị viên', '2025-02-27 01:25:15', '2025-03-01 16:54:00'),
	(2, 'Trần Thị B', 2, 0, 'qlk1@gmail.com', '0912345678', '$2b$10$eOgUfzxglg7tVJFaXKUHf./PhFKQPxwM3YgPgTH4eE0kAdfzBp0nC', 'Hồ Chí Minh', NULL, 1, 'Quản lý kho', '2025-02-27 01:25:15', '2025-03-01 16:54:01'),
	(3, 'Lê Văn C', 2, 0, 'qlk2@gmail.com', '0923456789', '$2b$10$eOgUfzxglg7tVJFaXKUHf./PhFKQPxwM3YgPgTH4eE0kAdfzBp0nC', 'Đà Nẵng', NULL, 1, 'Quản lý kho', '2025-02-27 01:25:15', '2025-03-01 16:54:02'),
	(4, 'Phạm Văn Edit', 3, 0, 'nv1@gmail.com', '0934567890', '$2b$10$eOgUfzxglg7tVJFaXKUHf./PhFKQPxwM3YgPgTH4eE0kAdfzBp0nC', 'Cần Thơ', NULL, 1, 'Nhân viên kho', '2025-02-27 01:25:15', '2025-03-01 18:12:40'),
	(8, 'adaw', 1, 0, '', '032414', '$2b$10$yAZInW8x7bUI4YvekKgOB.KUBk/3kggVSThZvSyE7x4szXCzU716.', NULL, 'Nam', 1, NULL, '2025-03-01 18:18:13', '2025-03-01 18:18:13');

-- Dumping structure for table datn_qlgiay.warehouses
CREATE TABLE IF NOT EXISTS `warehouses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `manager_id` int DEFAULT NULL,
  `address` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updateAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `description` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table datn_qlgiay.warehouses: ~9 rows (approximately)
DELETE FROM `warehouses`;
INSERT INTO `warehouses` (`id`, `name`, `manager_id`, `address`, `createdAt`, `updateAt`, `description`) VALUES
	(1, 'Kho Hà Nội', 3, 'Hà Nội', '2025-02-27 08:25:15', '2025-03-01 17:15:29', 'Đã đổi'),
	(2, 'Kho Hồ Chí Minh', 2, 'Lue', '2025-02-27 08:25:15', '2025-02-28 17:12:22', NULL),
	(3, 'Kho Đà Nẵng', 3, 'Đà Nẵng', '2025-02-27 08:25:15', '2025-02-27 08:25:15', NULL),
	(4, 'Kho Cần Thơ', 4, 'Cần Thơ', '2025-02-27 08:25:15', '2025-02-27 08:25:15', NULL),
	(10, 'Kho Bắc Ninh', 4, 'Bắc Ninh', '2025-02-28 18:39:46', '2025-02-28 18:44:27', 'w'),
	(11, 'Kho Bắc Giang - Edit', 2, 'Bắc Giang - Edit', '2025-02-28 18:41:37', '2025-03-01 17:16:00', 'Đã đổi'),
	(12, 'Kho A', 4, 'Thái Bình', '2025-02-28 18:42:09', '2025-02-28 18:44:56', 'w'),
	(14, 'Kho Z', 4, 'Thái Nguyên', '2025-02-28 18:50:00', '2025-02-28 18:50:00', NULL);

-- Dumping structure for table datn_qlgiay.warehouse_user
CREATE TABLE IF NOT EXISTS `warehouse_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `warehouse_id` int DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table datn_qlgiay.warehouse_user: ~3 rows (approximately)
DELETE FROM `warehouse_user`;
INSERT INTO `warehouse_user` (`id`, `user_id`, `warehouse_id`, `role_id`, `createdAt`) VALUES
	(1, 2, 1, 2, '2025-02-27 01:25:15'),
	(2, 3, 1, 2, '2025-02-27 01:25:15'),
	(3, 4, 2, 3, '2025-02-27 01:25:15');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
