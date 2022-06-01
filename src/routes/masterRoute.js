const masterRoute = require('express').Router();
const user = require('./user');
const friends = require('./friendsRoute');

masterRoute.use('/user', user);
masterRoute.use('/friends', friends);

// masterRoute.use('/home',(req,res,next)=>{
//     if(req.user == null){
//         return next(customError(325,"user is null"));
//     }
// })

// masterRoute.use((req, res, next) => {
//     next(customError(404, "Page Not Found"));
// })

// masterRoute.use((err, req, res, next) => {
//     res.status(err.status).json(err);
// })

// function customError(status = 400, msg = "something wents wrong") {
//     let data = {
//         status: status,
//         msg: msg
//     }
//     return data;
// }

module.exports = masterRoute;