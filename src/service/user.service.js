const StatusCodes = require('http-status-codes');
const uploadmodel = require('../model/upload');
const users = require('../model/users');
const {apiResponse} = require('../response');
const {baseUrl} = require('../../config');


const registerUserService = async(userData)=>{
    const saveUser = await new users(userData).save();
    return saveUser;
}

module.exports = {registerUserService}
