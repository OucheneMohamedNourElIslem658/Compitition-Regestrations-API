const AuthController = require('../controllers/auth')
const express = require('express')

const router = express.Router();

router.post('/registerWithEmailAndPassword', AuthController.registerUserWithEmailAndPassword);
router.post('/loginWithEmailAndPassword', AuthController.loginUserWithEmailAndPassword);
router.post('/getUser', AuthController.verifyToken , AuthController.getUser);
router.get('/getMyProfile', AuthController.verifyToken, AuthController.getMyProfile);
router.post('/updateUser', AuthController.verifyToken, AuthController.updateUser);
router.post('/addSupplimentaryInfo', AuthController.verifyToken, AuthController.addSupplimentaryInfo);
router.get('/logout', AuthController.verifyToken, AuthController.logout);
router.get('/refreshIdToken', AuthController.refreshToken);
router.post('/sendPasswordResetLink', AuthController.resetPassword);
router.get('/sendEmailVerificationLink', AuthController.verifyEmail);
router.post('/signInWithOAuthCredential', AuthController.signInWithOAuthCredential);
router.get('/signInAnonymously', AuthController.signInAnonymously);

module.exports = router;