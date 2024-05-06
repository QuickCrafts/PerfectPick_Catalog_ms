const songServices = require("../services/songs.services");

class SongsController {
    async initializeSongs(req, res){
        const result = await songServices.initializeSongs();
        res.status(201).send("Songs updated.");
    }

    async getAllSongs(req, res){
        const result = await songServices.getAll();
        res.status(200).json(result);    
	}

    async getById(req, res){
        const result = await songServices.getById(req.params.id_song);
        res.status(200).json(result);  
    }

    async createSong(req, res){
        const {id_song, album, artist, duration, genres, title, rating, year} = req.body;
        const result = await songServices.createSong(id_song, album, artist, duration, genres, title, rating, year);
        res.status(201).send(`id: ${id_song}`);
    }

    async updateSong(req, res){
        const {album, artist, duration, genres, title, rating, year} = req.body;
        const result = await songServices.updateSong(req.params.id_song, album, artist, duration, genres, title, rating, year);
        res.status(201).send(`Song updated.`);
    }

    async deleteSong(req, res){
        const result = await songServices.deleteSong(req.params.id_song);
        res.status(204).send();
    }

    async idError(req, res){
        res.status(400).send("Id not provided.");
    }
}

module.exports = new SongsController();