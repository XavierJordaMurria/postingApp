const jwt = require('jsonwebtoken');
const user = require('../routes/user');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1]; // e.g "Bearer asdfñjkñasd0f9qu2451"
        jwt.verify(token, user.jwtSecret);
        next();
    } catch(e){
        res.status(401).json({message: "Auth failed!"});
    }

};