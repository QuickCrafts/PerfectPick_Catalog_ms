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

class BookServices {
  async initializeBooks(){
    const apiKey = process.env.API_KEY_GOOGLE_BOOKS;
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=cronica&maxResults=40&key=${apiKey}`);

      const formattedBooks = response.data.items.map(book => ({
        id_book: book.id,
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : null,
        year: book.volumeInfo.publishedDate ? new Date(book.volumeInfo.publishedDate).getFullYear() : null,
        rating: book.volumeInfo.averageRating || null,
        genres: book.volumeInfo.categories ? book.volumeInfo.categories.join(', ') : null,
        pages: book.volumeInfo.pageCount || null,
      }));

      for (const book of formattedBooks) {
        const { id_book, title, author, year, rating, genres, pages} = book;
        const query = 'INSERT INTO books (id_book, title, author, year, rating, genres, pages) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const params = [id_book, title, author, year, rating, genres, pages];
      
        await client.execute(query, params, { prepare: true });
      }

    } catch (error) {
      console.error(error);
      throw new ServerError("Error trying to initialize the books.", 500);
    }
  }

  async getAll(){
    try{
      const result =  await client.execute("SELECT * FROM books;")

      if (result.rowLength > 0) {
        return result.rows;
      } else {
        throw new ServerError("There are no books to get.", 500);
      }

    }catch (error){
      if(error instanceof ServerError){
        throw error;
      }
      throw new ServerError("Error trying to get the books.", 500);
    }
  }
  
  async getById(idBook){
    try{
      const result = await client.execute("SELECT * FROM books WHERE id_book = ?", [idBook]);
      
      if (result.rowLength > 0) {
        return result.rows;
      } else {
        throw new ServerError("Book not found.", 404);
      }
  
    }catch (error){
      if(error instanceof ServerError){
        throw error;
      }
      throw new ServerError("Error trying to get the books.", 500);
    }
  }

  async createBook(id_book, author, genres, pages, rating, title, year){
    try{
      const result = await client.execute(
        "INSERT INTO books (id_book, author, genres, pages, rating, title, year) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id_book, author, genres, pages, rating, title, year], { prepare: true }
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
      console.error(error);
      throw new ServerError("Error trying to create the book.", 500);
    }
  }

  async updateBook(idBook, author, genres, pages, rating, title, year){
    try{
      const resultId = await client.execute("SELECT id_book FROM books WHERE id_book = ?", [idBook]);
        
      if (resultId.rowLength == 0) {
        throw new ServerError("Book not found.", 404);
      }

      let updateQuery = "UPDATE books SET";
      const updateValues = [];

      if (author !== undefined) {
        updateQuery += " author = ?,";
        updateValues.push(author);
      }
      if (genres !== undefined) {
        updateQuery += " genres = ?,";
        updateValues.push(genres);
      }
      if (pages !== undefined) {
        updateQuery += " pages = ?,";
        updateValues.push(pages);
      }
      if (rating !== undefined) {
        updateQuery += " rating = ?,";
        updateValues.push(rating);
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
      updateQuery += ` WHERE id_book = ?`;
      updateValues.push(idBook);

      const result = await client.execute(updateQuery, updateValues, { prepare: true });

      if (result.info.queriedHost) {
        return result;
      } else {
        throw new ServerError("Guard failed.", 400);
      }
    }catch(error){
      if(error instanceof ServerError){
        throw error;
      }
      throw new ServerError("Error trying to update the book.", 500);
    }
  }

  async deleteBook(idBook){
    try{
      const resultId = await client.execute("SELECT id_book FROM books WHERE id_book = ?", [idBook]);
        
      if (resultId.rowLength == 0) {
        throw new ServerError("Book not found.", 404);
      }

      const result = await client.execute("DELETE FROM books WHERE id_book = ?", [idBook]);

      if (result.info.queriedHost) {
        return result;
      } else {
        throw new ServerError("Guard failed.", 400);
      }
    }catch (error) {
      console.error(error);
      throw new ServerError("Error trying to delete the book.", 500);
    }
  }
}
module.exports = new BookServices();