const {check ,body, validationResult} = require('express-validator');
const {apiResponse} = require('../../response')
const StatusCodes = require('http-status-codes');

const registerValidator = [
    body('name').notEmpty().withMessage("name should not be empty").isString().withMessage("name should be string"),
    body('email').notEmpty().withMessage("email should not be empty").isString().withMessage("email should be string").isEmail().withMessage('Invalid Email Format'),
    body('password').notEmpty().withMessage("password should not be empty").isString().withMessage("password should be string").isLength({ min: 8}).withMessage('length should be greater than 8 character'),
];

const loginValidator = [
    body('email').notEmpty().withMessage("email should not be empty").isString().withMessage("email should be string").isEmail().withMessage('Invalid Email Format'),
    body('password').notEmpty().withMessage("password should not be empty").isString().withMessage("password should be string").isLength({ min: 8}).withMessage('Password length should be greater than 8 character'),
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
module.exports= {
    registerValidator,
    loginValidator,
    getDocValidator,
    validate,
}