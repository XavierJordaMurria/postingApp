const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = require('../models/user');
const jwtSecret = process.env.JWT_KEY;

exports.createUser = (req, res, next) => {
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
        });
    })
    .catch((e) => {
        console.error(e);
        res.status(500).json(
        {
            message:`Invalid authentification credentials , e:${e}`
        });
    });
}

exports.userLogin = (req, res, next) => {
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
        console.error(e);
        return res.status(401).json({
            message: "Invalid authentification credentials"
        });
    });
}
