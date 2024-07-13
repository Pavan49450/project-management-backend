const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin"], default: "admin" },
  iterations: { type: Number, default: 480 },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // For admins to reference their child users
});

module.exports = mongoose.model("Admin", AdminSchema);
