const fb_admin = require("../../../commun/utils/admin_config");
const EngagmentRepo = require("../repositories/engage");

const notificationsHandler = (socket) => {
    const firestore = fb_admin.firestore()

    const notificationsSnapshot = async () => {
        const authHeader = socket.handshake.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        let result = await EngagmentRepo.verifyToken(token)

        if (result.err == null) {
            const notificationsCollection = firestore.collection(`/users/${result.uid}/notifications`)
                .orderBy('sentAt', 'desc')
            notificationsCollection.onSnapshot((data) => {
                const docs = data.docs
                const notifications = []
                docs.forEach((doc) => {
                    const notificationData = doc.data()
                    notifications.push(notificationData)
                })
                
                const unseenNotifications = notifications.filter((notification) => notification.seen == false)
                socket.emit('message', JSON.stringify({
                    count: notifications.length,
                    unseenCount: unseenNotifications.length,
                    notifications: notifications
                }));
            })
        } else {
            socket.emit('error', result);
        }
    }

    socket.on('notificationsSnapshot', notificationsSnapshot);
}

module.exports = notificationsHandler