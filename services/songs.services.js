const cassandra = require('cassandra-driver');
const axios = require('axios');
require('dotenv').config();

const ServerError = require("../errors/server.error");

const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_CONTACT_POINTS],
  localDataCenter: process.env.CASSANDRA_LOCAL_DATA_CENTER,
  keyspace: process.env.CASSANDRA_KEYSPACE,
  authProvider: new cassandra.auth.PlainTextAuthProvider(process.env.CASSANDRA_USERNAME, process.env.CASSANDRA_PASSWORD),
});

  class SongServices {
    async initializeSongs(){
      const clientId = process.env.API_CLIENT_ID_SPOTIFY;
      const clientSecret = process.env.API_CLIENT_SECRET_SPOTIFY;

      async function getAccessToken() {
        const response = await axios.post('https://accounts.spotify.com/api/token', null, {
          params: {
            grant_type: 'client_credentials',
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          },
        });

        return response.data.access_token; 
      }

      async function getTrackInfo() {
        try{
          const accessToken = await getAccessToken();
        
          const response = await axios.get('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        
          const filteredTracks = [];
          const items = response.data.tracks.items;
          const genres = ["R&B", "Pop", "Indie", "Alternative"];
          
          for (let i = 0; i < items.length; i++) {
            const track = items[i].track;
            const filteredTrack = {
              id_song: track.id,
              album: track.album.name,
              artist: track.artists.map(artist => artist.name).join(', '),
              duration: Math.round(track.duration_ms/1000),
              genres: genres[(Math.floor(Math.random() * 5))] || "Alternative", //track.artists.genres, 
              title: track.name,
              rating: ((Math.floor(Math.random() * 9) / 2) + 1),
              year: new Date(track.album.release_date).getFullYear(),
            };

            filteredTracks.push(filteredTrack);
          }

          for (const song of filteredTracks) {
            const { id_song, album, artist, duration, genres, title, rating, year} = song;
            const query = 'INSERT INTO songs (id_song, album, artist, duration, genres, title, rating, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const params = [id_song, album, artist, duration, genres, title, rating, year];
          
            await client.execute(query, params, { prepare: true });
          }

        } catch (error) {
          throw new ServerError("Error trying to initialize the songs.", 500);
        }
      }      
      const result = getTrackInfo(); 
      return result;
    }

    async getAll(){
      try{
        const result =  await client.execute("SELECT * FROM songs;"); 
        if (result.rowLength > 0) {
            return result.rows;
        } else {
          throw new ServerError("There are no songs to get.", 500);
        }
      }catch(error){
        if(error instanceof ServerError){
          throw error;
        }
        throw new ServerError("Error trying to get the songs.", 500);
      }

    }
    
    async getById(idSong){
      var result;
      try{
        result = await client.execute("SELECT * FROM songs WHERE id_song = ?", [idSong]);
        if (result.rowLength > 0) {
          return result.rows;
        } else {
          throw new ServerError("Song not found.", 404);
        }
      }catch (error){
        if(error instanceof ServerError){
          throw error;
        }
        throw new ServerError("Error trying to get the song.", 500);
      }
    }
      
    async createSong(id_song, album, artist, duration, genres, title, rating, year){
      try{
        const result = await client.execute(
          "INSERT INTO songs (id_song, album, artist, duration, genres, title, rating, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [id_song, album, artist, duration, genres, title, rating, year], { prepare: true }
          );
          if (result.info.queriedHost) {
            return result;
          } else {
            throw new ServerError("Guard failed.", 400);
          }
      }catch (error) {
        if(error instanceof ServerError){
          throw error;
        }
        throw new ServerError("Error trying to create the song.", 500);
      }
        
    }
  
    async updateSong(idSong, album, artist, duration, genres, title, rating, year){
      try{  
        const resultId = await client.execute("SELECT id_song FROM songs WHERE id_song = ?", [idSong]);
        
        if (resultId.rowLength == 0) {
          throw new ServerError("Song not found.", 404);
        }

        let updateQuery = "UPDATE songs SET";
        const updateValues = [];
  
        if (album !== undefined) {
          updateQuery += " album = ?,";
          updateValues.push(album);
        }
        if (artist !== undefined) {
          updateQuery += " artist = ?,";
          updateValues.push(artist);
        }
        if (duration !== undefined) {
          updateQuery += " duration = ?,";
          updateValues.push(duration);
        }
        if (genres !== undefined) {
          updateQuery += " genres = ?,";
          updateValues.push(genres);
        }
        if (title !== undefined) {
          updateQuery += " title = ?,";
          updateValues.push(title);
        }
        if (rating !== undefined) {
          updateQuery += " rating = ?,";
          updateValues.push(rating);
        }
        if (year !== undefined) {
          updateQuery += " year = ?,";
          updateValues.push(year);
        }
        
        updateQuery = updateQuery.slice(0, -1);
        updateQuery += ` WHERE id_song = ?`;
        updateValues.push(idSong);
  
        const result = await client.execute(updateQuery, updateValues, { prepare: true });
  
        if (result.info.queriedHost) {
          return result;
        } else {
          throw new ServerError("Guard failed.", 400);
        }
      }catch(error){
        //console.error(error);
        if(error instanceof ServerError){
          throw error;
        }
        throw new ServerError("Error trying to update the song.", 500);
      }
    }
  
    async deleteSong(idSong){
      try{
        const resultId = await client.execute("SELECT id_song FROM songs WHERE id_song = ?", [idSong]);
        
        if (resultId.rowLength == 0) {
          throw new ServerError(`Song not found.`, 404);
        }

        const result = await client.execute("DELETE FROM songs WHERE id_song = ?", [idSong]);
  
        if (result.info.queriedHost) {
          return result;
        } else {
          throw new ServerError("Guard failed.", 400);
        }
      }catch (error) {
        if(error instanceof ServerError){
          throw error;
        }
        throw new ServerError("Error trying to delete the song.", 500);
      }
    }
  }
  module.exports = new SongServices();