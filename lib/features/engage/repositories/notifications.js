const admin = require("../../../commun/utils/admin_config");

class NotificationsRepo {
    static firestore = admin.firestore();
    static fcm  = admin.messaging()

    static async sendTeamNotification(members,title,body,ignoredIDs){
        members = !members ? [] : members
        ignoredIDs.forEach((ignored) => {
            members = members.filter(member => member !== ignored);
        })
        members.forEach( async (member) => {
            const userDoc = this.firestore.doc(`/teams/${member}`)
            const userData = (await userDoc.get()).data()

            const notifsCollection = this.firestore.collection(`/users/${member}/notifications`)
            const result = await notifsCollection.add({
                title : title,
                body : body,
                seen: false
            })
            const notifDocCreationDate = (await result.get()).createTime
            await result.update({
                sentAt: notifDocCreationDate.seconds
            })

            const notificationTokens = !userData.notificationTokens ? [] : userData.notificationTokens
            notificationTokens.forEach(async (token) => {
                await this.fcm.send({
                    token: token,
                    notification: {
                        title: title,
                        body: body,
                    },
                    data: {
                        about: title
                    },
                })
            })
        })
    }

    static async sendUserNotification(uid,title,body) {
        const userDoc = this.firestore.doc(`/users/${uid}`)
        const userData = (await userDoc.get()).data()

        const notifsCollection = this.firestore.collection(`/users/${userDoc.id}/notifications`)
        const result = await notifsCollection.add({
            title : title,
            body : body,
            seen: false
        })
        const notifDocCreationDate = (await result.get()).createTime

        const notificationTokens = !userData.notificationTokens ? [] : userData.notificationTokens
        notificationTokens.forEach(async (token) => {
            await this.fcm.send({
                token: token,
                notification: {
                    title: title,
                    body: body,
                },
                data: {
                    about: title
                },
            })
        })

        await result.update({
            sentAt: notifDocCreationDate.seconds
        })
    }

    static async seeNotification(uid, notifID) {
        try {
            const notifDoc = this.firestore.doc(`/users/${uid}/notifications/${notifID}`)
            await notifDoc.update({
                seen: true
            })
            return {
                message: 'NOTIF_SEEN'
            }
        } catch (error) {
            return {
                err : error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }

    static async unseeNotification(uid, notifID) {
        try {
            const notifDoc = this.firestore.doc(`/users/${uid}/notifications/${notifID}`)
            await notifDoc.update({
                seen: false
            })
            return {
                message: 'NOTIF_UNSEEN'
            }
        } catch (error) {
            return {
                err: error.code || 'INTERNAL_SERVER_ERROR'
            }
        }
    }
}

module.exports = NotificationsRepo