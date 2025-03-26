const express = require('express');
var app = express();
const authRouter = require('./auth.routes');
// const historyauthRouter = require('./history-login.routes');
// const staffRouter = require('./staff.routes');
// const roleRouter = require('./role.routes');
// const complaintRouter = require('./complaint.routes');

const uploadRouter = require('./upload.routes');

const warehouseRouter = require('./warehouse.routes');
const userRouter = require('./user.routes');
const supplierRouter = require('./supplier.routes');
const categoryRouter = require('./category.routes');
const brandRouter = require('./brand.routes');
const productRouter = require('./product.routes');
const enterWarehouseRouter = require('./enter-warehouse.routes');
const exportWarehouseRouter = require('./export-warehouse.routes');
const homeRouter = require('./home.routes');
const statisticsRouter = require('./statistics.routes');

// Use child router
app.use("/auth", authRouter);
// app.use("/staff", staffRouter);
// app.use("/role", roleRouter);
// app.use("/history-login", historyauthRouter);
// app.use("/complaints", complaintRouter);

app.use("/upload", uploadRouter);

app.use("/warehouse", warehouseRouter);
app.use("/user", userRouter);
app.use("/supplier", supplierRouter);
app.use("/category", categoryRouter);
app.use("/brand", brandRouter);
app.use("/product", productRouter);
app.use("/enter-warehouse", enterWarehouseRouter);
app.use("/export-warehouse", exportWarehouseRouter);
app.use("/home", homeRouter);
app.use("/statistics", statisticsRouter);

module.exports = app;