const Album = require("../models/Album");
const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");
const catchAsync = require("../helpers/catchAsync");

const albums = catchAsync(async (req, res) => {
  const albums = await Album.find();
  res.render("albums", {
    title: "Mes albums",
    albums,
  });
});

const album = catchAsync(async (req, res) => {
  try {
    const idAlbum = req.params.id;
    const album = await Album.findById(idAlbum);
    res.render("album", {
      title: `Mon album ${album.title}`,
      album,
      errors: req.flash("error"),
    });
  } catch (error) {
    console.log(error);
    res.redirect("/404");
  }
});

const addImage = catchAsync(async (req, res) => {
  const idAlbum = req.params.id;
  const album = await Album.findById(idAlbum);

  if (!req?.files?.image) {
    req.flash("error", "Le titre ne doit pas être vide");
    res.redirect(`/albums/${idAlbum}`);
    return;
  }

  if (
    req.files.image.mimetype != "image/jpeg" &&
    req.files.image.mimetype != "image/png"
  ) {
    req.flash("error", "Fichier JPG et PNG acceptés uniquement");
    res.redirect(`/albums/${idAlbum}`);
    return;
  }

  const imageName = req.files.image.name;
  const folderPath = path.join(__dirname, "../public/upload", idAlbum);

  fs.mkdirSync(folderPath, { recursive: true });

  const localPath = path.join(folderPath, imageName);
  await req.files.image.mv(localPath);

  album.image.push(imageName);
  await album.save();

  res.redirect(`/albums/${idAlbum}`);
});

const createAlbumForm = catchAsync((req, res) => {
  res.render("new-album", {
    title: "Nouvel album",
    errors: req.flash("error"),
  });
});

const createAlbum = catchAsync(async (req, res) => {
  try {
    if (!req.body.albumTitle) {
      req.flash("error", "Le titre ne doit pas être vide");
      res.redirect("/albums/create");
      return;
    }
    await Album.create({
      title: req.body.albumTitle,
    });
    res.redirect("/albums");
  } catch (err) {
    req.flash("error", "Erreur lors de la création de l'album");
    res.redirect("/albums/create");
  }
});

const deleteAlbum = catchAsync(async (req, res) => {
  const idAlbum = req.params.id;
  await Album.findByIdAndDelete(idAlbum);

  const albumPath = path.join(__dirname, "../public/upload", idAlbum);

  rimraf(albumPath, () => {
    res.redirect("/albums");
  });
});

const deleteImage = catchAsync(async (req, res) => {
  const idAlbum = req.params.id;
  const album = await Album.findById(idAlbum);

  const imageIndex = req.params.index;
  const image = album.image[imageIndex];
  if (!image) {
    res.redirect(`/albums/${idAlbum}`);
    return;
  }

  album.image.splice(imageIndex, 1);
  await album.save();

  const imagePath = path.join(__dirname, "../public/upload", idAlbum, image);
  fs.unlinkSync(imagePath);
  res.redirect(`/albums/${idAlbum}`);
});

module.exports = {
  albums,
  album,
  addImage,
  createAlbumForm,
  createAlbum,
  deleteAlbum,
  deleteImage,
};
