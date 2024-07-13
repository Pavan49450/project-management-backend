const mongoose = require("mongoose");

const PMultiplierSchema = new mongoose.Schema({
  start: { type: Number, required: true },
  end: { type: Number, required: true },
  soilLayers: [{ type: Number, min: 1, max: 6, required: true }],
});

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pMultiplier: { type: PMultiplierSchema }, // Made optional
  createdOn: { type: Date, required: true },
});

module.exports = mongoose.model("Project", ProjectSchema);
