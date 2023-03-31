const jwt = require('jsonwebtoken');
const users = require('../model/users');
const {apiResponse} = require('../response');
const logger = require('../utils/logger');
const StatusCodes = require('http-status-codes');

const verifyJWT = (req,res,next)=>{
    try{   
        let token = req.headers.authorization.split(" ")[1] || req.headers.Authorization.split(" ")[1]; 
		const decode =  jwt.verify(token,process.env.JWT);
		req.id = decode.id;
        req.role = decode.role;
		next();    
    }catch(err){
        apiResponse(req,res,'Invalid JWT Token',StatusCodes.UNAUTHORIZED);
    }
};

const verifyRole = (role)=>{
    return (req, res ,next)=>{
        if(req?.role === role) { 
            next(); 
        }else{
            apiResponse(req,res,'Unauthorization Access',StatusCodes.UNAUTHORIZED);
        }
    }
}

module.exports = {
    verifyJWT,
    verifyRole
};