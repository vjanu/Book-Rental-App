const express = require('express');
const router = express.Router();
const rentForm = require('../models/rentModel');

//Inserting rented books
router.post('/:isbn', function(req, res) {
    let isbn = req.params.isbn;
    let allParamsPresent = true;

    if (allParamsPresent) {
        let rentData = rentForm.rentModel({
            Email: req.body.Email,
            ISBN: isbn,
            BookName: req.body.BookName,
            Author: req.body.Author,
            Fee: req.body.Fee
        
        });

        rentData.save(err => { 
            console.log(err); 
        });
    }
    
    res.send({ success: rentData.Email });
});


//Getting books rented by particular borrower
router.get('/:email', function (req, res) {
    console.log(req.params.email)
    rentForm.rentModel.find({
        Email: req.params.email,
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
                message: 'Invalid email provided.'
            });
        } else {
            res.send(data);
            
        }
    });
});

//Updating late fees after books is returned
router.post('/book/:isbn', (req, res) => {
    var isbn = req.params.isbn;
    rentForm.rentModel.update({ ISBN: isbn }, { 
        Fee: req.body.Fee

    }, function(err, result){
        res.status(200).send({ success: true, message: req.body.Fee  });
    }
 );
});



module.exports = router;
