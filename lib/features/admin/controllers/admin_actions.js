const adminActionsRepo = require('../repositories/admin_actions')

class AdminActionsController {

    static promoteToAdmin = async (req, res) => {
        const { uid } = req.body;
        const result = await adminActionsRepo.promoteToAdmin(uid);

        if (result.err == null) {
            res.status(200).send(result.message);
        } else {
            res.status(500).send(result.err);
        }
    }

    static getUsers = async (req, res) => {
        let { uid, email, providerId } = req.body;
        let result = await adminActionsRepo.getUsers(uid, email, providerId);

        if (result.err == null) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    static deleteUsers = async (req, res) => {
        let { uids } = req.body;
        let result = await adminActionsRepo.deleteUsers(uids);

        if (result.err == null) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    static disableUser = async (req, res) => {
        let { uid } = req.body;
        let result = await adminActionsRepo.disableUser(uid);

        if (result.err == null) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    static enableUser = async (req, res) => {
        let { uid } = req.body;
        let result = await adminActionsRepo.enableUser(uid);

        if (result.err == null) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    static addUser = async (req, res) => {
        let { email, password, name, isEmailVerified, photoURL, disabled } = req.body;
        let result = await adminActionsRepo.addUser(email, password, name, isEmailVerified, photoURL, disabled);

        if (result.err == null) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }
}

module.exports = AdminActionsController;