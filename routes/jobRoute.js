const express = require("express");
const router = express.Router();

const jobController = require('./../controllers/jobController');


router.route('/').get(jobController.getJobList).post(jobController.postResume);
router.route("/:id").get(jobController.getJobDetailsById);


module.exports = router;