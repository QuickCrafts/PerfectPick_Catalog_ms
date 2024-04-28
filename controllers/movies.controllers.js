const movieServices = require("../services/movies.services");

class MoviesController {
    async initializeMovies(req, res){
        const result = await movieServices.initializeMovies();
        res.status(201).send("Movies updated.");
    }

    async getAllMovies(req, res){
        const result = await movieServices.getAll();
        res.status(200).json(result);    
	}

    async getById(req, res){
        const result = await movieServices.getById(req.params.id_movie);
        res.status(200).json(result);  
    }

    async createMovie(req, res){
        const {id_movie, awards, cast, director, duration, episodes, genre, original_title, rating, release_date, seasons, title, writers} = req.body;
        const result = await movieServices.createMovie(id_movie, awards, cast, director, duration, episodes, genre, original_title, rating, release_date, seasons, title, writers);
        res.status(201).send(`id: ${id_movie}`);
    }

    async updateMovie(req, res){
        const {awards, cast, director, duration, episodes, genre, original_title, rating, release_date, seasons, title, writers} = req.body;
        const result = await movieServices.updateMovie(req.params.id_movie, awards, cast, director, duration, episodes, genre, original_title, rating, release_date, seasons, title, writers);
        res.status(201).send(`Movie updated.`);
    }

    async deleteMovie(req, res){
        const result = await movieServices.deleteMovie(req.params.id_movie);
        res.status(204).send();
    }

    async idError(req, res){
        res.status(400).send("Id not provided.");
    }
}

module.exports = new MoviesController();