const AdminActionsController = require('../controllers/admin_actions')
const express = require('express')

const router = express.Router();

router.post('/getUsers', AdminActionsController.getUsers);
router.post('/deleteUsers', AdminActionsController.deleteUsers);
router.post('/disableUser', AdminActionsController.disableUser);
router.post('/enableUser', AdminActionsController.enableUser);
router.post('/addUser', AdminActionsController.addUser);
router.post('/promoteToAdmin', AdminActionsController.promoteToAdmin);

module.exports = router;

module.exports = router;