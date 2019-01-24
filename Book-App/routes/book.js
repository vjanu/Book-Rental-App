const express = require('express');
const router = express.Router();
const bookForm = require('../models/bookModel');
var fs = require('fs');
var formidable = require('formidable');
var multer = require('multer');



//POST request to add a new book
router.post('/', function(req, res) {

        let bookData = bookForm.bookModel({
            ISBN: req.body.ISBN,
            BookName: req.body.BookName,
            Author: req.body.Author,
            PricePerDay: req.body.PricePerDay,
            AvailableDate: req.body.AvailableDate,
            RentedBy: req.body.RentedBy,
            Rented: req.body.Rented,
            Description: req.body.Description
        });

        bookData.save(err => { 
            console.log(err); 
        });
 
    
    res.send({success: true });
});


//Getting all the books in the library
router.get('/info', function (req, res) {
    bookForm.bookModel.find().exec().then((data) => {
        res.send(data);
    }).catch((err) => {
        res.send("Error");
    })
});


//Getting relevant book using ISBN
router.get('/info/:isbn', function (req, res) {
    bookForm.bookModel.find({
        ISBN: req.params.isbn,
    }, {
        _id: 0,
        __v: 0
    }, (err, data) => {
        if (err) {
            res.status(500).send({
                success: false,
                message: 'Something went wrong.'
            });
        } else if (data.length === 0) {
            res.status(404).send({
                success: false,
                message: 'Invalid ISBN provided.'
            });
        } else {
            res.status(200).send({
                success: true,
                data: data
            });
        }
    });
});

//Getting relevant rented book 
router.get('/rent', function (req, res) {
    bookForm.bookModel.find({
        Rented: 0,
    }, {
        _id: 0,
        __v: 0
    }, (err, data) => {
        if (err) {
            res.status(500).send({
                success: false,
                message: 'Something went wrong.'
            });
        } else if (data.length === 0) {
            res.status(404).send({
                success: false,
                message: 'Invalid ISBN provided.'
            });
        } else {
            res.send(data);
        }
    });
});

//Finding rented book using ISBN
router.get('/rent/x/:isbn', function (req, res) {
    A.findOne({
        ISBN: req.params.isbn,
    }, {
        _id: 0,
        __v: 0
    }, (err, data) => {
        if (err) {
            res.status(500).send({
                success: false,
                message: 'Something went wrong.'
            });
        } else if (data.length === 0) {
            res.status(404).send({
                success: false,
                message: 'Invalid ISBN provided.'
            });
            res.status(200).send({
               
                message: data
            });
        }
    });
});

// Updating rented flag after return of the book
router.post('/returned/:isbn', (req, res) => {
    var isbn = req.params.isbn;
    bookForm.bookModel.updateOne({ ISBN: isbn }, { 
        Rented: 0
    
    
    }, function(err, result){
        res.status(200).send({ success: true, message:"Updated"  });
    }
 );
});

//Updating book after renting it
router.post('/:isbn', (req, res) => {
    var isbn = req.params.isbn;
    bookForm.bookModel.updateOne({ ISBN: isbn }, { 
        Rented: 1,
        AvailableDate: req.body.availableDate,
        RentedBy: req.body.rentedBy
    
    
    }, function(err, result){
        res.status(200).send({ success: true, message:"Updated"  });
    }
 );
});


var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "../Book-App/public/images");
    },
    filename: function(req, file, callback) {
        console.log("file:")
        callback(null, file.originalname);
    }
});

var upload = multer({
    storage: Storage
}).array("imgUploader", 3);

router.get("/image", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});
router.post("/api/Upload/", function(req, res) {
    var isbn = req.params.isbn
    upload(req, res, function(err) {
        if (err) {
            return res.end("Something went wrong!"+ err);
        }
        res.send("<b>Image Uploaded Successfully</b><br/><a href='http://localhost:3000/add_books.html' class='btn btn-primary btn-sm'>Go Back</a>");
    });
});

module.exports = router;
