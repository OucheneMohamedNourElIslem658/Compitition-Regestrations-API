const EngagmentController = require('../controllers/engage')
const AuthRepo = require('../../auth/controllers/auth')
const express = require('express')

const router = express.Router();

router.post('/createGroup',EngagmentController.verifyToken, EngagmentController.createGroup);
router.post('/joinGroup', AuthRepo.verifyToken, EngagmentController.joinGroup);
router.get('/getMyGroup', EngagmentController.verifyToken, EngagmentController.getMyGroup);
router.post('/getSuggestedGroups',EngagmentController.verifyToken, EngagmentController.getSuggestedTeams);
router.post('/leaveGroup', EngagmentController.verifyToken, EngagmentController.leaveGroup);
router.post('/deleteMember', EngagmentController.verifyToken, EngagmentController.deleteMember);
router.post('/sendJoinRequest', EngagmentController.verifyToken, EngagmentController.sendJoinRequest);
router.post('/getJoinRequests', EngagmentController.verifyToken, EngagmentController.getJoinRequests);
router.post('/cancelRequest',EngagmentController.verifyToken, EngagmentController.cancelRequest);
router.post('/rejectRequest', EngagmentController.verifyToken, EngagmentController.rejectRequest);
router.get('/getRequests',EngagmentController.verifyToken, EngagmentController.getRequests);
router.post('/requestToBeIncluded',EngagmentController.verifyToken, EngagmentController.requestToBeIncluded);
router.post('/cancelRequestToBeIncluded',EngagmentController.verifyToken, EngagmentController.cancelRequestToBeIncluded);
router.post('/rejectRequestToBeIncluded', EngagmentController.verifyToken, EngagmentController.rejectRequestToBeIncluded);
router.get('/getRequestsToBeIncluded',EngagmentController.verifyToken, EngagmentController.getRequestsToBeIncluded);
router.post('/acceptRequestToBeIncluded', EngagmentController.verifyToken, EngagmentController.addToGroup);
router.post('/setTeamLeader', EngagmentController.verifyToken, EngagmentController.setTeamLeader);
router.post('/changeTeamName', EngagmentController.verifyToken, EngagmentController.changeTeamName); // notif to team

module.exports = router;