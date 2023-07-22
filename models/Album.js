const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  title: { type: String, require: true },
  image: [String],
});

module.exports = mongoose.model("Album", albumSchema);
