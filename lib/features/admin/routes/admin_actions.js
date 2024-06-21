const AdminActionsController = require('../controllers/admin_actions')
const express = require('express')

const router = express.Router();

router.post('/getUsers', AdminActionsController.verifyToken, AdminActionsController.getUsers);
router.post('/deleteUsers', AdminActionsController.verifyToken, AdminActionsController.deleteUsers);
router.post('/disableUser', AdminActionsController.verifyToken, AdminActionsController.disableUser);
router.post('/enableUser', AdminActionsController.verifyToken, AdminActionsController.enableUser);
router.post('/addUser', AdminActionsController.verifyToken, AdminActionsController.addUser);
router.post('/updateUser', AdminActionsController.verifyToken, AdminActionsController.updateUser);
router.post('/promoteToAdmin', AdminActionsController.verifyToken, AdminActionsController.promoteToAdmin);
router.post('/acceptTeam', AdminActionsController.verifyToken, AdminActionsController.acceptTeam); // notify Team
router.post('/rejectTeam', AdminActionsController.verifyToken, AdminActionsController.rejectTeam); // notify Team
router.post('/makeTeamUnderJugment', AdminActionsController.verifyToken, AdminActionsController.makeTeamUnderJugment); // notify Team
router.get('/getAllTeams', AdminActionsController.verifyToken, AdminActionsController.getAllTeams);

module.exports = router;

module.exports = router;