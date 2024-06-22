const fb_admin = require("../../../commun/utils/admin_config");
const AdminActionsRepository = require("../../admin/repositories/admin_actions");
const EngagmentRepo = require("../repositories/engage");

const teamHandler = (socket) => {
    const firestore = fb_admin.firestore()

    const teamSnapshot = async () => {
        const authHeader = socket.handshake.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const result = await EngagmentRepo.verifyToken(token)

        if (result.err == null) {
            const uid = result.uid
            const userDoc = firestore.doc(`/users/${uid}`)
            const userData = (await userDoc.get()).data()
            const teamID = userData.team
            const teamDoc = firestore.doc(`/teams/${teamID}`)
            teamDoc.onSnapshot((doc) => {
                if (doc.exists) {
                    const teamData = doc.data();
                    const teamRestrictedInfo = {
                        name : teamData.name,
                        leader : teamData.leader,
                        accepted : teamData.accepted
                    }
                    if (uid == teamData.leader) {
                        socket.emit('message', JSON.stringify(teamData));
                    } else {
                        socket.emit('message', JSON.stringify(teamRestrictedInfo));
                    }
                } else {
                    socket.emit('error', 'USER_DOESNT_HAVE_TEAM');
                }
            });
        } else {
            socket.emit('error', result);
        }
    }

    const teamsSnapshot = async () => {
        const authHeader = socket.handshake.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        let result = await AdminActionsRepository.verifyToken(token)

        if (result.err == null) {
            const teamsCollection = firestore.collection('teams')
            teamsCollection.onSnapshot((data) => {
                const docs = data.docs
                const teams = []
                docs.forEach((doc) => {
                    const docData = doc.data()
                    const teamInfo = {
                        accepted : docData.accepted,
                        leader : docData.leader,
                        members : docData.members,
                        name : docData.name
                    }
                    teams.push(teamInfo)
                })
                socket.emit('message', JSON.stringify({
                    count : teams.length,
                    teams : teams
                }));
            })
        } else {
            socket.emit('error', result);
        }
    }

    const suggestedTeamsSnapshot = async () => {
        const authHeader = socket.handshake.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        let result = await EngagmentRepo.verifyToken(token)

        if (result.err == null) {
            const uid = result.uid
            const userDoc = firestore.doc(`/users/${uid}`)
            const teamsCollection = firestore.collection('teams')
            const userData = (await userDoc.get()).data();
            const userTeam = userData.team
            teamsCollection.onSnapshot((data) => {
                const docs = data.docs
                const teams = []
                docs.forEach((doc) => {
                    if (doc.id !== userTeam) {
                        const docData = doc.data()
                        const teamInfo = {
                            accepted: docData.accepted,
                            leader: docData.leader,
                            members: docData.members,
                            name: docData.name
                        }
                        teams.push(teamInfo)
                    }
                })
                socket.emit('message', JSON.stringify({
                    count: teams.length,
                    teams: teams
                }));
            })
        } else {
            socket.emit('error', {
                err: 'INTERNAL_SERVER_ERROR'
            });
        }
    }

    socket.on('teamSnapshot', teamSnapshot);
    socket.on('teamsSnapshot', teamsSnapshot);
    socket.on('suggestedTeamsSnapshot', suggestedTeamsSnapshot)
}

module.exports = teamHandler