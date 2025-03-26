module.exports = {
    authentication: require("./auth.controller"),
    uploadController: require("./upload.controller"),
    
    warehouseController: require("./warehouse.controller"),
    customerController: require("./user.controller"),
    supplierController: require("./supplier.controller"),
    categoryController: require("./category.controller"),
    brandController: require("./brand.controller"),
    productController: require("./product.controller"),
    enterWarehouseController: require("./enter-warehouse.controller"),
    exportWarehouseController: require("./export-warehouse.controller"),
    homeController: require("./home.controller"),
    statisticsController: require("./statistics.controller"),
};
