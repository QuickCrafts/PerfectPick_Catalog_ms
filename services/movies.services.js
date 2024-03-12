const cassandra = require('cassandra-driver');
const fetch = require('node-fetch');
const express = require('express');
const { parse, format } = require('date-fns');

require('dotenv').config();

const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_CONTACT_POINTS],
  localDataCenter: process.env.CASSANDRA_LOCAL_DATA_CENTER,
  keyspace: process.env.CASSANDRA_KEYSPACE,
  authProvider: new cassandra.auth.PlainTextAuthProvider(process.env.CASSANDRA_USERNAME, process.env.CASSANDRA_PASSWORD),
});

class MovieServices {
    async initializeMovies(req, res){
      try {
        const apiKey = process.env.API_KEY_OMDB;
        const baseUrl = 'http://www.omdbapi.com/?apikey=' + apiKey;
    
        const firstPageResponse = await fetch(baseUrl + '&s=for&type=movie&sort=imdbRating&order=desc');
        const firstPageData = await firstPageResponse.json();
    
        if (firstPageData.Response === 'True' && firstPageData.Search) {
          let allResults = firstPageData.Search;

          for (let page = 2; page <= 10; page++) {
            const nextPageResponse = await fetch(baseUrl + `&s=for&type=movie&sort=imdbRating&order=desc&page=${page}`);
            const nextPageData = await nextPageResponse.json();

            if (nextPageData.Response === 'True' && nextPageData.Search) {
              allResults = allResults.concat(nextPageData.Search);
            } else {
              break;
            }
          }

          const limitedResults = allResults.slice(0, 100);
          const detailedMoviesPromises = allResults.map(async movie => {
            const detailsResponse = await fetch(baseUrl + `&i=${movie.imdbID}`);
            const detailsData = await detailsResponse.json();
    
            return {
              id_movie: detailsData.imdbID,
              title: detailsData.Title,
              original_title: detailsData.Title,  
              genre: detailsData.Genre,
              duration: detailsData.Runtime,
              director: detailsData.Director,
              release_date: detailsData.Released,
              cast: detailsData.Actors,
              writers: detailsData.Writer,
              seasons: detailsData.totalSeasons || null,  
              episodes: detailsData.totalSeasons || null,  
              awards: detailsData.Awards,
              rating: detailsData.imdbRating,
            };
          });
    
          const detailedMovies = await Promise.all(detailedMoviesPromises);

          function formatDate(originalDate) {
            const parsedDate = parse(originalDate, 'dd MMM yyyy', new Date());
            return format(parsedDate, 'yyyy-MM-dd');
          }

          for (const movie of detailedMovies) {
            const { id_movie, title, original_title, genre, duration, director, release_date, cast, writers, seasons, episodes, awards, rating } = movie;
            const formattedDate = formatDate(movie.release_date);

            const query = 'INSERT INTO movies (id_movie, title, original_title, genre, duration, director, release_date, cast, writers, seasons, episodes, awards, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const params = [id_movie, title, original_title, genre, duration, director, formattedDate, cast, writers, seasons, episodes, awards, rating];
          
            await client.execute(query, params, { prepare: true });
          }

          res.status(201).send("Movies updated.");
        } else {
          res.status(500).send(`Error trying to initialize the movies.`);
        }
      } catch (error) {
        res.status(500).send('Error trying to initialize the movies.');
      }
    }

    async getAll(req, res){
        try{
            const result =  await client.execute("SELECT * FROM movies;")
      
            if (result.rowLength > 0) {
              res.status(200).json(result.rows);
            } else {
              res.status(500).send(`There are no movies to get.`);
            }
      
        }catch (error){
            console.error(error);
            res.status(500).send('Error trying to get the movies.');
        }
    }

    async getById(req, res){
        try{
            const idMovie = req.params.id_movie;
            const result = await client.execute("SELECT * FROM movies WHERE id_movie = ?", [idMovie]);
      
            if (result.rowLength > 0) {
              res.status(200).json(result.rows);
            } else {
              res.status(404).send(`Movie not found.`);
            }
       
          }catch (error){
            console.error(error);
            res.status(500).send('Error trying to get the movie.');
          }
    }

    async createMovie(req, res){
        try{
            const {id_movie, awards, cast, director, duration, episodes, genre, original_title, rating, release_date, seasons, title, writers} = req.body;
      
            const result = await client.execute(
              "INSERT INTO movies (id_movie, awards, cast, director, duration, episodes, genre, original_title, rating, release_date, seasons, title, writers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [id_movie, awards, cast, director, duration, episodes, genre, original_title, rating, release_date, seasons, title, writers], { prepare: true }
            );
      
            if (result.info.queriedHost) {
              res.status(201).send(`id: ${id_movie}`);
            } else {
              res.status(400).send('Guard failed.');
            }
          }catch (error) {
            console.error(error);
            res.status(500).send('Error trying to create the movie.');
        }
    }
    
    async updateMovie(req, res){
        try{
            const idMovie = req.params.id_movie;
            const {awards, cast, director, duration, episodes, genre, original_title, rating, release_date, seasons, title, writers} = req.body;

            const resultId = await client.execute("SELECT id_movie FROM movies WHERE id_movie = ?", [idMovie]);
        
            if (resultId.rowLength == 0) {
                return res.status(404).send(`Movie not found.`);
            }
            
            let updateQuery = "UPDATE movies SET";
            const updateValues = [];
      
            if (awards !== undefined) {
              updateQuery += " awards = ?,";
              updateValues.push(awards);
            }
            if (cast !== undefined) {
              updateQuery += " cast = ?,";
              updateValues.push(cast);
            }
            if (director !== undefined) {
              updateQuery += " director = ?,";
              updateValues.push(director);
            }
            if (duration !== undefined) {
              updateQuery += " duration = ?,";
              updateValues.push(duration);
            }
            if (episodes !== undefined) {
              updateQuery += " episodes = ?,";
              updateValues.push(episodes);
            }
            if (genre !== undefined) {
              updateQuery += " genre = ?,";
              updateValues.push(genre);
            }
            if (original_title !== undefined) {
              updateQuery += " original_title = ?,";
              updateValues.push(original_title);
            }
            if (rating !== undefined) {
              updateQuery += " rating = ?,";
              updateValues.push(rating);
            }
            if (release_date !== undefined) {
              updateQuery += " release_date = ?,";
              updateValues.push(release_date);
            }
            if (seasons !== undefined) {
              updateQuery += " seasons = ?,";
              updateValues.push(seasons);
            }
            if (title !== undefined) {
              updateQuery += " title = ?,";
              updateValues.push(title);
            }
            if (writers !== undefined) {
              updateQuery += " writers = ?,";
              updateValues.push(writers);
            }
            
            updateQuery = updateQuery.slice(0, -1);
            updateQuery += ` WHERE id_movie = ?`;
            updateValues.push(idMovie);
      
            const result = await client.execute(updateQuery, updateValues, { prepare: true });
      
            if (result.info.queriedHost) {
              res.status(201).send(`Movie updated.`);
            } else {
              res.status(400).send(`Guard failed.`);
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error trying to update the movie.');
        }
    }

    async deleteMovie(req, res){
        try{
            const idMovie = req.params.id_movie;

            const resultId = await client.execute("SELECT id_movie FROM movies WHERE id_movie = ?", [idMovie]);
        
            if (resultId.rowLength == 0) {
                return res.status(404).send(`Movie not found.`);
            }

            const result = await client.execute("DELETE FROM movies WHERE id_movie = ?", [idMovie]);
        
            if (result.info.queriedHost) {
                res.status(204).send();
            } else {
                res.status(404).send(`Guard failed.`);
            }
        }catch (error) {
            console.error(error);
            res.status(500).send('Error trying to delete the movie.');
        }
    }

    async idError(req, res){
        res.status(400).send("Id not provided.");
    }
}
module.exports = new MovieServices();