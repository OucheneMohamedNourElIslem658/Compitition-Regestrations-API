Compitition regestration api :
- This is an api built using firebase-admin sdk and firebase rest api with node js.
- It manages compitition regestration process.
- It manages the participation team choice and chosing : each one can create,join,send joining request to a team and each team leader can send request to a participat to join his team.
- It manages the also admin actions like : gettings users infos and credentials with the authority to crud a user and desable him , also he can accept teams and rejct them and notify them by sending them emails.
- It has a realtime notification system on the onground and the backgruond to keep users engaged and up to date.
- It has a lot of authentication methods for users such as : email and password authentfcation with email verification and password reset functionalities ,support for oauth credentials sign in (it supports : Google, Facebook, Play Games, Game Center, Apple, GitHub, Microsoft, Twitter, and Yahoo auths) and supplimentary anonymous auth for the admin for security reasons.

Dependencies :
-"express": "^4.19.2" ===> node js framwork for web dev.
-"firebase-admin": "^12.1.1" ===> node sdk for building baas.
-"http": "^0.0.1-security" ===> node package to interact with apis.
-"nodemailer": "^6.9.13" ===> node package for sending emails.
-"socket.io": "^4.7.5" ===> node package to handle realtime updates.
