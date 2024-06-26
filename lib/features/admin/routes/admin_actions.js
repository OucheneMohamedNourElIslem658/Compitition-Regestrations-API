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
router.post('/acceptTeam', AdminActionsController.verifyToken, AdminActionsController.acceptTeam);
router.post('/rejectTeam', AdminActionsController.verifyToken, AdminActionsController.rejectTeam); 
router.post('/makeTeamUnderJugment', AdminActionsController.verifyToken, AdminActionsController.makeTeamUnderJugment);
router.get('/getAllTeams', AdminActionsController.verifyToken, AdminActionsController.getAllTeams);
router.get('/sendAcceptationEmails', AdminActionsController.verifyToken, AdminActionsController.sendAcceptationEmails);
router.post('/sendEmail', AdminActionsController.verifyToken, AdminActionsController.sendEmail);

module.exports = router;