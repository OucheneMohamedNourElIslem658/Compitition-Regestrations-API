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
            // const userDoc = this.firestore.doc(`/teams/${uid}`)
            // const userData = (await userDoc.get()).data()
            // await this.fcm.send({
            //     token: userData.notifToken,
            //     notification: {
            //         title: title,
            //         body: body,
            //     },
            //     data: {
            //         type : type
            //     },
            // })
            const notifsCollection = this.firestore.collection(`/users/${member}/notifications`)
            const result = await notifsCollection.add({
                title : title,
                body : body,
                seen: false
            })
            const notifDocCreationDate = (await result.get()).createTime
            await result.update({
                sentAt: notifDocCreationDate
            })
        })
    }

    static async sendUserNotification(uid,title,body) {
        const userDoc = this.firestore.doc(`/users/${uid}`)
        // const userData = (await userDoc.get()).data()
        // await this.fcm.send({
        //     token: userData.notifToken,
        //     notification: {
        //         title: title,
        //         body: body,
        //     },
        //     data: {
        //         type: type
        //     },
        // })
        const notifsCollection = this.firestore.collection(`/users/${userDoc.id}/notifications`)
        const result = await notifsCollection.add({
            title : title,
            body : body,
            seen: false
        })
        const notifDocCreationDate = (await result.get()).createTime
        await result.update({
            sentAt: notifDocCreationDate
        })
    }
}

module.exports = NotificationsRepo