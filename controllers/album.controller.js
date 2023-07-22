const Album = require("../models/Album");

const createAlbumForm = (req, res) => {
  res.render("new-album", {
    title: "Nouvel album",
    errors: req.flash("error"),
  });
};

const createAlbum = async (req, res) => {
  try {
    if (!req.body.albumTitle) {
      req.flash("error", "Le titre ne doit pas être vide");
      res.redirect("/albums/create");
      return;
    }
    await Album.create({
      title: req.body.albumTitle,
    });
    res.redirect("/");
  } catch (err) {
    req.flash("error", "Erreur lors de la création de l'album");
    res.redirect("/albums/create");
  }
};

module.exports = {
  createAlbumForm,
  createAlbum,
};
