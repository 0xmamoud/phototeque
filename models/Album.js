const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: [String],
});

module.exports = mongoose.model("Album", albumSchema);
