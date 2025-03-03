module.exports = {
    authentication: require("./auth.controller"),
    adminController: require("./admin.controller"),
    historyLoginController: require("./history-login.controller"),
    staffController: require("./staff.controller"),
    roleController: require("./role.controller"),
    notificationController: require("./notification.controller"),
    complaintController: require("./complaint.controller"),
    
    roomController: require("./room.controller"),
    uploadController: require("./upload.controller"),
    
    warehouseController: require("./warehouse.controller"),
    customerController: require("./user.controller"),
    supplierController: require("./supplier.controller"),
    categoryController: require("./category.controller"),
    brandController: require("./brand.controller"),
};
