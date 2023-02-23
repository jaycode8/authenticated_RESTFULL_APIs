const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema({
    name :String,
    location : String,
    email: String,
    password: String,
    publishedBooks:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "books"
    }]
},{timestamps: true});

const booksSchema = new mongoose.Schema({
    name: String,
    publishYear : Number,
    author : String,
    publisher :{
        type: mongoose.Schema.Types.ObjectId,
        ref : "publishers",
        required : true
    }
}, {timestamps : true});

module.exports = { publisherSchema, booksSchema }
