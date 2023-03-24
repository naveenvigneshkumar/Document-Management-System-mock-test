const logger = require('./logger');
const { v4: uuidv4 } = require('uuid');
const initLogger = async (req,res,next)=>{
    const {headers, httpsVersion, method, url} = req;
    req.reuestId= uuidv4();
    logger.info({headers, httpsVersion, method, url,'requestId':req.reuestId});
    next();
}

module.exports = {initLogger};