const admin = require('../../../commun/utils/admin_config')
const AuthRepo = require('../../auth/repositories/auth')
const EngagmentRepo = require('../../engage/repositories/engage');

class AdminActionsRepository {
    static auth = admin.auth();
    static firestore = admin.firestore()

    static signInAdmin(){
        
    }

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

    static async getUsers(uid,email,providerId,school){
        try {
            let usersResult = await this.auth.listUsers()
            let users = []
            for (const user of usersResult.users) {
                let userInfo = (await AuthRepo.getUser(user.uid)).user;
                let providers = [];
                user.providerData.forEach(
                    (provider) => providers.push(provider.providerId)
                );
                
                let userResponse = {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                    disabled: user.disabled,
                    photoURL: user.photoURL,
                    providersIds: providers,
                    school: userInfo.school,
                    motivation: userInfo.motivation
                }

                let isIncluded =
                    userInfo.email == email ||
                    user.uid == uid ||
                    providers.includes(providerId) ||
                    userInfo.school == school;

                if (!uid && !email && !providerId && !school) {
                    users.push(userResponse);
                } else if (isIncluded) {
                    users.push(userResponse);
                }
            }

            return {
                number: users.length,
                users: users
            };
        } catch (error) {
            return {
                err: error.code || 'internal-server-error'
            }
        }
    }

    static async deleteUsers(uids){
        try {
            for (const uid of uids) {
                let userInfo = (await AuthRepo.getUser(uid)).user;
                if (!userInfo.teamID) {
                } else {
                    await EngagmentRepo.leaveGroup(uid,userInfo.teamID)
                }
                let requestsToBeIncluded = (await EngagmentRepo.getRequestsToBeIncluded(uid)).requestsToBeIncluded
                for (const requestedTeam of requestsToBeIncluded) {
                    await EngagmentRepo.cancelRequestToBeIncluded(uid, requestedTeam)
                }
                await this.firestore.doc(`/users/${uid}`).delete()
            }
            await this.auth.deleteUsers(uids)
            return {
                message : 'USERS_DELETED'
            }
        } catch (error) {
            return {
                err : error.code || 'INTERNAL_SERVER_ERROR'
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
        disabled,
        school,
        motivation
    ){
        if (!email || !password || !school || !motivation || !name) {
            return {
                err : 'INVALID_ARGUMENTS'
            }
        }
        try {
            let user = await this.auth.createUser({
                email: email,
                emailVerified: isEmailVerified,
                password: password,
                disabled: disabled,
                displayName: name,
                photoURL: photoURL
            })

            await AuthRepo.addInfos(user.uid,school,motivation,email,name)

            return {
                message : 'user-added'
            }
        } catch (error) {
            return {
                err : error.code || 'internal-server-error'
            }
        }
    }

    static async addUser(
        email,
        password,
        name,
        isEmailVerified,
        photoURL,
        disabled,
        school,
        motivation
    ) {
        if (!email || !password || !school || !motivation || !name) {
            return {
                err: 'INVALID_ARGUMENTS'
            }
        }
        try {
            let user = await this.auth.createUser({
                email: email,
                emailVerified: isEmailVerified,
                password: password,
                disabled: disabled,
                displayName: name,
                photoURL: photoURL
            })

            await AuthRepo.addInfos(user.uid, school, motivation, email, name)

            return {
                message: 'user-added'
            }
        } catch (error) {
            return {
                err: error.code || 'internal-server-error'
            }
        }
    }

    static async updateUser(uid, email, name, school, motivation, emailVerified) {
        try {
            // Update authentication-related information
            const updateUserPayload = {};
            if (email) updateUserPayload.email = email;
            if (name) updateUserPayload.displayName = name;
            if (emailVerified !== undefined) updateUserPayload.emailVerified = emailVerified;

            if (Object.keys(updateUserPayload).length > 0) {
                await this.auth.updateUser(uid, updateUserPayload);
            }

            // Update additional information in Firestore
            const userDocument = this.firestore.doc(`/users/${uid}`);
            const updateData = {};
            if (school) updateData.school = school;
            if (motivation) updateData.motivation = motivation;
            if (email) updateData.email = email;
            if (name) updateData.name = name;

            await userDocument.update(updateData);

            return {
                message: 'PROFILE_UPDATED'
            };
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR',
            };
        }
    }
}

module.exports = AdminActionsRepository