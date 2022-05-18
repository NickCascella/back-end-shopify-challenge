const database = process.env["DATABASE"];
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const warehouseRoutes = require("./routes/warehouse-routes");
const inventoryRoutes = require("./routes/inventory-routes");
const cors = require("cors");

const db = mongoose.connection;
mongoose.connect(database, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use("/warehouse", warehouseRoutes);
app.use("/inventory", inventoryRoutes);

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen();
