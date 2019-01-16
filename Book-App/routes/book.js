const express = require('express');
const router = express.Router();
const bookForm = require('../models/bookModel');
var fs = require('fs');




router.post('/', function(req, res) {

        let bookData = bookForm.bookModel({
            ISBN: req.body.isbn,
            BookName: req.body.bookName,
            Author: req.body.author,
            PricePerDay: req.body.pricePerDay,
            AvailableDate: req.body.availableDate,
            RentedBy: req.body.rentedBy,
            Rented: req.body.rented,
            Description: req.body.description
        });

        bookData.save(err => { 
            console.log(err); 
        });
 
    
    res.send({success: "Successfully Added" });
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

module.exports = router;
