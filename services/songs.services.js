const cassandra = require('cassandra-driver');
const axios = require('axios');
require('dotenv').config();

const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_CONTACT_POINTS],
  localDataCenter: process.env.CASSANDRA_LOCAL_DATA_CENTER,
  keyspace: process.env.CASSANDRA_KEYSPACE,
  authProvider: new cassandra.auth.PlainTextAuthProvider(process.env.CASSANDRA_USERNAME, process.env.CASSANDRA_PASSWORD),
});

  class SongServices {
    async initializeSongs(req, res){
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

      async function getTrackInfo(trackId) {
        try{
          const accessToken = await getAccessToken();
        
          const response = await axios.get('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        
          const filteredTracks = [];
          const items = response.data.tracks.items;


          for (let i = 0; i < items.length; i++) {
            const track = items[i].track;
            const filteredTrack = {
              id_song: track.id,
              album: track.album.name,
              artist: track.artists.map(artist => artist.name).join(', '),
              duration: Math.round(track.duration_ms/1000),
              genres: track.artists.genres, 
              title: track.name,
              year: new Date(track.album.release_date).getFullYear(),
            };

            filteredTracks.push(filteredTrack);
          }

          for (const song of filteredTracks) {
            const { id_song, album, artist, duration, genres, title, year} = song;
            const query = 'INSERT INTO songs (id_song, album, artist, duration, genres, title, year) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const params = [id_song, album, artist, duration, genres, title, year];
          
            await client.execute(query, params, { prepare: true });
          }
          res.status(201).send("Songs updated.");
        } catch (error) {
          res.status(500).send('Error trying to initialize the songs.');
        }
      }      
      getTrackInfo() 
    }

    async getAll(req, res){
      try{
        const result =  await client.execute("SELECT * FROM songs;");
        
        if (result.rowLength > 0) {
          res.status(200).json(result.rows);
        } else {
          res.status(500).send(`There are no songs to get.`);
        }
  
      }catch (error){
        console.error(error);
        res.status(500).send('Error trying to get the songs.');
      }
    }
    
    async getById(req, res){
      try{
        const idSong = req.params.id_song;
        const result = await client.execute("SELECT * FROM songs WHERE id_song = ?", [idSong]);
  
        if (result.rowLength > 0) {
          res.status(200).json(result.rows);
        } else {
          res.status(404).send(`Song not found.`);
        }
   
      }catch (error){
        console.log(error);
        res.status(500).send('Error trying to get the song.');
      }
    }
  
    async createSong(req, res){
      try{
        const {id_song, album, artist, duration, genres, title, year} = req.body;
  
        const result = await client.execute(
          "INSERT INTO songs (id_song, album, artist, duration, genres, title, year) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [id_song, album, artist, duration, genres, title, year], { prepare: true }
        );
        
        if (result.info.queriedHost) {
          res.status(201).send(`id: ${id_song}`);
        } else {
          res.status(400).send('Guard failed.');
        }
      }catch (error) {
        res.status(500).send('Error trying to create the song.');
      }
    }
  
    async updateSong(req, res){
      try{
        const idSong = req.params.id_song;
        const {album, artist, duration, genres, title, year} = req.body;
  
        const resultId = await client.execute("SELECT id_song FROM songs WHERE id_song = ?", [idSong]);
        
        if (resultId.rowLength == 0) {
          return res.status(404).send(`Song not found.`);
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
        if (year !== undefined) {
          updateQuery += " year = ?,";
          updateValues.push(year);
        }
        
        updateQuery = updateQuery.slice(0, -1);
        updateQuery += ` WHERE id_song = ?`;
        updateValues.push(idSong);
  
        const result = await client.execute(updateQuery, updateValues, { prepare: true });
  
        if (result.info.queriedHost) {
          res.status(201).send(`Song updated.`);
        } else {
          res.status(400).send(`Guard failed.`);
        }
      }catch(error){
        res.status(500).send('Error trying to update the song.');
      }
    }
  
    async deleteSong(req, res){
      try{
        const idSong = req.params.id_song;

        const resultId = await client.execute("SELECT id_song FROM songs WHERE id_song = ?", [idSong]);
        
        if (resultId.rowLength == 0) {
          return res.status(404).send(`Song not found.`);
        }

        const result = await client.execute("DELETE FROM songs WHERE id_song = ?", [idSong]);
  
        if (result.info.queriedHost) {
          res.status(204).send();
        } else {
          res.status(400).send(`Guard failed.`);
        }
      }catch (error) {
        res.status(500).send('Error trying to delete the song.');
      }
    }
  
    async idError(req, res){
      res.status(400).send("Id not provided.");
    }
  }
  module.exports = new SongServices();