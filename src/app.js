const express = require("express"), app = express();
const cookieParser = require('cookie-parser');

require("dotenv").config();
const mongoose = require('mongoose');
const StatusCodes = require('http-status-codes');
const logger = require('./utils/logger');
const authRouter = require('./routes/auth.route');
const reviewerRouter = require('./routes/review.route');
const adminRouter = require('./routes/admin.route');
const {initLogger} = require('./utils/init.logger');
const {verifyJWT, verifyRole} = require('./middleware/auth.middleware');
const {role} = require("../config");
const busboy = require('connect-busboy')

// const createServer = ()=>{

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//middleware for cookies
app.use(cookieParser());


let mongodbURL = process.env.TEST_SUIT === 'true' ? process.env.MONGO_DB_TEST : process.env.MONGO_DB

mongoose.connect(mongodbURL, {useNewUrlParser: true}).then((res)=>{
    logger.info(`connect on db ${mongodbURL}`)
}).catch((err)=>{
    logger.error(`Error on connect db URL:${mongodbURL} Error: ${err}`);
});

app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware

app.use(initLogger);
app.use('/v1/',authRouter);
app.use('/v1/review',verifyJWT,verifyRole(role.reviewer),reviewerRouter);
app.use('/v1/admin',verifyJWT,verifyRole(role.admin),adminRouter);

module.exports = app;

// return app;
// }

// module.exports ={
//     createServer
// }