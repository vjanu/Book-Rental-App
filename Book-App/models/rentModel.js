const db = require('./mongodb').db;
const mongoose = require('./mongodb').mongoose;   // connection is already established @mongodb.js file.

//Creating the Schema for renting a book
let rentSchema = mongoose.Schema({
    Email: String,
    ISBN: String,
    BookName: String,
    Author: String,
    Fee: Number
});


let rentModel = mongoose.model('rent', rentSchema);


module.exports = { rentModel };
