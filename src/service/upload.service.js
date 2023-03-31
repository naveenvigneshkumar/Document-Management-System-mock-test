const StatusCodes = require('http-status-codes');
const uploadmodel = require('../model/upload');
const users = require('../model/users');
const {apiResponse} = require('../response');
const nodemailer = require('nodemailer');
const ejs = require("ejs");
const path = require("path");
const {baseUrl} = require('../../config');
require("dotenv").config();

const assignReviewer = async (req,res,filepath,filename, customerId)=>{
    try{
        let reviewerId= await users.findOne({role: 'reviewer', status: 'active'}).select('_id count').sort({count: 1})
        const save = await new uploadmodel({
            filename: filename,
            filepath: filepath,
            id: Math.floor(1000 + Math.random() * 9000),
            reviewerId: reviewerId._id,
            guestId: customerId,
        }).save();
        await users.findOneAndUpdate({_id:reviewerId._id}, {$set:{count:reviewerId.count +1}});
        let fetch = await uploadmodel.findOne({_id: save._id}).select('_id filename filepath reviewerId').populate('reviewerId','name id email');
        if(process.env.TEST_SUIT === 'false'){
            sendMailToReviewer(fetch.reviewerId.email,fetch.reviewerId.name, filename)
            return fetch.reviewerId.name;
        }else{
            return "reviewer";
        }
    }catch(err){
        apiResponse(req,res, err,StatusCodes.BAD_REQUEST);
    }
}

const sendMailToReviewer = async(reviewerEmail, reviewName, filename)=>{
    const requiredPath = path.join(__dirname, "../views/notification.ejs");
    const ejsTemplate = await ejs.renderFile(requiredPath, {
        reviewName: reviewName,
        filename: filename,
        baseUrl: baseUrl
      });
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'naveenaspiresys123@gmail.com',
            pass: 'zjyavgoadovtsoyb'
        }
    });
    let mailDetails = {
        from: 'naveenaspiresys123@gmail.com',
        to: reviewerEmail,
        subject: 'New File Assigned',
        html: ejsTemplate
    };
    let response = {}
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs');
            response.message = 'Error Occurs';
        } else {
            console.log('Email sent successfully');
            response.message = 'Email sent successfully';
        }
    });
    return response;
}

module.exports = {
    assignReviewer,
    sendMailToReviewer
}