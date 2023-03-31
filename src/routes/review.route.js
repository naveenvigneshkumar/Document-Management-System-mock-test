const express = require("express");
const router = express.Router();
const {reviewStatusValidator,getDocValidator,validate} = require('../middleware/validator/review.validator')
const {reviewDoc, download, reviewstatus, getDoc} = require('../controller/review.controller');

router.get('/get/reviewer/list',
    reviewDoc
)

router.put('/status',
    reviewStatusValidator,
    validate,
    reviewstatus
)

router.get('/get/download',
    download
)

router.get('/get/doc',
    getDocValidator,
    validate,
    getDoc
)


module.exports = router;