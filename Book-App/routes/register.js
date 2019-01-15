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
            Password: req.body.password
        });

        registerData.save(err => { 
            console.log(err); 
        });
    }
    
    res.send({ success: allParamsPresent });
});

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
                message: 'Invalid License ID provided.'
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
