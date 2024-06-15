const AuthRepo = require('../repositories/auth')
const admin = require('../../../commun/utils/admin_config')

class AuthController {
    static registerUserWithEmailAndPassword = async (req,res) => {
        const {email,password,name,school,motivation} = req.body
        if (!email || !password || !name || !school || !motivation) {
            return res.status(404).json({
                err : 'invalid-auth-creadentials'
            });
        }
        let result = await AuthRepo.registerUserWithEmailAndPassword(
            email,
            password,
            name,
            school,
            motivation
        )

        let err = result.err;
        if (err != null) {
            res.status(404).send(result)
        } else {
            res.status(200).send(result)
        }
    }

    static loginUserWithEmailAndPassword = async (req, res) => {
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(404).json({
                err: 'invalid-auth-creadentials'
            });
        }
        let result = await AuthRepo.loginUserWithEmailAndPassword(
            email,
            password,
        )
        let err = result.err;
        if (err != null) {
            res.status(404).send(result)
        } else {
            res.cookie('idToken', result.idToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
            res.end()
        }
    }

    static getUser = async (req, res) => {
        let result = await AuthRepo.getUser(req.body.uid)
        if (result.err != null) {
            return res.status(404).send(result);
        }
        res.status(200).send(result)
    }

    static logout = async (req, res) => {
        let result = await AuthRepo.logout(req.body.uid)
        if (result.err != null) {
            return res.status(404).send(result);
        }
        return res.status(200).send(result);
    }


    static verifyToken = async (req,res,next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        let result = await AuthRepo.verifyToken(token);
        
        if (result.err == null) {
            req.body = {
                uid: result.uid,
                token: token,
                reqBody: req.body
            };
            next();
        } else {
            return res.status(404).json(result);
        }
    }

    static refreshToken = async (req, res) => {
        const authHeader = req.headers['authorization'];
        const refreshToken = authHeader && authHeader.split(' ')[1];

        if (!refreshToken) {
            return res.status(403).json({ err: 'no-token-provided' });
        }

        let result = await AuthRepo.refreshToken(refreshToken);
        if (result.err == null) {
            res.cookie('idToken', result.token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
            res.end()
        } else {
            return res.status(404).send(result);
        }
    }

    static verifyEmail = async (req, res) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        let result = await AuthRepo.verifyEmail(token);
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            return res.status(404).send(result);
        }
    }

    static resetPassword = async (req, res) => {
        const { email } = req.body
        let result = await AuthRepo.resetPassword(email);
        if (result.err == null) {
            res.status(200).send(result)
        } else {
            res.status(404).send(result);
        }
    }

    static signInWithOAuthCredential = async (req, res) => {
        const authHeader = req.headers['authorization'];
        const idToken = authHeader && authHeader.split(' ')[1];
        const {providerId} = req.body
        let result = await AuthRepo.signInWithOAuthCredential(
            idToken,
            providerId,
        )

        if (err != null) {
            res.status(404).send(result)
        } else {
            res.cookie('idToken', result.idToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
            res.end()
        }
    }
}

module.exports = AuthController