const db = require('./mongodb').db;
const mongoose = require('./mongodb').mongoose;   // connection is already established @mongodb.js file.

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

let imageSchema = mongoose.Schema({
    img: { data: Buffer, contentType: String }
});

let bookModel = mongoose.model('book', bookSchema);
let imageModel = mongoose.model('image', imageSchema);

module.exports = { bookModel, imageModel };
