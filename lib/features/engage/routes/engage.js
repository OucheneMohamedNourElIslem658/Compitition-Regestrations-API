const EngagmentController = require('../controllers/engage')
const AuthRepo = require('../../auth/controllers/auth')
const express = require('express')

const router = express.Router();

router.post('/createGroup',AuthRepo.verifyToken, EngagmentController.createGroup);
router.post('/joinGroup', AuthRepo.verifyToken, EngagmentController.joinGroup);
router.get('/getMyGroup', EngagmentController.verifyToken, EngagmentController.getMyGroup);
router.post('/getSuggestedGroups', AuthRepo.verifyToken, EngagmentController.getSuggestedTeams);
router.post('/leaveGroup', AuthRepo.verifyToken, EngagmentController.leaveGroup);
router.post('/sendJoinRequest', AuthRepo.verifyToken, EngagmentController.sendJoinRequest);
router.post('/cancelRequest', AuthRepo.verifyToken, EngagmentController.cancelRequest);
router.post('/rejectRequest', AuthRepo.verifyToken, EngagmentController.rejectRequest);
router.get('/getRequests', AuthRepo.verifyToken, EngagmentController.getRequests);
router.post('/requestToBeIncluded',AuthRepo.verifyToken, EngagmentController.requestToBeIncluded);
router.post('/cancelRequestToBeIncluded',AuthRepo.verifyToken, EngagmentController.cancelRequestToBeIncluded);
router.get('/getRequestsToBeIncluded', AuthRepo.verifyToken, EngagmentController.getRequestsToBeIncluded);
router.post('/setTeamLeader', AuthRepo.verifyToken, EngagmentController.setTeamLeader);
router.post('/changeTeamName', EngagmentController.changeTeamName);

module.exports = router;