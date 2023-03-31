const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const users = require('../model/users');
const uploadmodel = require('../model/upload');
const {apiResponse} = require('../response');
const StatusCodes = require('http-status-codes');
const {assignReviewer} = require('../service/upload.service');
const path = require('path');               
const fs = require('fs-extra');             
const {status, role} = require('../../config');

const getDoc = async (req, res)=>{
    let {status} = req.query;
    try {
        let getReviewList = await uploadmodel.find({status: status || 'unapproved'}).select('id filename filepath status createdAt').sort({createdAt: -1});
        apiResponse(req,res, getReviewList,StatusCodes.OK); 
    } catch (err) {
        apiResponse(req,res, err,StatusCodes.BAD_REQUEST); 
    }
}

const updateUser = async (req, res)=>{
    let {body, query:{id}} = req;
    try {
        if (body.role === "admin" || (!(body.role in role))){
            apiResponse(req,res,'Invalid Role',StatusCodes.BAD_REQUEST); 
            return;
        }
        let fetchUser= await users.findOne({id:id}).select('name, email role status');
        let updateBody = {
            name: body.name || fetchUser.name,
            email: body.email || fetchUser.email,
            role:  body.role || fetchUser.role,
            status:  body.status || fetchUser.status,
        }
        const updateusers = await users.findOneAndUpdate({id:id}, {$set: updateBody}, {new: true});
        
        apiResponse(req,res, updateusers,StatusCodes.OK); 
    } catch (err) {
        apiResponse(req,res, err,StatusCodes.BAD_REQUEST); 
    }
}

const getusers = async (req, res)=>{
    let {status, role} = req.query;
    try {
        let select = '';
        (role === 'reviewer')?select = 'id name email role status count createdAt' :select = 'id name email role status createdAt'; 
        
        const getUserList = await users.find({role: role || 'guest' ,status: status || 'active'}).select(select).sort({createdAt: -1});
        
        apiResponse(req,res, getUserList,StatusCodes.OK); 
    } catch (err) {
        apiResponse(req,res, err,StatusCodes.BAD_REQUEST); 
    }
}

const download = async (req,res)=>{
    let {file} = req?.query; 
    try {
        // let getreviewId = await users.findOne({id:req.id}).select('_id');
        // let getreviewId = await users.findOne({id:1052}).select('_id');
        console.log(getreviewId);
        const getfilepath = await uploadmodel.findOne({id:file}).select('filepath filename');
        if(!getfilepath){
            apiResponse(req,res, 'Invalid File Request',StatusCodes.BAD_GATEWAY);
            return; 
        }
        res.download(__dirname+`/upload/${getfilepath.filename}`);
        //  apiResponse(req,res, 'Download success fully'); 
        // res.send();
        
    }catch (err) {
        apiResponse(req,res, err,StatusCodes?.BAD_REQUEST); 
    }
}

const reviewstatus = async (req, res)=>{
    let {query:{file}, body} = req;
    try{
        let checkDoc = await uploadmodel.findOne({id:file}).select('id filename status');
        if(!checkDoc){
            apiResponse(req,res, 'Invalid File Request',StatusCodes.BAD_GATEWAY);
            return;
        }
        let statuscode =  status.includes(body.action);
        if(!statuscode){
            apiResponse(req,res,'Invalid Update status'); 
            return;
        }
        let updateStatus = await uploadmodel.findOneAndUpdate({id: file}, {$set: {status:body.action}}, {new: true});
        if(updateStatus){
            apiResponse(req,res,'Status Updated',StatusCodes.OK);
            return;
        }else{
            apiResponse(req,res,'Issue in Updating status',StatusCodes.BAD_REQUEST);
            return;
        }    
    }catch(err){
        apiResponse(req,res,err,StatusCodes.BAD_REQUEST);
    }
}

module.exports = {  
    getDoc,
    getusers,
    download,
    reviewstatus,
    updateUser,
}