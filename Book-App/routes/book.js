const express = require('express');
const router = express.Router();
const bookForm = require('../models/bookModel');
var fs = require('fs');




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
            console.log("No Results"); 
        });
 
    
    res.send({success: true });
});

router.get('/info', function (req, res) {
    bookForm.bookModel.find().exec().then((data) => {
        res.send(data);
    }).catch((err) => {
        res.send("Error");
    })
});

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

// *********** Storing images **********************
// for(var i=1; i<=7; i++){
// var imgPath = '././images/'+3+'.png';
var A = bookForm.imageModel;
// var a = new A;
//     a.ISBN = "333"
//     a.img.data = fs.readFileSync(imgPath);
//     a.img.contentType = 'image/png';
//     a.save(function (err, a) {
//       if (err) throw err;

//       console.error('saved img to mongo');
//     }   
// ); 


    // router.get('/image/:isbn', function (req, res, next) {
    //     A.find({
    //         ISBN: req.params.isbn,
    //     }, {
    //         _id: 0,
    //         __v: 0
    //     }, (err, data) => {
    //         if (err) {
    //             res.status(500).send({
    //                 success: false,
    //                 message: 'Something went wrong.'
    //             });
    //         } else if (data.length === 0) {
    //             res.status(404).send({
    //                 success: false,
    //                 message: 'Invalid ISBN provided.'
    //             });
    //         } else {
    //             res.contentType(data.img.contentType);
    //             res.send(data.img.data);
    //         }
    //     });

        // A.findById( req.params.isbn, function(err,user) {
        //   if (err) return next(err);
        //   res.contentType(doc.img.contentType);
        //   res.send(doc.img.data);
        // });
    //   });
// }


// Get profile picture
router.get('/image/:_id', function(req,res,next) {
    A.findById( req.params._id, function(err,user) {
        if (err) return next(err);
        // res.contentType(user.img.contentType);
        // res.send(user.img.data);
        res.send(user.isbn);
    });
  });


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
module.exports = router;
