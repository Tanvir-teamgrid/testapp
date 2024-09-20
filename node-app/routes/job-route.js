const express = require('express');
const router = express.Router();
const JobController = require('../controllers/job-controller'); // Adjust the path if needed

 
router.post('/job/post', JobController.postJob);

 

 
router.get('/job/list', JobController.viewJobs); 

// // GET route to fetch a single job by ID
// router.get('/job/:id', JobController.getJobById); 
// // PUT route to update a job by ID (with optional file upload for company logo)
// router.put('/job/update/:id', JobController.updateJob); 

 
// router.delete('/job/delete/:id', JobController.deleteJob);

module.exports = router;
