const StatusCodes = require('http-status-codes');
const logger = require('./utils/logger');
const apiResponse = async (req,res, result, status = StatusCodes.OK)=>{
    logger.info({'reponse_message':result,'statusCode':status, 'requestId':req.reuestId});
    res.status(status).json({result});
    return
}

module.exports = {
    apiResponse
};