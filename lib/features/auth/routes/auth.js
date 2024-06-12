const AuthController = require('../controllers/auth')
const express = require('express')

const router = express.Router();

router.post('/registerWithEmailAndPassword', AuthController.registerUserWithEmailAndPassword);
router.post('/loginWithEmailAndPassword', AuthController.loginUserWithEmailAndPassword);
router.get('/getUser', AuthController.verifyToken , AuthController.getUser);
router.get('/logout', AuthController.verifyToken, AuthController.logout);
router.get('/refreshIdToken', AuthController.refreshToken);
router.post('/sendPasswordResetLink', AuthController.resetPassword);
router.get('/sendEmailVerificationLink', AuthController.verifyEmail);
router.post('/signInWithOAuthCredential', AuthController.signInWithOAuthCredential);

module.exports = router;