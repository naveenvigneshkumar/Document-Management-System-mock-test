const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const users = require('../model/users');
const uploadmodel = require('../model/upload');
const {apiResponse} = require('../response');
const StatusCodes = require('http-status-codes');
const {assignReviewer} = require('../service/upload.service');
const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');             // Classic fs
const {status} = require('../../config');

const reviewDoc = async (req, res)=>{
    let {action} = req.query;
    try {
        let getreviewId = await users.findOne({id:req.id}).select('_id');
        let getReviewList = await uploadmodel.find({reviewerId: getreviewId, status: action || 'unapproved'}).select('id filename filepath status createdAt').sort({createdAt: -1});
        apiResponse(req,res, getReviewList,StatusCodes.OK); 
    } catch (err) {
        apiResponse(req,res, err,StatusCodes.BAD_REQUEST); 
    }
}

const download = async (req,res)=>{
    let {file} = req?.query; 
    try {
        console.log({id:req.id});
        let getreviewId = await users.findOne({id:req.id}).select('_id');
        // let getreviewId = await users.findOne({id:5340}).select('_id');
        console.log(getreviewId);
        const getfilepath = await uploadmodel.findOne({reviewerId: getreviewId, id:file}).select('filepath filename');
        if(!getfilepath){
            apiResponse(req,res, 'Invalid File Request',StatusCodes.BAD_GATEWAY);
            return; 
        }
        const uploadPath = path.join(__dirname, '../../upload/');  
        res.download(uploadPath+`${getfilepath.filename}`);
        // apiResponse(req,res, 'Download success fully'); 
        // res.send();
        
    }catch (err) {
        apiResponse(req,res, err,StatusCodes?.BAD_REQUEST); 
    }
}

const reviewstatus = async (req, res)=>{
    let {query:{file}, body} = req;
    try{
        let getreviewId = await users.findOne({id:req.id}).select('_id');
        let checkDoc = await uploadmodel.findOne({id:file, reviewerId: getreviewId}).select('id filename status');
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

const getDoc = async (req,res)=>{
    let { file} = req.query;
    if(!file){
        apiResponse(req, res,"File Id is required", StatusCodes.BAD_REQUEST);
        return;
    }
    try{
        let getreviewId = await users.findOne({id:req.id}).select('_id');
        let checkDoc = await uploadmodel.findOne({id:file, reviewerId: getreviewId}).select('id filename status');
        if(!checkDoc){
            apiResponse(req,res, 'Invalid File Request',StatusCodes.BAD_GATEWAY);
            return;
        }
        let getDoc= await uploadmodel.findOne({reviewerId: getreviewId, id:file }).select('id filename reviewerId status createdAt ').populate('reviewerId','name id');
        apiResponse(req,res, getDoc);    
    }catch(err){
        apiResponse(req, res,err, StatusCodes.BAD_REQUEST);
    }
}


module.exports = {  
      reviewDoc,
      download,
      reviewstatus,
      getDoc,
}