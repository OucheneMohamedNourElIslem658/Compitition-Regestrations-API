const EngagmentRepo = require('../repositories/engage')
const NotificationsRepo = require('../repositories/notifications')

class EngagmentController {
    static createGroup = async (req,res) => {
        const {teamName, membersUIDs} = req.body.reqBody
        const uid = req.body.uid
        let result = await EngagmentRepo.createGroup(uid,teamName,membersUIDs)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static joinGroup = async (req, res) => {
        const { teamID } = req.body.reqBody
        const uid = req.body.uid
        let result = await EngagmentRepo.joinGroup(uid,teamID,uid)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static getMyGroup = async (req, res) => {
        const uid = req.body.uid
        let result = await EngagmentRepo.getMyGroup(uid)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static getSuggestedTeams = async (req, res) => {
        const uid = req.body.uid
        let result = await EngagmentRepo.getSuggestedTeams(uid)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static addToGroup = async (req, res) => {
        const { teamID,uid } = req.body.reqBody
        const adderID = req.body.uid
        let result = await EngagmentRepo.joinGroup(uid, teamID, adderID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static requestToBeIncluded = async (req, res) => {
        const { teamID} = req.body.reqBody
        const uid = req.body.uid
        let result = await EngagmentRepo.requestToBeIncluded(uid, teamID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static cancelRequestToBeIncluded = async (req, res) => {
        const { teamID } = req.body.reqBody
        const uid = req.body.uid
        let result = await EngagmentRepo.cancelRequestToBeIncluded(uid, teamID ,uid)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static rejectRequestToBeIncluded = async (req, res) => {
        const { uid,teamID } = req.body.reqBody
        const rejecterID = req.body.uid
        let result = await EngagmentRepo.cancelRequestToBeIncluded(uid, teamID ,rejecterID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static leaveGroup = async (req, res) => {
        const {teamID} = req.body.reqBody
        const uid = req.body.uid
        let result = await EngagmentRepo.leaveGroup(uid, teamID ,uid)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static deleteMember = async (req, res) => {
        const { teamID ,uid } = req.body.reqBody
        const deleter = req.body.uid
        let result = await EngagmentRepo.leaveGroup(uid, teamID, deleter)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static sendJoinRequest = async (req, res) => {
        const {toID, teamID} = req.body.reqBody
        const accepterID = req.body.uid
        let result = await EngagmentRepo.sendJoinRequest(toID, teamID, accepterID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static getJoinRequests = async (req, res) => {
        const {teamID} = req.body.reqBody
        let result = await EngagmentRepo.getJoinRequests(teamID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static setTeamLeader = async (req,res) => {
        const {uid, teamID} = req.body.reqBody
        const editerID = req.body.uid
        let result = await EngagmentRepo.setTeamLeader(uid, teamID,editerID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static rejectRequest = async (req, res) => {
        const { teamID } = req.body.reqBody
        const uid = req.body.uid
        let result = await EngagmentRepo.rejectRequest(uid, teamID ,uid)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static cancelRequest = async (req, res) => {
        const { teamID, uid } = req.body.reqBody
        const cancelerID = req.body.uid
        let result = await EngagmentRepo.rejectRequest(uid, teamID,cancelerID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static getRequests = async (req, res) => {
        const uid = req.body.uid
        let result = await EngagmentRepo.getRequests(uid)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static getRequestsToBeIncluded = async (req, res) => {
        const uid = req.body.uid
        let result = await EngagmentRepo.getRequestsToBeIncluded(uid)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static changeTeamName = async (req, res) => {
        const {teamID, newName} = req.body.reqBody
        const editerID = req.body.uid
        let result = await EngagmentRepo.changeTeamName(teamID,newName,editerID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static verifyToken = async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        let result = await EngagmentRepo.verifyToken(token);

        if (!result.err) {
            req.body = {
                uid: result.uid,
                token: token,
                reqBody: req.body
            };
            next()
        } else {
            res.status(404).send(result)
        }
    }

    static seeNotification = async (req, res) => {
        const {notifID} = req.body.reqBody
        const uid = req.body.uid
        let result = await NotificationsRepo.seeNotification(uid,notifID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static unseeNotification = async (req, res) => {
        const { notifID } = req.body.reqBody
        const uid = req.body.uid
        let result = await NotificationsRepo.unseeNotification(uid, notifID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }
}

module.exports = EngagmentController