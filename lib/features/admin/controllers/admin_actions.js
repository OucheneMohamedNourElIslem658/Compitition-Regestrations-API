const AdminActionsRepository = require('../repositories/admin_actions');
const adminActionsRepo = require('../repositories/admin_actions')

class AdminActionsController {

    static promoteToAdmin = async (req, res) => {
        const uid = req.body.reqBody;
        const result = await adminActionsRepo.promoteToAdmin(uid);

        if (result.err == null) {
            res.status(200).send(result.message);
        } else {
            res.status(500).send(result.err);
        }
    }

    static getUsers = async (req, res) => {
        const { uid, email, providerId ,school} = req.body.reqBody;
        let result = await adminActionsRepo.getUsers(uid, email, providerId,school);

        if (result.err == null) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    static deleteUsers = async (req, res) => {
        let { uids } = req.body.reqBody;
        let result = await adminActionsRepo.deleteUsers(uids);

        if (result.err == null) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    static disableUser = async (req, res) => {
        let { uid } = req.body.reqBody;
        let result = await adminActionsRepo.disableUser(uid);

        if (result.err == null) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    static enableUser = async (req, res) => {
        let { uid } = req.body.reqBody;
        let result = await adminActionsRepo.enableUser(uid);

        if (result.err == null) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    static addUser = async (req, res) => {
        const {
            email, 
            password, 
            name, 
            isEmailVerified, 
            photoURL, 
            disabled,
            school,
            motivation
        } = req.body.reqBody;

        let result = await adminActionsRepo.addUser(
            email, 
            password, 
            name, 
            isEmailVerified, 
            photoURL, 
            disabled,
            school,
            motivation
        );

        if (result.err == null) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    static updateUser = async (req, res) => {
        const {
            uid,
            email,
            name,
            school,
            motivation,
            emailVerified
        } = req.body.reqBody;

        let result = await AdminActionsRepository.updateUser(
            uid,
            email,
            name,
            school,
            motivation,
            emailVerified
        );

        if (result.err == null) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    static verifyToken = async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        let result = await AdminActionsRepository.verifyToken(token);

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

    static makeTeamUnderJugment = async (req, res) => {
        const {teamID} = req.body.reqBody;

        let result = await AdminActionsRepository.makeTeamUnderJugment(teamID);

        if (result.err == null) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    static rejectTeam = async (req, res) => {
        const { teamID } = req.body.reqBody;

        let result = await AdminActionsRepository.rejectTeam(teamID);

        if (result.err == null) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    static acceptTeam = async (req, res) => {
        const { teamID } = req.body.reqBody;

        let result = await AdminActionsRepository.acceptTeam(teamID);

        if (result.err == null) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    static getAllTeams = async (req, res) => {
        let result = await AdminActionsRepository.getAllTeams();
        if (result.err == null) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    static sendAcceptationEmails = async (req, res) => {
        let result = await AdminActionsRepository.sendAcceptationEmails();
        if (result.err == null) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    static sendEmail = async (req, res) => {
        const {email,subject,content} = req.body.reqBody
        let result = await AdminActionsRepository.sendEmail(email,subject,content);
        if (result.err == null) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }
}

module.exports = AdminActionsController;