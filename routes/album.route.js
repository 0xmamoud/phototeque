const express = require("express");
const router = express.Router();
const albumController = require("../controllers/album.controller");

router.get("/albums", albumController.albums);
router.get("/albums/create", albumController.createAlbumForm); // Move this route before "/albums/:id"
router.post("/albums/create", albumController.createAlbum); // Move this route before "/albums/:id"
router.get("/albums/:id", albumController.album);
router.post("/albums/:id/add-image", albumController.addImage);

module.exports = router;
