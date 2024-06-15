const EngagmentController = require('../controllers/engage')
const express = require('express')

const router = express.Router();

router.post('/createGroup', EngagmentController.createGroup);
router.post('/joinGroup', EngagmentController.joinGroup);
router.post('/leaveGroup', EngagmentController.leaveGroup);
router.post('/sendJoinRequest', EngagmentController.sendJoinRequest);
router.post('/setTeamLeader', EngagmentController.setTeamLeader);
router.post('/rejectRequest', EngagmentController.rejectRequest);
router.post('/getRequests', EngagmentController.getRequests);

module.exports = router;