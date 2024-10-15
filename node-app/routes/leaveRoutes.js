const express = require('express');
const router = express.Router();
const LeaveController = require('../controllers/leaveController'); 
const authMiddleware = require("../middleware/authJwt"); 
 

// Routes
router.post('/leaves', LeaveController.createLeaveRequest);
router.put('/leaves/:leaveId/approve', LeaveController.approveLeaveRequest);
router.get('/leave/viewall',authMiddleware("viewall"),LeaveController.viewLeave);

module.exports = router;
