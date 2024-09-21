Compitition regestration api :
  - API built using firebase-admin sdk and firebase rest api with node js.
  - It manages compitition regestration process.
  - It manages the participant's team choice and chosing : each one can create,join,send joining requests to other teams and each team leader can send requests to a participants to join his team.
  - It manages the also admin actions like : gettings users infos and credentials with the authority to crud a user and desable him , also he can accept teams and reject them and notify them by sending them emails.
  - It has a realtime notification system on the onground (with firestore realtime features) and the background (with firebase cloud messaging) to keep users engaged and up to date.
  - It has a lot of authentication methods (with firebase auth) for users such as : email and password authentfcation with email verification and password reset functionalities ,support for oauth credentials sign in (it supports : Google, Facebook, Play Games, Game Center, Apple, GitHub, Microsoft, Twitter, and Yahoo auths) and supplimentary anonymous auth for the admin for security reasons.

Dependencies :
  - "express": "^4.19.2" ===> node js framwork for web dev.
  - "firebase-admin": "^12.1.1" ===> sdk for building baas.
  - "http": "^0.0.1-security" ===> node package to interact with apis.
  - "nodemailer": "^6.9.13" ===> node package for sending emails.
  - "socket.io": "^4.7.5" ===> node package to handle realtime updates.

Tips :
  - This api built to handle every functionality related to the subject in details.
  - This is one of the the few projects that uses firebase cloud services with node, you can take it as example or tutorial that helps you build your projects with the same technologies.
