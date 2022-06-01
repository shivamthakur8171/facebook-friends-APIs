const dotenv = require('dotenv');
dotenv.config();
const connect = require('./db/conn');
const cookieParser = require('cookie-parser');
const express = require('express');
const masterRoute = require('./routes/masterRoute');
const app = express();
const port = process.env.PORT;

connect.Connect();
app.use(express.json());
app.use(cookieParser());
app.use(masterRoute);

app.listen(port , () =>{
    console.log(`server is running on the port no ${port}`);
})
