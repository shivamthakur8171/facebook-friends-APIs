const route = require('express').Router();
const users = require('./../controller/regLogin');

route.post('/reg',users.userRegistration);
route.post('/login',users.userLogin);
route.post('/forgetpassword',users.forgetPassword);

module.exports = route;