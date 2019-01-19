const db = require('./mongodb').db;
const mongoose = require('./mongodb').mongoose;   // connection is already established @mongodb.js file.

//Creating SChema for the registration
let registerSchema = mongoose.Schema({
    //borrower details
    FirstName: String,
    LastName: String,
    Address: String,
    LicenseNumber: String,
    Email: String,
    Password: String,

    //For Renting book
    ISBN: String,
    FromDate: String,
    ToDate: String,
    ReturnedDate: String,
    FeeDate: Number,
    Fee: Number,
    Qty: Number

  
});



let registerModel = mongoose.model('register', registerSchema);

module.exports = { registerModel };
