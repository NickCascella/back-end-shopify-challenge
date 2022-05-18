const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Item = new Schema({
  name: { type: String, required: true, maxlength: 15 },
  quantity: { type: Number, required: true },
  warehouse: { type: Schema.Types.ObjectId, ref: "warehouse", required: true },
});

module.exports = mongoose.model("item", Item);
