const {check ,body, validationResult} = require('express-validator');
const {apiResponse} = require('../../response')
const StatusCodes = require('http-status-codes');
const {role} = require('../../../config');

const updateUserValidator = [
    check('id').notEmpty().withMessage("id Should not be empty"),
    // body('status').notEmpty().withMessage("Status Should not be empty"),
];

const updateDocStatusValidator = [
    check('file').notEmpty().withMessage("file Should not be empty"),
    body('action').notEmpty().withMessage('action Should not be empty')
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
    updateUserValidator,
    updateDocStatusValidator,
    validate
}


