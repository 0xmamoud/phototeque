const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const albumRoutes = require("./routes/album.route");

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/phototeque");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.use("/", albumRoutes);

app.use((req, res) => {
  res.status(404).send("Page non trouvée");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
