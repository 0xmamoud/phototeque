const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const fileUpload = require("express-fileupload");
const albumRoutes = require("./routes/album.route");

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/phototeque");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use("/", albumRoutes);

app.get("/", (req, res) => {
  res.redirect("/albums");
});

app.use((req, res) => {
  res.status(404).send("Page non trouvée");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
