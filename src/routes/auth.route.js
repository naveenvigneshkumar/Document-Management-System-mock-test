const express = require("express");
const router = express.Router();
const {verifyJWT, verifyRole} = require('../middleware/auth.middleware');
const {register, login, uploadFile,  getdoclist, getDoc, refershToken} = require('../controller/auth.controller');
const {role} = require("../../config");
const {registerValidator,loginValidator,getDocValidator,validate} = require('../middleware/validator/guest.validator')

router.post('/register',
    registerValidator,
    validate,
    register
);

router.put('/refreshtoken',
    refershToken
);

router.post('/login',
    loginValidator,
    validate,
    login
);

router.post('/upload',
    verifyJWT,
    verifyRole(role.guest),
    uploadFile
)

router.get('/get/list',
    verifyJWT,
    verifyRole(role.guest),
    getdoclist
);

router.get('/get/doc',
    getDocValidator,
    validate,
    verifyJWT,
    verifyRole(role.guest),
    getDoc
)

module.exports = router;