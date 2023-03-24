const express = require("express"), app = express();
const cookieParser = require('cookie-parser');

// const createServer = ()=>{

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//middleware for cookies
app.use(cookieParser());

module.exports = app;

// return app;
// }

// module.exports ={
//     createServer
// }