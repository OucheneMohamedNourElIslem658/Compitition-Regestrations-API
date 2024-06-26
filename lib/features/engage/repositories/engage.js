const admin = require('../../../commun/utils/admin_config');
const AuthRepo = require('../../auth/repositories/auth');
const NotificationsRepo = require('./notifications');

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
                    accepted : null
                })

                await usersDoc.update({
                    team: teamDoc.id,
                })

                await teamDoc.update({
                    members: [uid]
                })
                
                membersUIDs.forEach(async memberUID => {
                    let result = await this.sendJoinRequest(memberUID, teamDoc.id , uid)
                    if (result.err != null) {
                        return result
                    }
                });
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

    static async getJoinRequests(teamID){
        try {
            let teamDoc = this.firestore.doc(`/teams/${teamID}`)
            let teamData = (await teamDoc.get()).data()
            let joinRequests = !teamData.joinRequests ? [] : teamData.joinRequests
            return {
                joinRequests: joinRequests
            }
        } catch (error) {
            return {
                err : error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }

    static async sendJoinRequest(toID, teamID, accepterID) {
        try {
            let teamDoc = this.firestore.doc(`/teams/${teamID}`)
            let teamData = (await teamDoc.get()).data()
            if (accepterID !== teamData.leader) {
                return {
                    err: 'UNAUTHORIZED'
                }
            }
            let invitedDoc = this.firestore.doc(`/users/${toID}`)
            let invitedData = (await invitedDoc.get()).data()
            let invitedRequests = !invitedData.requests ? [] : invitedData.requests
            let joinRequests = !teamData.joinRequests ? [] : teamData.joinRequests
            if (teamData.members.includes(toID)) {
                return {
                    err: 'THIS_USER_IS_ALREADY_IN_THE_TEAM'
                }
            } else {
                if (!invitedRequests.includes(teamID)) {
                    invitedRequests.push(teamID)
                } else {
                    return {
                        err: "YOU_ALREADY_SENT_REQUEST_TO_THIS_USER"
                    }
                }
                await invitedDoc.update({
                    requests: invitedRequests
                })

                joinRequests.push(toID)
                await teamDoc.update({
                    joinRequests: joinRequests
                })
            }

            await NotificationsRepo.sendUserNotification(
                toID,
                'New join request',
                `New join request from ${teamData.name} has been sent to you`
            )

            return {
                message: 'REQUEST_SENT'
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }



    static async requestToBeIncluded(uid, teamID) {
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
                let teamRequests = !teamData.requests ? [] : teamData.requests
                let requestsToBeIncluded = !userData.requestsToBeIncluded ? [] : userData.requestsToBeIncluded
                let requests = userData.requests
                if (requests.includes(teamID)) {
                    return {
                        err: 'TEAM_ALREADY_REQUESTED_YOU'
                    }
                }

                teamRequests.push(uid)
                await teamDoc.update({
                    requests: teamRequests
                })

                requestsToBeIncluded.push(teamDoc.id)
                await usersDoc.update({
                    requestsToBeIncluded: requestsToBeIncluded
                })

                await NotificationsRepo.sendUserNotification(
                    teamData.leader,
                    'New Joining team request',
                    `New Joining team request has been sent from ${userData.name}`
                )

                return {
                    message: "REQUEST_SENT"
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

    static async cancelRequestToBeIncluded(uid, teamID ,rejecterID) {
        if (!uid && !teamID) {
            return {
                err: "INVALID_ARGUMENTS"
            }
        }
        try {
            let usersDoc = this.firestore.doc(`/users/${uid}`)
            let userData = (await usersDoc.get()).data()
            let teamDoc = this.firestore.doc(`/teams/${teamID}`)
            let teamData = (await teamDoc.get()).data()
            if (rejecterID !== uid && rejecterID !== teamData.leader) {
                return {
                    err : 'UNAUTHORIZED'
                }
            }
            let teamRequests = teamData.requests
            let requestsToBeIncluded = userData.requestsToBeIncluded   

            teamRequests = teamRequests.filter(request => request !== uid);
            await teamDoc.update({
                requests: teamRequests
            })

            requestsToBeIncluded = requestsToBeIncluded.filter(request => request !== teamID);
            await usersDoc.update({
                requestsToBeIncluded: requestsToBeIncluded
            })

            if (rejecterID == uid) {
                await NotificationsRepo.sendUserNotification(
                    teamData.leader,
                    'Team joining request calanceled',
                    `Team joining request sent by ${userData.name} has been calanceled`
                )
            } else {
                await NotificationsRepo.sendUserNotification(
                    uid,
                    'Team joining request rejected',
                    `${teamData.name} team joining request has been rejected`
                )
            }

            return {
                message: "REQUEST_REMOVED"
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }

    static async joinGroup(uid,teamID,adderID) {
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
                if (teamData.leader !== adderID && adderID !== uid) {
                    return {
                        err: 'UNAUTHORIZED'
                    }
                }

                let members = teamData.members
                let requests = !userData.requests ? [] : userData.requests
                let requestsToBeIncluded = !userData.requestsToBeIncluded ? [] : userData.requestsToBeIncluded
                let teamRequests = !teamData.requests ? [] : teamData.requests
                if (members.length == 5) {
                    // do not erase requests because some members of the team can be banished
                    return {
                        err : 'TEAM_IS_FULL'
                    }
                }

                requests = requests.filter(team => team !== teamID);
                requestsToBeIncluded = requestsToBeIncluded.filter(team => team !== teamID);
                teamRequests = teamRequests.filter(user => user !== uid);

                members.push(usersDoc.id)
                await teamDoc.update({
                    members : members,
                    requests : requests
                })
                await usersDoc.update({
                    team : teamDoc.id,
                    requests : requests,
                    requestsToBeIncluded: requestsToBeIncluded
                })

                if (adderID == teamData.leader) {
                    await NotificationsRepo.sendUserNotification(
                        uid,
                        `Join Request Accepted`,
                        `${teamData.name} has accepted your join request`
                    )

                    await NotificationsRepo.sendTeamNotification(
                        members,
                        'New member in your team',
                        `${userData.name} has joined your team!`,
                        [teamData.leader,uid]
                    )
                } else {
                    await NotificationsRepo.sendTeamNotification(
                        members,
                        'New member in your team',
                        `${userData.name} has joined your team!`,
                        [uid]
                    )
                }

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

    static async getMyGroup(uid) {
        if (!uid) {
            return {
                err: "INVALID_ARGUMENTS"
            }
        }
        try {
            let usersDoc = this.firestore.doc(`/users/${uid}`)
            let userData = (await usersDoc.get()).data()
            if (!userData.team) {
                return {
                    err: 'DONT_HAVE_TEAM'
                }
            } else {
                let teamDoc = this.firestore.doc(`/teams/${userData.team}`)
                let teamData = (await teamDoc.get()).data()
                if (!teamData) {
                    return {
                        err: 'INTERNAL_SERVER_ERROR'
                    }
                } else {
                    return teamData
                }
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }

    static async getSuggestedTeams(uid) {
        if (!uid) {
            return {
                err: "INVALID_ARGUMENTS"
            }
        }
        try {
            let usersDoc = this.firestore.doc(`/users/${uid}`)
            let userData = (await usersDoc.get()).data()
            let userTeam = userData.team
            let teamsCollection = this.firestore.collection('teams')
            let teamsCollectionInfo = await teamsCollection.get()
            let docs = teamsCollectionInfo.docs
            let suggestedTeams = []
            docs.forEach((doc) => {
                if (doc.id !== userTeam) {
                    suggestedTeams.push(doc.data())
                }
            })
            return {
                number : suggestedTeams.length,
                teams : suggestedTeams
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }

    static async leaveGroup(uid, teamID,deleterID) {
        if (!uid && !teamID) {
            return {
                err: "INVALID_ARGUMENTS"
            }
        }
        try {
            let usersDoc = this.firestore.doc(`/users/${uid}`)
            let userData = (await usersDoc.get()).data()
            let teamDoc = this.firestore.doc(`/teams/${teamID}`)
            let teamData = (await teamDoc.get()).data()

            if (teamData.leader !== deleterID && deleterID !== uid) {
                return {
                    err: 'UNAUTHORIZED'
                }
            }

            let members = teamData.members

            members = members.filter(member => member !== uid);
            if (members.length == 0) {
                await teamDoc.delete()
                return {
                    message : 'TEAM_DELETED'
                }
            } else {
                let formalLeader = teamData.leader
                if (formalLeader == uid) {
                    teamData.leader = members[0]
                }
                await teamDoc.update({
                    leader : teamData.leader,
                    members : members
                })

                if (formalLeader == uid) {
                    await NotificationsRepo.sendUserNotification(
                        teamData.leader,
                        'New team leader',
                        'You have been promoted randomly to be your team leader',
                    )
                    await NotificationsRepo.sendTeamNotification(
                        members,
                        'New team leader',
                        `Welcome your new team leader ${userData.name}`,
                        [teamData.leader]
                    )
                }
            }

            await usersDoc.update({
                team: null
            })

            if (teamData.leader == deleterID) {
                await NotificationsRepo.sendUserNotification(
                    uid,
                    'You have been cicked out',
                    `You have been cicked you out of ${teamData.name}`
                )
                await NotificationsRepo.sendTeamNotification(
                    members,
                    'Member left your group',
                    `${userData.name} has left your group`,
                    [teamData.leader,uid]
                )

            } else {
                await NotificationsRepo.sendTeamNotification(
                    members,
                    'Member left your group',
                    `${userData.name} has left your group`,
                    [uid]
                )
            }

            return {
                message: "TEAM_LEAVED"
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }

    static async setTeamLeader(uid, teamID,editerID) {
        if (!uid && !teamID) {
            return {
                err: "INVALID_ARGUMENTS"
            }
        }
        try {
            let teamDoc = this.firestore.doc(`/teams/${teamID}`)
            let teamData = (await teamDoc.get()).data()
            let members = teamData.members

            if (editerID !== teamData.leader) {
                return {
                    err : 'UNAUTHORIZED'
                }
            }

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

            let leaderDoc = this.firestore.doc(`/users/${uid}`)
            let leaderData = (await leaderDoc.get()).data()

            await NotificationsRepo.sendTeamNotification(
                members,
                'New team leader',
                `Welcome your new team leader ${leaderData.name}`,
                [editerID]
            )

            return {
                message: "LEADER_SETED"
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }

    static async rejectRequest(uid, teamID,cancelerID) {
        try {
            let usersDoc = this.firestore.doc(`/users/${uid}`)
            let userData = (await usersDoc.get()).data()
            let teamDoc = this.firestore.doc(`/teams/${teamID}`)
            let teamData = (await teamDoc.get()).data()
            if (cancelerID !== uid && cancelerID !== teamData.leader) {
                return {
                    err : 'UNAUTHORIZED'
                }
            }
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

            if (cancelerID == uid) {
                await NotificationsRepo.sendUserNotification(
                    teamData.leader,
                    'Join request rejected',
                    `${userData.name} has rejected your join request`
                )
            } else {
                await NotificationsRepo.sendUserNotification(
                    uid,
                    'Join request calnced',
                    `${userData.name} has canceled ${teamData.name}'s join request`
                ) 
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

    static async getRequestsToBeIncluded(uid) {
        try {
            let usersDoc = this.firestore.doc(`/users/${uid}`)
            let userData = (await usersDoc.get()).data()
            let requestsToBeIncluded = !userData.requestsToBeIncluded ? [] : userData.requestsToBeIncluded
            return {
                requestsToBeIncluded: requestsToBeIncluded
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }

    static async changeTeamName(teamID,newName,editerID) {
        try {
            let teamDoc = this.firestore.doc(`/teams/${teamID}`)
            let teamData = (await teamDoc.get()).data()
            if (editerID !== teamData.leader) {
                return {
                    err : 'UNAUTHORIZED'
                }
            }
            await teamDoc.update({
                name : newName
            })

            await NotificationsRepo.sendTeamNotification(
                teamData.members,
                'Team info edited',
                `Team name has been edited to ${newName}`,
                [editerID]
            )

            return {
                message: 'NAME_UPDATED'
            }
        } catch (error) {
            return {
                err: error || 'INTERNAL_SERVER_ERROR'
            }
        }
    }

    static async verifyToken(token){
        let result = await AuthRepo.verifyToken(token)
        if (result.err == null) {
            if (!result.admin) {
                return result
            } else {
                return {
                    err: 'UNAUTHORIZED'
                }
            }
        } else {
            return result
        }
    }
}

module.exports = EngagmentRepo