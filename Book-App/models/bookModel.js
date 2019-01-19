const db = require('./mongodb').db;
const mongoose = require('./mongodb').mongoose;   // connection is already established @mongodb.js file.

//Creating the Schema for book
let bookSchema = mongoose.Schema({
    ISBN: String,
    BookName: String,
    Author: String,
    PricePerDay: Number,
    AvailableDate: String,
    RentedBy: String,
    Rented: Number,
    Description: String
});


let bookModel = mongoose.model('book', bookSchema);

module.exports = { bookModel };
