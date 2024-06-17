const AdminActionsController = require('../controllers/admin_actions')
const AuthController = require('../../auth/controllers/auth')
const express = require('express')

const router = express.Router();

router.post('/getUsers', AuthController.verifyToken, AdminActionsController.getUsers);
router.post('/deleteUsers', AuthController.verifyToken, AdminActionsController.deleteUsers);
router.post('/disableUser', AuthController.verifyToken, AdminActionsController.disableUser);
router.post('/enableUser', AuthController.verifyToken, AdminActionsController.enableUser);
router.post('/addUser', AuthController.verifyToken, AdminActionsController.addUser);
router.post('/updateUser', AuthController.verifyToken, AdminActionsController.updateUser);
router.post('/promoteToAdmin', AuthController.verifyToken, AdminActionsController.promoteToAdmin);

module.exports = router;

module.exports = router;