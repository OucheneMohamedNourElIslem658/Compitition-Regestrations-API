const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");
const fbOptions = require('../../envs/fb_options')

const firebaseConfig = {
    apiKey: fbOptions.apiKey,
    authDomain: fbOptions.authDomain,
    projectId: fbOptions.projectId,
    storageBucket: fbOptions.storageBucket,
    messagingSenderId: fbOptions.messagingSenderId,
    appId: fbOptions.appId,
    measurementId: fbOptions.messagingSenderId
};

const firebase = initializeApp(firebaseConfig);

const firestore = getFirestore(firebase);
const auth = getAuth(firebase);
let apiKey = firebaseConfig.apiKey

module.exports = {
    firestore,
    auth,
    apiKey
};