const express = require('express');
const router = express.Router();
const apiController = require('../controllers/user-controller');
const verifyToken = require('../middleware/verifyToken')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/user');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const uploadFile = multer({ storage: storage });

router.get('/user/list', apiController.getUser);
// router.post('/user/create', apiController.createUser);
router.post('/user/add', verifyToken, uploadFile.any(), apiController.addUser);
router.get('/user/info/:id', apiController.getSingleUser);
router.post('/user/update', apiController.updateUser);
router.get('/user/delete/:id', apiController.deleteUser);

router.post('/login', apiController.login);
router.post('/signup', apiController.signUp);

module.exports = {
    route:router
}
