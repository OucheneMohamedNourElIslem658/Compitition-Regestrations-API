const admin = require("../../../commun/utils/admin_config");

class NotificationsRepo {
    static firestore = admin.firestore();
    static fcm  = admin.messaging()

    static async sendAboutTeamNotification(userName, teamID ,type ,title,body){
        const teamDoc = this.firestore.doc(`/teams/${teamID}`)
        const teamData = (await teamDoc.get()).data()
        let members = teamData.members
        members = !members ? [] : members
        members.forEach( async (member) => {
            const userDoc = this.firestore.doc(`/teams/${uid}`)
            const userData = (await userDoc.get()).data()
            await this.fcm.send({
                token: userData.notifToken,
                notification: {
                    title: title,
                    body: body,
                },
                data: {
                    type : type
                },
            })
            const notifsCollection = this.firestore.collection(`/users/${member}/notifications`)
            const result = await notifsCollection.add({
                type: type,
                userName: userName,
                seen: false
            })
            const notifDocCreationDate = (await result.get()).createTime
            await result.update({
                sentAt: notifDocCreationDate
            })
        })
    }

    static async sendAboutUserNotification(uid, teamName, type,title,body) {
        const userDoc = this.firestore.doc(`/teams/${uid}`)
        const userData = (await userDoc.get()).data()
        await this.fcm.send({
            token: userData.notifToken,
            notification: {
                title: title,
                body: body,
            },
            data: {
                type: type
            },
        })
        const notifsCollection = this.firestore.collection(`/users/${userDoc.id}/notifications`)
        const result = await notifsCollection.add({
            type: type,
            teamName: teamName,
            seen: false
        })
        const notifDocCreationDate = (await result.get()).createTime
        await result.update({
            sentAt: notifDocCreationDate
        })
    }
}