const AuthRepo = require('../repositories/auth')
const admin = require('../../../commun/utils/admin_config')

class AuthController {
    static registerUserWithEmailAndPassword = async (req,res) => {
        const {email,password,name} = req.body
        if (!email || !password || !name) {
            return res.status(400).json({
                email : "Email is required",
                password : "Password is required",
                name : "Name is required"
            });
        }
        let result = await AuthRepo.registerUserWithEmailAndPassword(
            email,
            password,
            name
        )

        let err = result.err;
        if (err != null) {
            res.status(404).send({
                err : err
            })
        } else {
            res.cookie('idToken', result.token, {
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

    static loginUserWithEmailAndPassword = async (req, res) => {
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(422).json({
                email: "Email is required",
                password: "Password is required",
            });
        }
        let result = await AuthRepo.loginUserWithEmailAndPassword(
            email,
            password,
        )
        let err = result.err;
        if (err != null) {
            res.status(404).send({
                err : err
            })
        } else {
            res.cookie('idToken', result.token, {
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
        let firebaseUser = req.body.user
        let user = {
            email: firebaseUser.email,
            name: firebaseUser.name,
        }
        res.status(200).send(user)
    }

    static logout = async (req, res) => {
        let result = await AuthRepo.logout(req.body.user.user_id)
        let err = result.err;
        if (result.err != null) {
            return res.status(403).json({
                err: err
            });
        }
        return res.status(200).json({
            message: result.message
        });
    }


    static verifyToken = async (req,res,next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(403).json({ err: 'no-token-provided' });
        }

        let result = await AuthRepo.verifyToken(token);
        if (result.err == null) {
            if (!result.decodeResult.email_verified) {
                return res.status(404).json({
                    err: 'email-not-verified'
                });
            }
            req.body = {
                user: result.decodeResult,
                token: token
            };
            next();
        } else {
            return res.status(404).json({
                err: result.err
            });
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
            console.log(result.token);
            res.cookie('idToken', result.token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
            res.end()
        } else {
            return res.status(404).json({
                err: result.err
            });
        }
    }

    static verifyEmail = async (req, res) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        let result = await AuthRepo.verifyEmail(token);
        if (result.err == null) {
            res.status(200).send({
                message : result.message
            })
        } else {
            return res.status(404).json({
                err: result.err
            });
        }
    }

    static resetPassword = async (req, res) => {
        const { email } = req.body
        let result = await AuthRepo.resetPassword(email);
        if (result.err == null) {
            res.status(200).send({
                message: result.message
            })
        } else {
            return res.status(404).json({
                err: result.err
            });
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
        let err = result.err;
        if (err != null) {
            res.status(404).send({
                err: err
            })
        } else {
            res.cookie('idToken', result.data.idToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
            res.cookie('refreshToken', result.data.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
            res.end()
        }
    }
}

module.exports = AuthController