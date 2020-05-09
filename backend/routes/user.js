const express = require("express")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/user');
const jwtSecret = "secret_this_should_be_longer";

router.post('/login', (req, res, next) => {
    let loadedUser;
    User.findOne({email: req.body.email})
    .then((user)=>{
        if(!user){
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        loadedUser = user;
        return bcrypt.compare(req.body.password, user.password)
        
    })
    .then((resultBcrypt)=>{
        if(!resultBcrypt){
            return res.status(401).json({
                message: "Auth failed"
            });
        }

        // creating JWT
        const token = jwt.sign({email: loadedUser.email, userId: loadedUser._id}, 
            jwtSecret,
            {expiresIn: '1h'}
        );

        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: loadedUser._id
        });

    })
    .catch((e)=>{
        return res.status(401).json({
            message: "Auth failed"
        });
    });
});


router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then((hash)=>{
        const user = new User({
            email: req.body.email,
            password: hash
        });
        console.log(user);
        user.save()
        .then((response)=>{
            res.status(201).json({
                message: 'user created',
                result: response
            });
        })
        .catch((e) => {
            res.status(500).json({
                error: `Error saving user, e:${e}`
            });
        });
    });
});

module.exports = {
    routes: router,
    jwtSecret: jwtSecret
};
