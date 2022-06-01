const mongoose = require("mongoose");

// create a schema for user registration
const friendSchema = new mongoose.Schema({
    userId : {
        type : "ObjectId"
    },
    friends : [{
        friendsId : {
          type : "ObjectId",
          ref : "user"  
        }, 
        request : {
            type : Boolean,
            default : false
        },
   }]
}, { timestamps: true });


// create a collection using Models
module.exports = new mongoose.model("friend", friendSchema);