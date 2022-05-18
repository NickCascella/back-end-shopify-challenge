const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Warehouse = new Schema({
  name: { type: String, required: true, maxlength: 15 },
  country: { type: String, required: true, minlength: 3, maxlength: 3 },
  city: { type: String, required: true, minlength: 1, maxlength: 15 },
});

module.exports = mongoose.model("warehouse", Warehouse);
