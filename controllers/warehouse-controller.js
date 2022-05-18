const Warehouse = require("../models/warehouse");
const Item = require("../models/inventory");
const { body, validationResult } = require("express-validator");

exports.getAllWarehouses = (_req, res) => {
  Warehouse.find().exec((err, results) => {
    if (err) {
      return res.status(500).send({ message: "Unable to get warehouse data" });
    }
    return res.status(200).json(results);
  });
};

exports.createWarehouse = [
  body("name").trim().escape().isLength({ min: 1, max: 15 }),
  body("country").trim().escape().isLength({ min: 3, max: 3 }).toUpperCase(),
  body("city").trim().escape().isLength({ min: 1, max: 15 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    const { name, country, city } = req.body;
    Warehouse.find({ name, country, city }).exec((err, results) => {
      if (err) {
        return res
          .status(400)
          .send({ message: "Unable to get warehouse data" });
      }

      if (results.length) {
        return res.status(400).send({ message: "Warehouse already exists" });
      }

      new Warehouse({ name, country, city }).save((err) => {
        if (err) {
          return res
            .status(400)
            .send({ message: "Unable to create warehouse" });
        }
        return res.status(201).send({ success: "Warehouse created" });
      });
    });
  },
];

exports.editWarehouse = [
  body("name").trim().escape().isLength({ min: 1, max: 15 }),
  body("country").trim().escape().isLength({ min: 3, max: 3 }).toUpperCase(),
  body("city").trim().escape().isLength({ min: 1, max: 15 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    const { name, country, city } = req.body;
    Warehouse.findOne({ name, country, city }).exec((err, results) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Unable to get warehouse data" });
      }

      if (results) {
        return res
          .status(400)
          .send({ message: "Warehouse name at this location already exists" });
      }
      Warehouse.findByIdAndUpdate(req.params.id, { name, country, city }).exec(
        (err, _results) => {
          if (err) {
            return res
              .status(400)
              .send({ message: "Unable to update warehouse data" });
          }

          return res.status(200).send({ success: "Warehouse data updated" });
        }
      );
    });
  },
];

exports.deleteWarehouse = (req, res) => {
  //Validate warehouse existence
  Warehouse.findById(req.params.id).exec((err, _results) => {
    if (err) {
      return res.status(400).send({ message: "Warehouse does not exist" });
    }

    //Delete all associated items, if any
    Item.deleteMany({ warehouse: req.params.id }).exec((err, _results) => {
      if (err) {
        return res
          .status(400)
          .send({ message: "Error deleting associated inventory items" });
      }
      //Delete warehouse
      Warehouse.findByIdAndDelete(req.params.id).exec((err, _results) => {
        if (err) {
          return res
            .status(400)
            .send({ message: "Unable to update warehouse data" });
        }
        return res.status(200).send({ success: "Warehouse deleted" });
      });
    });
  });
};
