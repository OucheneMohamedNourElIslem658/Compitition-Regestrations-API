const WebSocket = require('ws');
const fb_admin = require('../../../commun/utils/admin_config');
const AuthRepo = require('../repositories/auth');

const handleUpgrade = () => userSnapshot.handleUpgrade(request, socket, head, (ws) => {
    userSnapshot.emit('connection', ws, request);
});

const userSnapshot = new WebSocket.Server({ noServer: true });
userSnapshot.on('connection', async (ws, req) => {
    console.log('New client connected to /auth');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    let result = await AuthRepo.verifyToken(token);
    if (!result.err || result.admin) {
            const userDoc = fb_admin.firestore().doc(`/users/${result.uid}`)
            userDoc.onSnapshot((doc) => {
                const userData = doc.data()
                userSnapshot.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(userData));
                    }
                });
            })
    } else {
        console.log(result.err);
        ws.terminate();
    }

    ws.on('message', (message) => {
        console.log('Received from /auth:', message);
        ws.send(`Echo from /auth: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected from /auth');
    });
});

module.exports = handleUpgrade