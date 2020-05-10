const express = require("express")

const router = express.Router();

const userController = require('../controllers/user');

const jwtSecret = "";

router.post('/login', userController.userLogin);
router.post('/signup', userController.createUser);

module.exports = {
    routes: router,
    jwtSecret: jwtSecret
};
