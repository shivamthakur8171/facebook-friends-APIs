const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

module.exports.bcryptPassword = (password) =>{
    return bcrypt.hash(password, 10);
}

module.exports.comparePassword = (password , userPassword) =>{
    return bcrypt.compare(password, userPassword);
}

module.exports.jwtToken = (id) =>{
    return jwt.sign({ _id: id }, process.env.SECRET_KEY, { expiresIn: '24h' });
}

module.exports.verifyToken = (token) =>{
    return jwt.verify(token, process.env.SECRET_KEY);
}