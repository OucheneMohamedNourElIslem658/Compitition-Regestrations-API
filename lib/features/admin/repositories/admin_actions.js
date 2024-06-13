const services = require('../../../commun/utils/fb_config')
const admin = require('../../../commun/utils/admin_config')

class AdminActionsRepository {
    static auth = admin.auth();

    static async promoteToAdmin(uid){
        try {
            await this.auth.setCustomUserClaims(uid,{
                admin : true
            })

            return {
                message : 'user-promoted-to-admin'
            }
        } catch (error) {
            return {
                err : error.code || 'internalServerError'
            }
        }
    }

    static async getUsers(uid,email,providerId){
        try {
            let usersResult = await this.auth.listUsers()
            let users = []
            usersResult.users.forEach(user => {
                let providers = []
                user.providerData.forEach(
                    (provider) => providers.push(provider.providerId)
                )

                let isIncluded = 
                    user.email == email 
                    || user.uid == uid 
                    || providers.includes(providerId)

                if (isIncluded) {
                    users.push({
                        uid: user.uid,
                        email: user.email,
                        name: user.displayName,
                        disabled: user.disabled,
                        photoURL: user.photoURL,
                        providersIds: providers
                    })
                }
            });

            return {
                number : users.length,
                users : users
            }
        } catch (error) {
            return {
                err: error.code || 'internal-server-error'
            }
        }
    }

    static async deleteUsers(uids){
        try {
            await this.auth.deleteUsers(uids)
            return {
                message : 'users-deleted'
            }
        } catch (error) {
            return {
                err : error.code || 'internal-server-error'
            }
        }
    }

    static async disableUser(uid) {
        try {
            await this.auth.updateUser(
                uid,
                {
                    disabled : true
                }
            )
            return {
                message: 'user-disabled'
            }
        } catch (error) {
            return {
                err: error.code || 'internal-server-error'
            }
        }
    }

    static async enableUser(uid) {
        try {
            await this.auth.updateUser(
                uid,
                {
                    disabled: false
                }
            )
            return {
                message: 'user-enabled'
            }
        } catch (error) {
            return {
                err: error.code || 'internal-server-error'
            }
        }
    }

    static async addUser(
        email,
        password,
        name,
        isEmailVerified,
        photoURL,
        disabled
    ){
        if (!email ||!password) {
            return {
                err : 'invalid-auth-credentials'
            }
        }
        try {
            await this.auth.createUser({
                email: email,
                emailVerified: isEmailVerified,
                password: password,
                disabled: disabled,
                displayName: name,
                photoURL: photoURL
            })

            return {
                message : 'user-added'
            }
        } catch (error) {
            return {
                err : error.code || 'internal-server-error'
            }
        }
    }
}

module.exports = AdminActionsRepository