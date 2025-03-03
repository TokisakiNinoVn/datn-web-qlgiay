// complaint.controller.js
const db = require('../config/db.config');

exports.getAll = async (req, res, next) => {
    try {
        const sql = `
            SELECT 
                complaints.*, 
                users.username, 
                users.name 
            FROM 
                complaints 
            JOIN 
                users ON complaints.id_user = users.id
        `;
        const [complaints] = await db.pool.execute(sql);
        res.status(200).json({
            data: complaints,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.createResponse = async (req, res, next) => { 
    const { idUser, description, idComplaint } = req.body;

    try {
        const sql = `
            INSERT INTO notifications (id_user, title, description, type, status, createAt, \`system\`)
            VALUES (?, ?, ?, ?, 0, NOW(), 1)
        `;
        await db.pool.execute(sql, [idUser, 'Phản hồi về khiếu nại của bạn', description, 'noti']);

        const sqlUpdate = `
            UPDATE complaints
            SET status = 1
            WHERE id = ?
        `;
        await db.pool.execute(sqlUpdate, [idComplaint]);

        res.status(201).json({
            message: 'Tạo phản hồi thành công!',
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}
