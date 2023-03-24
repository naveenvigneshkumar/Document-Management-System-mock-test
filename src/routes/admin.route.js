const express = require("express");
const router = express.Router();
const {getDoc, getusers, updateUser, download, reviewstatus} = require('../controller/admin.controller');
const {updateUserValidator,updateDocStatusValidator, validate} = require('../middleware/validator/admin.validator');

router.get('/get/users/list',
    getusers
)

router.put('/update/user',
    updateUserValidator,
    validate,
    updateUser
)

router.get('/get/doc/list',
    getDoc
)

router.put('/update/status',
    updateDocStatusValidator,
    validate,
    reviewstatus
)

router.get('/get/download',
    download
)

module.exports = router;