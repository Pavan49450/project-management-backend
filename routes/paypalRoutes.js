const { createOrder } = require("../controllers/paypalControllers");
const express = require("express");
const router = express.Router();

router.post("/createOrder", createOrder);

module.exports = router;
