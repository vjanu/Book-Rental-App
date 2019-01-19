const express = require('express');
const router = express.Router();
const regForm = require('../models/registerModel');

/* POST register data: User */
router.post('/info/user/:lno', function(req, res) {
    let lno = req.params.lno;
    let allParamsPresent = true;
    let paramKeys = Object.keys(req.body);

   
    for (let i = 0; i < paramKeys.length; i++) {
        let key = paramKeys[i];
        let param = req.body[key];

        if (param == '' || param == undefined) { allParamsPresent = false; break; }
    }

    if (allParamsPresent) {
        let registerData = regForm.registerModel({
            FirstName: req.body.firstName,
            LastName: req.body.lastName,
            Address: req.body.address,
            LicenseNumber: req.body.lno,
            Email: req.body.email,
            Password: req.body.password,
            ISBN: "0",
            FromDate: "0",
            ToDate: "0",
            ReturnedDate: "0",
            FeeDate: "0",
            Fee: 0,
            Qty: 0
        
        });

        registerData.save(err => { 
            console.log(err); 
        });
    }
    
    res.send({ success: allParamsPresent });
});


//Getting user details using the email
router.get('/info/user/:email', function (req, res) {
    regForm.registerModel.find({
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
            res.status(200).send({
                success: true,
                data: data
            });
        }
    });
});

//Updating user details
router.post('/info/:email', (req, res) => {
    var email = req.params.email;
    regForm.registerModel.updateOne({ Email: email }, { 
        ISBN: req.body.ISBN,
        FromDate: req.body.FromDate,
        ToDate: req.body.ToDate,
        ReturnedDate: req.body.ReturnedDate,
        FeeDate: req.body.FeeDate,
        Fee: req.body.Fee,
        Qty:req.body.Qty
    }, function(err, result){
        res.status(200).send({ success: true, message:"Updated"  });
    }
 );
});

//Updating returned book
router.post('/info/returned/:isbn', (req, res) => {
    var isbn = req.params.isbn;
    regForm.registerModel.updateOne({ ISBN: isbn }, { 
        ReturnedDate: req.body.ReturnedDate,
        FeeDate: req.body.FeeDate,
        Fee: req.body.Fee
    
    
    }, function(err, result){
        res.status(200).send({ success: true, message:"Updated"  });
    }
 );
});

//Getting relevant book the rented table
router.get('/bookmodel/:isbn', function (req, res) {
    regForm.registerModel.find({
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
                message: 'Invalid email provided.'
            });
        } else {
            res.status(200).send({
                success: true,
                data: data
            });
        }
    });
});

module.exports = router;
