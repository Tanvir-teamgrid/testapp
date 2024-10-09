const express = require('express');
const { signUp, addOrganization, viewOrganization }=require('../controllers/authController');
// const authMiddleware = require('../middleware/authJwt');
const router = express.Router();

router.post('/add',signUp);
router.post('/addOrganization',addOrganization);
router.get('/addOrganization/',viewOrganization);
// router.post('/addOrganization',authMiddleware("create"),addOrganization);

module.exports=router;