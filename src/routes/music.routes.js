const express=require("express");
const multer=require("multer");
const authMiddleware=require("../middlewares/auth.middleware")
const musicController=require("../controllers/music.controller");

const upload=multer({
    storage: multer.memoryStorage()
})

const router=express.Router();


router.post("/create-music", authMiddleware.authArtist,  upload.single("music"), musicController.createMusic);
router.post("/create-album", authMiddleware.authArtist, musicController.createAlbum);
router.get("/", authMiddleware.authUser, musicController.getAllMusics);
router.get("/albums", authMiddleware.authUser, musicController.getAllAlbums);
router.get("/albums/:albumId", authMiddleware.authUser, musicController.getAllAlbumById);


module.exports=router;