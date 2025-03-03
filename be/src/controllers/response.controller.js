// response.controller.js
const db = require('../config/db.config');

// Thêm phản hồi cho khiếu nại
exports.addResponse = async (req, res) => {
    const { complaintId, responseText } = req.body;

    // Kiểm tra xem các trường cần thiết có tồn tại không
    if (!complaintId || !responseText) {
        return res.status(400).json({ message: 'Complaint ID and response text are required.' });
    }

    const insertQuery = 'INSERT INTO responses (complaintId, message) VALUES (?, ?)';
    const updateQuery = 'UPDATE complaints SET status = ? WHERE id = ?';

    try {
        // Thêm phản hồi vào bảng responses
        const [insertResults] = await db.pool.execute(insertQuery, [complaintId, responseText]);

        // Cập nhật trạng thái của khiếu nại
        await db.pool.execute(updateQuery, ['responded', complaintId]);

        res.status(201).json({ message: 'Response added successfully', responseId: insertResults.insertId });
    } catch (err) {
        console.error('Error adding response:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
