const route = require('express').Router();
const user = require('./../controller/allUser');
const auth = require('./../middleware/authantication');

route.get('/showalluser',auth.authantication,user.allUserShow);
route.get('/allfriends',auth.authantication,user.allFriends);
route.get('/allrequest',auth.authantication,user.allRequest);
route.post('/sendrequest/:id',auth.authantication,user.sendRequest);
route.post('/acceptrequest/:id',auth.authantication,user.acceptRequest);
route.post('/unfriend/:id',auth.authantication,user.unfriend)


module.exports = route;