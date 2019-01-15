const express = require('express');
const router = express.Router();
const register = require('../models/registerModel');
const randomize = require('randomatic');


/**
 * Default GET Request
 */
router.get('/', function (req, res) {
    register.registerModel.find().exec().then((data) => {
        res.send(data);
    }).catch((err) => {
        res.send("Error");
    })
});

/**
 * POST Request
 * This route accept all routes come from /login/
 */
router.post('/', function (req, res) {
    checkUserExists(req, res);
});

/**
 * First we check given login credentials match with student table
 * if not we check it in supervisor table
 * @param req
 * @param res
 */
function checkUserExists(req, res) {

    register.registerModel.find({
            Email: req.body.userEmail,
            Password: req.body.userPassword
        }, {
            LicenseNumber: 0,
            Address: 0,
            __v: 0
        }, (err, data) => {
            if (err) {
                res.status(404).send({
                    success: false,
                    info: "Not Found"
                });
            } else if (data.length === 0) {
                res.status(404).send({
                    success: false,
                    info: "Not Found"
                });
            } else {
                res.status(200).send({
                    success: true,
                    info: data

                });
            }
        });
}



module.exports = router;
