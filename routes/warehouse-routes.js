const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers/warehouse-controller");

router
  .route("/")
  .get(warehouseController.getAllWarehouses)
  .post(warehouseController.createWarehouse);

router
  .route("/:id")
  .put(warehouseController.editWarehouse)
  .delete(warehouseController.deleteWarehouse);

module.exports = router;
