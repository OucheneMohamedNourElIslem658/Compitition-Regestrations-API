const AdminActionsController = require('../controllers/admin_actions')
const AuthController = require('../../auth/controllers/auth')
const express = require('express')

const router = express.Router();

router.post('/getUsers', AdminActionsController.verifyToken, AdminActionsController.getUsers);
router.post('/deleteUsers', AdminActionsController.verifyToken, AdminActionsController.deleteUsers);
router.post('/disableUser', AdminActionsController.verifyToken, AdminActionsController.disableUser);
router.post('/enableUser', AdminActionsController.verifyToken, AdminActionsController.enableUser);
router.post('/addUser', AdminActionsController.verifyToken, AdminActionsController.addUser);
router.post('/updateUser', AdminActionsController.verifyToken, AdminActionsController.updateUser);
router.post('/promoteToAdmin', AdminActionsController.verifyToken, AdminActionsController.promoteToAdmin);

module.exports = router;

module.exports = router;