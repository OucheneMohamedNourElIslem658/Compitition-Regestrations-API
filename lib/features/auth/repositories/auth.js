const { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, sendPasswordResetEmail} = require('firebase/auth');
const services = require('../../../commun/utils/fb_config')
const admin = require('../../../commun/utils/admin_config')
// const nodemailer = require('nodemailer')

class AuthRepo {
    static auth = services.auth;
    static firestore = services.firestore;

    static async registerUserWithEmailAndPassword(email,password,name){
        try {
            let userCredential = await createUserWithEmailAndPassword(
                this.auth,
                email,
                password
            )
            let user = userCredential.user;
            await updateProfile(
                user,
                {
                    displayName : name
                }
            )
            return {
                err: null,
                token: userCredential._tokenResponse.idToken,
                refreshToken: userCredential._tokenResponse.refreshToken
            }
        } catch (error) {
            return {
                err: error.code || 'internal-server-error',
            }
        }
    }
    
    static async loginUserWithEmailAndPassword(email, password) {
        try {
            let userCredential = await signInWithEmailAndPassword(
                this.auth,
                email,
                password
            )
            return {
                err: null,
                token: userCredential._tokenResponse.idToken,
                refreshToken: userCredential._tokenResponse.refreshToken
            }
        } catch (error) {
            return {
                err: error.code || 'internal-server-error',
                token: null
            }
        }
    }

    static async logout(uid) {
        try {
            await admin.auth().revokeRefreshTokens(uid)
            return {
                err: null,
                message: 'logedout-successfully'
            }
        } catch (error) {
            return {
                err: error.code || 'internal-server-error',
            }
        }
    }

    static async verifyToken(token) {
        try {
            let decodeResult = await admin.auth().verifyIdToken(token,true);
            if (!decodeResult.email_verified) {
                return {
                    err: 'email-not-verified'
                }
            }
            return {decodeResult : decodeResult}
        } catch (error) {
            return {
                err: error.code || 'unauthorized'
            }
        }
    }

    static async resetPassword(email) {
        try {
            await sendPasswordResetEmail(this.auth,email);
            return {
                err : null,
                message : 'reset-password-link-sent'
            }
        } catch (error) {
            return {
                err : error.code || 'internal-server-error',
                message : null
            }
        }
    }

    static async refreshToken(refreshToken) {
        const apiKey = services.apiKey;
        const url = `https://securetoken.googleapis.com/v1/token?key=${apiKey}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `grant_type=refresh_token&refresh_token=${refreshToken}`
            });

            if (!response.ok) {
                return {
                    err: 'refresh-token-invalid',
                    token: null
                };
            }

            const data = await response.json();
            const newIdToken = data.id_token;

            return {
                err: null,
                token: newIdToken
            };
        } catch (error) {
            return {
                err: error.code || 'internal-server-error',
                token: null
            };
        }
    }

    static async verifyEmail(idToken) {
        const apiKey = services.apiKey;
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Firebase-Locale': 'en'
                },
                body: JSON.stringify({
                    requestType: 'VERIFY_EMAIL',
                    idToken: idToken
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return {
                    err: errorData.error.code || 'verification-email-failed',
                    message: null
                };
            }

            return {
                err: null,
                message : 'email-sent-successfully'
            };
        } catch (error) {
            return {
                err: error.code || 'internal-server-error',
                message: null
            };
        }
    }

    static async signInWithOAuthCredential(idToken, providerId) {
        const apiKey = services.apiKey;
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${apiKey}`;

        const postBody = `access_token=${idToken}&providerId=${providerId}`;
        const requestUri = 'http://localhost';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requestUri: requestUri,
                    postBody: postBody,
                    returnSecureToken: true,
                    returnIdpCredential: true
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return {
                    err: errorData.error.message || 'oauth-signin-failed',
                    data: null
                };
            }

            const result = await response.json();
            
            return {
                err: null,
                data: {
                    idToken : result.idToken,
                    refreshToken: result.refreshToken
                }
            };
        } catch (error) {
            return {
                err: error.message || 'internal-server-error',
                data: null
            };
        }
    }
}

module.exports = AuthRepo;