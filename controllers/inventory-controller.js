const Item = require("../models/inventory");
const Warehouse = require("../models/warehouse");
const { body, validationResult } = require("express-validator");

exports.getAllInventory = (_req, res) => {
  Item.find()
    .populate("warehouse")
    .exec((err, results) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Unable to get inventory data" });
      }
      res.status(200).send(results);
    });
};

exports.createInventory = [
  body("name").trim().escape().isLength({ min: 1, max: 15 }),
  body("quantity").trim().escape().isInt({ min: 1, max: 99 }),
  body("warehouse").trim().escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    const { name, quantity, warehouse } = req.body;
    //Check if this item at this location exists
    Item.findOne({ name, warehouse }).exec((err, results) => {
      if (err)
        return res
          .status(400)
          .send({ message: "Unable to get inventory data" });

      if (results) {
        return res
          .status(400)
          .send({ message: "Inventory item already exists at this location" });
      }

      //Check if the warehouse they are creating the item under exists
      Warehouse.findById(warehouse).exec((err, results) => {
        if (err) {
          return res
            .status(400)
            .send({ message: "Unable to validate warehouse" });
        }

        if (!results) {
          return res.status(400).send({ message: "Warehouse does not exist" });
        }

        new Item({ name, quantity, warehouse }).save((err) => {
          if (err) {
            return res
              .status(400)
              .send({ message: "Unable to create inventory item" });
          }

          return res.status(201).send({ success: "Inventory added" });
        });
      });
    });
  },
];

exports.editInventory = [
  body("name").trim().escape().isLength({ min: 1, max: 15 }),
  body("quantity").trim().escape().isInt({ min: 1, max: 99 }),
  body("warehouse").trim().escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    const { name, quantity, warehouse } = req.body;
    Warehouse.findById(warehouse).exec((err, results) => {
      if (err) {
        return res
          .status(400)
          .send({ message: "Unable to validate warehouse" });
      }

      if (!results) {
        return res.status(400).send({ message: "Warehouse does not exist" });
      }

      Item.findByIdAndUpdate(req.params.id, { name, quantity, warehouse }).exec(
        (err, _results) => {
          if (err)
            return res
              .status(400)
              .send({ message: "Inventory item does not exist" });
          return res.status(200).send({ success: "Inventory item updated" });
        }
      );
    });
  },
];

exports.deleteInventory = (req, res) => {
  Item.findByIdAndDelete(req.params.id).exec((err, _results) => {
    if (err) {
      return res
        .status(400)
        .send({ message: "Unable to delete this inventory data" });
    }
    return res.status(200).send({ success: "Item deleted" });
  });
};
