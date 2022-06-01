const mongoose = require ('mongoose');

exports.Connect = () => {
    mongoose.connect(process.env.DB).then(() => {
        console.log("databse connection sucessfull");

    }).catch((err) => {
        console.log("no connection", err);
    })
}