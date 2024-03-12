const cassandra = require('cassandra-driver');
const axios = require('axios');

const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_CONTACT_POINTS],
  localDataCenter: process.env.CASSANDRA_LOCAL_DATA_CENTER,
  keyspace: process.env.CASSANDRA_KEYSPACE,
  authProvider: new cassandra.auth.PlainTextAuthProvider(process.env.CASSANDRA_USERNAME, process.env.CASSANDRA_PASSWORD),
});

class BookServices {
  async initializeBooks(req, res){
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
      res.status(201).send("Books updated.");

    } catch (error) {
      res.status(500).send('Error trying to get the books.');
    }
  }
  async getAll(req, res){
    try{
      const result =  await client.execute("SELECT * FROM books;")

      if (result.rowLength > 0) {
        res.status(200).json(result.rows);
      } else {
        res.status(500).send(`There are no books to get.`);
      }

    }catch (error){
      console.error(error);
      res.status(500).send('Error trying to get the books.');
    }
  }
  
  async getById(req, res){
    try{
      const idBook = req.params.id_book;
      const result = await client.execute("SELECT * FROM books WHERE id_book = ?", [idBook]);
      
      if (result.rowLength > 0) {
        res.status(200).json(result.rows);
      } else {
        res.status(404).send(`Book not found.`);
      }
  
    }catch (error){
      console.error(error);
      res.status(500).send('Error trying to get the book.');
    }
  }

  async createBook(req, res){
    try{
      const {id_book, author, genres, pages, rating, title, year} = req.body;

      const result = await client.execute(
        "INSERT INTO books (id_book, author, genres, pages, rating, title, year) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id_book, author, genres, pages, rating, title, year], { prepare: true }
      );

      if (result.info.queriedHost) {
        res.status(201).send(`id: ${id_book}`);
      } else {
        res.status(400).send('Guard failed.');
      }
    }catch (error) {
      console.error(error);
      res.status(500).send('Error trying to create the book.');
    }
  }

  async updateBook(req, res){
    try{
      const idBook = req.params.id_book;
      const {author, genres, pages, rating, title, year} = req.body;

      const resultId = await client.execute("SELECT id_book FROM books WHERE id_book = ?", [idBook]);
        
      if (resultId.rowLength == 0) {
        return res.status(404).send(`Book not found.`);
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
        res.status(201).send(`Book updated.`);
      } else {
        res.status(400).send(`Guard failed`);
      }
    }catch(error){
      console.error(error);
      res.status(500).send('Error trying to update the book.');
    }
  }

  async deleteBook(req, res){
    try{
      const idBook = req.params.id_book;

      const resultId = await client.execute("SELECT id_book FROM books WHERE id_book = ?", [idBook]);
        
      if (resultId.rowLength == 0) {
        return res.status(404).send(`Book not found.`);
      }

      const result = await client.execute("DELETE FROM books WHERE id_book = ?", [idBook]);

      if (result.info.queriedHost) {
        res.status(204).send();
      } else {
        res.status(400).send(`Guard failed`);
      }
    }catch (error) {
      console.error(error);
      res.status(500).send('Error trying to delete the book.');
    }
  }

  async idError(req, res){
    res.status(400).send("Id not provided.");
  }
}
module.exports = new BookServices();