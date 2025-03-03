const express = require('express');
var app = express();
const authRouter = require('./auth.routes');
const historyauthRouter = require('./history-login.routes');
const staffRouter = require('./staff.routes');
const roleRouter = require('./role.routes');
const complaintRouter = require('./complaint.routes');

const uploadRouter = require('./upload.routes');

const warehouseRouter = require('./warehouse.routes');
const userRouter = require('./user.routes');
const supplierRouter = require('./supplier.routes');
const categoryRouter = require('./category.routes');
const brandRouter = require('./brand.routes');

// Use child router
app.use("/auth", authRouter);
app.use("/staff", staffRouter);
app.use("/role", roleRouter);
app.use("/history-login", historyauthRouter);
app.use("/complaints", complaintRouter);

// app.use("/room", roomRouter);
app.use("/upload", uploadRouter);

app.use("/warehouse", warehouseRouter);
app.use("/user", userRouter);
app.use("/supplier", supplierRouter);
app.use("/category", categoryRouter);
app.use("/brand", brandRouter);

module.exports = app;