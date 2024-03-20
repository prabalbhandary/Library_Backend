const express = require("express");
const Book = require("../models/book");

const router = express.Router();

router.post("/add", async (req, res) => {
    try {
        const bookData = req.body;
        const newBook = new Book(bookData);
        await newBook.save();
        res.status(200).json({
            message: "Book Added Successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
router.get("/getBooks", async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json({
            message: "All Books Fetched Successfully",
            books
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error fetching books"
        });
    }
});

router.get("/getBooks/:id", async (req, res) => {
    try {
        const __id = req.params.id;
        const book = await Book.findById(__id);
        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }
        res.status(200).json({
            book
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

router.put("/update/:id", async (req, res) => {
    try {
        const bookId = req.params.id;
        const bookData = req.body;
        const updatedBook = await Book.findByIdAndUpdate(bookId, bookData, { new: true });
        if (!updatedBook) {
            return res.status(404).json({
                message: "Book not found"
            });
        }
        res.status(200).json({
            message: "Book updated successfully",
            book: updatedBook
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const bookId = req.params.id;
        const deletedBook = await Book.findByIdAndDelete(bookId);
        if (!deletedBook) {
            return res.status(404).json({
                message: "Book not found"
            });
        }
        res.status(200).json({
            message: "Book deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

module.exports = router;
