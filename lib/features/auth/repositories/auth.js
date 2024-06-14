const options = require('../../../envs/fb_options')
const admin = require('../../../commun/utils/admin_config')

class AuthRepo {
    static auth = admin.auth()
    static apiKey = options.apiKey

    static async registerUserWithEmailAndPassword(email, password, name) {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return {
                    err: errorData.error.message || 'INTERNAL_SERVER_ERROR',
                };
            }

            const data = await response.json();

            let user = await this.auth.getUserByEmail(data.email);

            await this.auth.updateUser(user.uid, {
                displayName: name
            });

            let idToken = data.idToken;
            let result = await this.verifyEmail(idToken);

            if (result.err == null) {
                return {
                    message: result.message
                };
            } else {
                return {
                    err: result.err
                };
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR',
            };
        }
    }

    static async loginUserWithEmailAndPassword(email, password) {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return {
                    err: errorData.error.message || 'INTERNAL_SERVER_ERROR',
                };
            }

            const data = await response.json();
            return {
                idToken: data.idToken,
                refreshToken: data.refreshToken
            };
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR',
            };
        }
    }

    static async logout(uid) {
        try {
            await admin.auth().revokeRefreshTokens(uid);
            return {
                message: 'LOGGEDOUT_SUCCESSFULLY'
            };
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR',
            };
        }
    }

    static async verifyToken(token) {
        if (!token) {
            return {
                err: 'NO_TOKEN_PROVIDED'
            };
        }
        try {
            let decodeResult = await admin.auth().verifyIdToken(token, true);
            if (!decodeResult.email_verified) {
                return {
                    err: 'EMAIL_NOT_VERIFIED'
                };
            }
            return { decodeResult: decodeResult };
        } catch (error) {
            return {
                err: error.code || 'UNAUTHORIZED'
            };
        }
    }

    static async resetPassword(email) {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${this.apiKey}`;
        let headers = {
            'Content-Type': 'application/json'
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    requestType: 'PASSWORD_RESET',
                    email: email
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return {
                    err: errorData.error.message || 'INTERNAL_SERVER_ERROR',
                };
            }

            return {
                message: 'EMAIL_SENT'
            };
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR',
            };
        }
    }

    static async refreshToken(refreshToken) {
        const url = `https://securetoken.googleapis.com/v1/token?key=${this.apiKey}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `grant_type=refresh_token&refresh_token=${refreshToken}`
            });

            if (!response.ok) {
                const errorData = await response.json();
                return {
                    err: errorData.error.message || 'INTERNAL_SERVER_ERROR',
                };
            }

            const data = await response.json();
            const newIdToken = data.id_token;

            return {
                token: newIdToken
            };
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR',
            };
        }
    }

    static async verifyEmail(idToken) {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${this.apiKey}`;

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
                    err: errorData.error.message || 'INTERNAL_SERVER_ERROR',
                };
            }

            return {
                message: 'EMAIL_SENT'
            };
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR',
            };
        }
    }

    static async signInWithOAuthCredential(idToken, providerId) {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${this.apiKey}`;

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
                    err: errorData.error.message || 'INTERNAL_SERVER_ERROR',
                };
            }

            const result = await response.json();

            return {
                idToken: result.idToken,
                refreshToken: result.refreshToken
            };
        } catch (error) {
            return {
                err: error.message || 'INTERNAL_SERVER_ERROR',
            };
        }
    }
}

module.exports = AuthRepo;