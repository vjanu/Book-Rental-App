const db = require('./mongodb').db;
const mongoose = require('./mongodb').mongoose;   // connection is already established @mongodb.js file.

let registerSchema = mongoose.Schema({
    // following are filled by student.
    FirstName: String,
    LastName: String,
    Address: String,
    LicenseNumber: String,
    Email: String,
    Password: String
  
});



let registerModel = mongoose.model('register', registerSchema);

module.exports = { registerModel };
