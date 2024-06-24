const admin = require('../../../commun/utils/admin_config');
const mailer = require('../../../commun/utils/mailer');
const AuthRepo = require('../../auth/repositories/auth')
const EngagmentRepo = require('../../engage/repositories/engage');
const NotificationsRepo = require('../../engage/repositories/notifications');

class AdminActionsRepository {
    static auth = admin.auth();
    static firestore = admin.firestore()

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
            const updateUserPayload = {};
            if (email) updateUserPayload.email = email;
            if (name) updateUserPayload.displayName = name;
            if (emailVerified !== undefined) updateUserPayload.emailVerified = emailVerified;

            if (Object.keys(updateUserPayload).length > 0) {
                await this.auth.updateUser(uid, updateUserPayload);
            }

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

    static async verifyToken(token) {
        let result = await AuthRepo.verifyToken(token)
        if (result.err == null) {
            if (!result.admin) {
                return {
                    err: 'UNAUTHORIZED'
                }
            } else {
                return result
            }
        } else {
            return result
        }
    }

    static async acceptTeam(teamID) {
        try {
            let teamDoc = this.firestore.doc(`/teams/${teamID}`)
            await teamDoc.update({
                accepted : true
            })

            let teamData = (await teamDoc.get()).data()
            await NotificationsRepo.sendTeamNotification(
                teamData.members,
                'Congratilations!',
                'Your team has been accepted',
                []
            )
            return {
                message : "TEAM_ACCEPTED"
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR',
            };
        }
    }

    static async rejectTeam(teamID) {
        try {
            let teamDoc = this.firestore.doc(`/teams/${teamID}`)
            await teamDoc.update({
                accepted: false
            })

            let teamData = (await teamDoc.get()).data()
            await NotificationsRepo.sendTeamNotification(
                teamData.members,
                'Sorry :(',
                'Your team has been rejected',
                []
            )
            return {
                message: "TEAM_REJECTED"
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR',
            };
        }
    }

    static async makeTeamUnderJugment(teamID) {
        try {
            let teamDoc = this.firestore.doc(`/teams/${teamID}`)
            await teamDoc.update({
                accepted: null
            })
            
            let teamData = (await teamDoc.get()).data()
            await NotificationsRepo.sendTeamNotification(
                teamData.members,
                'Attention',
                'Your team is under jugment for the moment',
                []
            )
            return {
                message: "TEAM_UNDER_JUGMENT"
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR',
            };
        }
    }

    static async getAllTeams() {
        try {
            let teamsCollection = this.firestore.collection('teams')
            let teamsCollectionInfo = await teamsCollection.get()
            let docs = teamsCollectionInfo.docs
            let teams = []
            docs.forEach((doc) => {
                teams.push(doc.data())
            })
            return {
                number: teams.length,
                teams: teams
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }

    static async _sendEmail(receiver, subject, content) {
        await mailer.sendMail({
            to: receiver,
            subject: subject,
            html: `<h1> ${content} </h1>`
        })
    }

    static async sendAcceptationEmails() {
        try {
            const result = await this.getAllTeams()
            if (result.err == null) {
                const teams = result.teams
                teams.forEach(team => {
                    const members = team.members
                    const isAccepted = team.accepted
                    members.forEach(async uid => {
                        const userDoc = this.firestore.doc(`/users/${uid}`)
                        const userData = (await userDoc.get()).data()
                        if (isAccepted == true) {
                            await this._sendEmail(
                                userData.email,
                                'resgestration acceptation',
                                '<h1>Congratulations you have been accepted !</h1>'
                            )
                        } else {
                            await this._sendEmail(
                                userData.email,
                                'resgestration acceptation',
                                '<h1>Sorry you have been rejected :(</h1>'
                            )
                        }
                    });
                });
            } else {
                return {
                    err: result.err
                }
            }
            return {
                message : 'EMAILS_SENT'
            }
        } catch (error) {
            return {
                err : error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }

    static async sendEmail(email,subject,content) {
        try {
            const users = result.users
            users.forEach( async user => {
                await this._sendEmail(
                    email,
                    subject,
                    content
                )
            });
            return {
                message: 'EMAIL_SENT'
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }
}

module.exports = AdminActionsRepository
