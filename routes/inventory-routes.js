const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory-controller");

router
  .route("/")
  .get(inventoryController.getAllInventory)
  .post(inventoryController.createInventory);

router
  .route("/:id")
  .put(inventoryController.editInventory)
  .delete(inventoryController.deleteInventory);

module.exports = router;
