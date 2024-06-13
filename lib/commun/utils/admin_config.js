const admin = require('firebase-admin');
const serviceAccount = require("../../envs/service_account.json");

const fb_admin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports  = fb_admin