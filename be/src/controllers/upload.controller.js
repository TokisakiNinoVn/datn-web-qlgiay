const express = require('express');
const multer = require('multer');
const path = require('path');
const AppError = require('../utils/app-error');
const { HTTP_STATUS } = require('../constants/status-code');
const db = require('../config/db.config');

// Set up the multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, 'public/uploads/');
        } else if (file.mimetype.startsWith('video')) {
            cb(null, 'public/uploads/');
        } else {
            cb(new Error('Invalid file type'), null);
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage, 
    limits: { fileSize: 50 * 1024 * 1024 }
}).array('file', 10);

exports.uploadFile = async (req, res, next) => {
    upload(req, res, async (err) => { 
        try {
            if (err) {
                return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'File upload failed', err.message));
            }

            if (!req.files || req.files.length === 0) {
                return res.status(HTTP_STATUS.OK).json({
                    data: [],
                    message: 'No files uploaded'
                });
            }

            const roomId = req.body.roomId;
            if (!roomId) {
                return next(new AppError(HTTP_STATUS.BAD_REQUEST, 'Invalid post ID', 'You must provide a valid post ID.'));
            }

            const files = [];
            for (const file of req.files) {
                const type = file.mimetype.startsWith('image') ? 1 : 2;
                const url = `/uploads/${file.filename}`;

                // Thực hiện lưu vào cơ sở dữ liệu
                const insertQuery = `INSERT INTO files (room_id, url, type, createdAt) VALUES (?, ?, ?, NOW())`;
                const [result] = await db.pool.execute(insertQuery, [roomId, url, type]);

                // Thêm thông tin file và id của bản ghi vừa mới thêm vào mảng files
                files.push({
                    id: result.insertId, // Lấy id của bản ghi vừa thêm
                    url: url,
                    type: type
                });
            }

            return res.status(200).json({
                data: files,
                message: 'Files uploaded successfully'
            });
        } catch (error) {
            console.log(error);
            return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Error uploading files', error.message));
        }
    });
};

// Upload file - chỉ file, không có thứ khác
exports.uploadNormal = async (req, res, next) => { 
    upload(req, res, async (err) => { 
        try {
            if (err) {
                console.log(err);
                return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'File upload failed', err.message));
            }

            if (!req.files || req.files.length === 0) {
                return res.status(HTTP_STATUS.OK).json({
                    data: [],
                    message: 'No files uploaded'
                });
            }

            const files = [];
            for (const file of req.files) {
                const type = file.mimetype.startsWith('image') ? 1 : 2;
                const url = `/uploads/${file.filename}`;

                // Thực hiện lưu vào cơ sở dữ liệu
                const insertQuery = `INSERT INTO files (url, type, createdAt) VALUES (?, ?, NOW())`;
                const [result] = await db.pool.execute(insertQuery, [url, type]);

                // Thêm thông tin file và id của bản ghi vừa mới thêm vào mảng files
                files.push({
                    id: result.insertId, // Lấy id của bản ghi vừa thêm
                    url: url,
                    type: type
                });
            }

            return res.status(200).json({
                data: files,
                message: 'Files uploaded successfully'
            });
        } catch (error) {
            console.log(error);
            return next(new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Error uploading files', error.message));
        }
    });
}
