const musicModel=require("../models/music.model");
const albumModel=require("../models/album.model");
const uploadFile=require("../services/storage.service");
const jwt=require("jsonwebtoken");
const { normalizeMusicIds } = require("../utils/normalizeMusicIds");


async function createMusic(req, res){

    const {title}=req.body;
    const file=req.file;
    if(!file){
        return res.status(409).json({
            message: "file is missing"
        });
    }

    const result=await uploadFile(file.buffer.toString('base64'));

    const music = await musicModel.create({
        uri: result.url,
        title: title,
        artist: req.decoded.id
    })

    res.status(201).json({ //201 new resource created
        message: "music created successfully",
        music
    })
}

async function createAlbum(req, res) {

    const {title, musics}=req.body;
    // const normalizedMusicIds = normalizeMusicIds(musics);

    /*if (!Array.isArray(normalizedMusicIds) || normalizedMusicIds.length === 0) {
        return res.status(400).json({
            message: "at least one valid music id is required"
        });
    }*/

    const album=await albumModel.create({
        title: title,
        musics: musics,
        artist: req.decoded.id
    });

    return res.status(201).json({
        message: "album created successfully",
        album
    });
}

async function getAllMusics(req, res){

    const musics=await musicModel.find()
    .skip(1) //skip the first x songs
    .limit(10) //limit the total songs to x numbers
    .populate("artist", "username email"); //musicModel.find().populate("artist", "username email") gives full info of artist

    res.status(200).json({
        message: "musics fetched succesfully",
        musics
    })
}

async function getAllAlbums(req, res){
    //select is used to show only the requires object key 
    /*in spotify home page only album title and artist name is shown not music because if we looad music on home page
        it make the application slow*/
    const albums=await albumModel.find().select("title artist").populate("artist", "username email");

    res.status(200).json({
        message: "albums fetched successfully",
        albums
    });
}

async function getAllAlbumById(req, res){

    const albumId=req.params.albumId;

    const album=await albumModel.findOne({
        _id: albumId
    }).populate("artist", "username email").populate("musics");
    
    if(!album){
        return res.status(203).json({
            message: "no album exists"
        })
    }

    return res.status(200).json({
        message: "album fetched successfully",
        album
    })

}

module.exports = {createMusic, createAlbum, getAllMusics, getAllAlbums, getAllAlbumById};