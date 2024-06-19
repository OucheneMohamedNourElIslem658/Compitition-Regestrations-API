const fb_admin = require("../../../commun/utils/admin_config");
const AuthRepo = require("../repositories/auth");

const userHandler = (socket) => {
    const firestore = fb_admin.firestore()

    const userSnapshot = async () => {
        const authHeader = socket.handshake.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        let result = await AuthRepo.verifyToken(token)

        if (result.err == null) {
            const userDoc = firestore.doc(`/users/${result.uid}`)
            userDoc.onSnapshot((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    socket.emit('message', JSON.stringify(userData));
                } else {
                    socket.emit('error', {
                        err: 'INTERNAL_SERVER_ERROR'
                    });
                }
            });
        } else {
            socket.emit('error', result);
        }
    }

    socket.on('userSnapshot', userSnapshot);
}

module.exports = userHandler