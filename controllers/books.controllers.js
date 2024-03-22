const bookServices = require("../services/books.services");

class BooksController {
    async initializeBooks(req, res){
        const result = await bookServices.initializeBooks();
        res.status(201).send("Books updated.");
    }

    async getAllBooks(req, res){
        const result = await bookServices.getAll();
        res.status(200).json(result);    
	}

    async getById(req, res){
        const result = await bookServices.getById(req.params.id_book);
        res.status(200).json(result);  
    }

    async createBook(req, res){
        const {id_book, author, genres, pages, rating, title, year} = req.body;
        const result = await bookServices.createBook(id_book, author, genres, pages, rating, title, year);
        res.status(201).send(`id: ${id_book}`);
    }

    async updateBook(req, res){
        const {author, genres, pages, rating, title, year} = req.body;
        const result = await bookServices.updateBook(req.params.id_book, author, genres, pages, rating, title, year);
        res.status(201).send(`Book updated.`);
    }

    async deleteBook(req, res){
        const result = await bookServices.deleteBook(req.params.id_book);
        res.status(204).send();
    }

    async idError(req, res){
        res.status(400).send("Id not provided.");
    }
}

module.exports = new BooksController();