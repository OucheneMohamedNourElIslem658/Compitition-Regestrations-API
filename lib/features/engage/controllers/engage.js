const EngagmentRepo = require('../repositories/engage')

class EngagmentController {
    static createGroup = async (req,res) => {
        const {uid, teamName, membersUIDs} = req.body
        let result = await EngagmentRepo.createGroup(uid,teamName,membersUIDs)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static joinGroup = async (req, res) => {
        const {uid, teamID} = req.body
        let result = await EngagmentRepo.joinGroup(uid,teamID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static leaveGroup = async (req, res) => {
        const { uid, teamID } = req.body
        let result = await EngagmentRepo.leaveGroup(uid, teamID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static sendJoinRequest = async (req, res) => {
        const {toID, teamID} = req.body
        let result = await EngagmentRepo.sendJoinRequest(toID, teamID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static setTeamLeader = async (req,res) => {
        const {uid, teamID} = req.body
        let result = await EngagmentRepo.setTeamLeader(uid, teamID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static rejectRequest = async (req, res) => {
        const { uid, teamID } = req.body
        let result = await EngagmentRepo.rejectRequest(uid, teamID)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }

    static getRequests = async (req, res) => {
        const { uid, teamID } = req.body
        let result = await EngagmentRepo.getRequests(uid)
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result)
        }
    }
}

module.exports = EngagmentController