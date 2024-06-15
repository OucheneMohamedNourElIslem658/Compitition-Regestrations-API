const EngagmentRepo = require('../repositories/engage')

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
        let result = await EngagmentRepo.joinGroup(uid,teamID)
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
        let result = await EngagmentRepo.joinGroup(uid, teamID)
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
        let result = await EngagmentRepo.cancelRequestToBeIncluded(uid, teamID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }


    static leaveGroup = async (req, res) => {
        const {teamID} = req.body.reqBody
        const uid = req.body.uid
        let result = await EngagmentRepo.leaveGroup(uid, teamID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static sendJoinRequest = async (req, res) => {
        const {toID, teamID} = req.body.reqBody
        let result = await EngagmentRepo.sendJoinRequest(toID, teamID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static setTeamLeader = async (req,res) => {
        const {uid, teamID} = req.body.reqBody
        let result = await EngagmentRepo.setTeamLeader(uid, teamID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static rejectRequest = async (req, res) => {
        const { teamID } = req.body.reqBody
        const uid = req.body.uid
        let result = await EngagmentRepo.rejectRequest(uid, teamID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static cancelRequest = async (req, res) => {
        const { teamID, uid } = req.body.reqBody
        let result = await EngagmentRepo.rejectRequest(uid, teamID)
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
        let result = await EngagmentRepo.changeTeamName(teamID,newName)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }
}

module.exports = EngagmentController