const express = require('express');
const { signUp, addOrganization }=require('../controllers/authController');
// const authMiddleware = require('../middleware/authJwt');
const router = express.Router();

router.post('/add',signUp);
router.post('/addOrganization',addOrganization);
// router.post('/addOrganization',authMiddleware("create"),addOrganization);

module.exports=router;