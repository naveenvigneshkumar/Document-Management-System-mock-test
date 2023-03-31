const {check ,body, validationResult} = require('express-validator');
const {apiResponse} = require('../../response')
const StatusCodes = require('http-status-codes');
const {status} = require('../../../config') 

const reviewStatusValidator = [
    check('file').notEmpty().withMessage("file should not be empty"),
    body('action').isIn(status).withMessage(`action should have only ${status}`)
]

const getDocValidator = [
    check('file').notEmpty().withMessage("file Id Should not be empty"),
]

const validate = (req,res,next)=>{
    let errors = validationResult(req); 
	if(!errors.isEmpty()){
        apiResponse(req,res,errors.errors[0].msg || errors,StatusCodes.BAD_REQUEST);
        return;
	}
	next();
}

module.exports = {
    reviewStatusValidator,
    getDocValidator,
    validate
}