const admin = require('../../../commun/utils/admin_config')

class EngagmentRepo {
    static firestore = admin.firestore();
    static auth = admin.auth()

    static async createGroup(uid,teamName,membersUIDs){
        if (!uid && !teamName) {
            return {
                err : "INVALID_ARGUMENTS"
            }
        }
        try {
            let usersDoc = this.firestore.doc(`/users/${uid}`)
            let userData = (await usersDoc.get()).data()
            membersUIDs = !membersUIDs ? [] : membersUIDs
            if (membersUIDs.length > 4) {
                return {
                    err: "MAX_IS_5"
                }
            }

            if (membersUIDs.includes(uid)) {
                return {
                    err: "INVALID_ARGUMENTS"
                }
            }
            if (!userData.team) {
                let teamDoc = await this.firestore.collection('teams').add({
                    leader: uid,
                    name: teamName,
                })
                
                membersUIDs.forEach(async memberUID => {
                    await this.sendJoinRequest(memberUID, teamDoc.id)
                });

                await usersDoc.update({
                    team: teamDoc.id,
                })

                await teamDoc.update({
                    members: [uid]
                })
                return {
                    message : "TEAM_CREATED"
                }
            } else {
                return {
                    err: 'ALREADY_HAS_TEAM'
                }
            }
        } catch (error) {
            return {
                err : error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }

    static async sendJoinRequest(toID,teamID){
        try {
            let teamDoc = this.firestore.doc(`/teams/${teamID}`)
            let teamData = (await teamDoc.get()).data()
            let invitedDoc = this.firestore.doc(`/users/${toID}`)
            let invitedData = (await invitedDoc.get()).data()
            let invitedRequests = !invitedData.requests ? [] : invitedData.requests
            if (teamData.members.includes(toID)) {
                return {
                    err : 'THIS_USER_IS_ALREADY_IN_THE_TEAM'
                }
            } else {
                invitedRequests.push(teamID)
                await invitedDoc.update({
                    requests: invitedRequests
                })
            }
            return {
                message : 'REQUEST_SENT'
            }
        } catch (error) {
            return {
                err : error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }

    static async joinGroup(uid,teamID) {
        if (!uid && !teamID) {
            return {
                err: "INVALID_ARGUMENTS"
            }
        }
        try {
            let usersDoc = this.firestore.doc(`/users/${uid}`)
            let userData = (await usersDoc.get()).data()
            if (!userData.team) {
                let teamDoc = this.firestore.doc(`/teams/${teamID}`)
                let teamData = (await teamDoc.get()).data()
                let members = teamData.members
                let requests = userData.requests
                if (members.length == 5) {
                    // do not erase requests because some members of the team can be banished
                    return {
                        err : 'TEAM_IS_FULL'
                    }
                }

                requests = requests.filter(team => team !== teamID);

                members.push(usersDoc.id)
                await teamDoc.update({
                    members : members
                })
                await usersDoc.update({
                    team : teamDoc.id,
                    requests : requests
                })

                return {
                    message: "JOINED_TEAM"
                }
            } else {
                return {
                    err: 'ALREADY_HAS_TEAM'
                }
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }

    static async leaveGroup(uid, teamID) {
        if (!uid && !teamID) {
            return {
                err: "INVALID_ARGUMENTS"
            }
        }
        try {
            let usersDoc = this.firestore.doc(`/users/${uid}`)
            let teamDoc = this.firestore.doc(`/teams/${teamID}`)
            let teamData = (await teamDoc.get()).data()
            let members = teamData.members

            members = members.filter(member => member !== uid);
            if (members.length == 0) {
                await teamDoc.delete()
                return {
                    message : 'TEAM_DELETED'
                }
            } else {
                if (teamData.leader == uid) {
                    teamData.leader = members[0]
                }
                await teamDoc.update({
                    leader : teamData.leader,
                    members : members
                })
            }

            await usersDoc.update({
                team: null
            })

            return {
                message: "TEAM_LEAVED"
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }

    static async setTeamLeader(uid, teamID) {
        if (!uid && !teamID) {
            return {
                err: "INVALID_ARGUMENTS"
            }
        }
        try {
            let teamDoc = this.firestore.doc(`/teams/${teamID}`)
            let teamData = (await teamDoc.get()).data()
            let members = teamData.members

            if (!members.includes(uid)) {
                return {
                    err : 'THIS_USER_IS_NOT_MEMBER'
                }
            } else {
                if (teamData.leader == uid) {
                    return {
                        err : 'THIS_USER_IS_ALREADY_TEAM_LEADER'
                    }
                }
                await teamDoc.update({
                    leader: uid,
                })
            }

            return {
                message: "LEADER_SETED"
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }

    static async rejectRequest(uid, teamID) {
        try {
            let usersDoc = this.firestore.doc(`/users/${uid}`)
            let userData = (await usersDoc.get()).data()
            let requests = userData.requests
            if (!userData.requests.includes(teamID)) {
                return {
                    err: 'REQUEST_NOT_FOUND'
                }
            } else {
                requests = requests.filter(team => team !== teamID);
                await usersDoc.update({
                    requests: requests
                })
            }
            return {
                message: 'REQUEST_REJECTED'
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }

    static async getRequests(uid) {
        try {
            let usersDoc = this.firestore.doc(`/users/${uid}`)
            let userData = (await usersDoc.get()).data()
            let requests = !userData.requests ? [] : userData.requests
            return {
                requests: requests
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }
}

module.exports = EngagmentRepo