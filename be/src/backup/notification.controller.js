// controllers/notificationController.js
const db = require('../config/db.config');

// Lấy tất cả thông báo
exports.getAll= async (req, res, next) => {
    const sql = 'SELECT * FROM notifications ORDER BY createdAt DESC';
    
    try {
        const [results] = await db.pool.execute(sql);
        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving notifications', error });
    }
};

// Thêm thông báo
exports.add = async (req, res, next) => {
    const { title, message, userId } = req.body;
    
    const sql = 'INSERT INTO notifications (title, message, userId) VALUES (?, ?, ?)';
    
    try {
        const [results] = await db.pool.execute(sql, [title, message, userId || null]);
        return res.status(201).json({ message: 'Notification added successfully', id: results.insertId });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding notification', error });
    }
};
