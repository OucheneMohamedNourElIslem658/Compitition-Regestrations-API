Compitition regestration api :
  - This is an api built using firebase-admin sdk and firebase rest api with node js.
  - It manages compitition regestration process.
  - It manages the participation team choice and chosing : each one can create,join,send joining request to a team and each team leader can send request to a participat to join his team.
  - It manages the also admin actions like : gettings users infos and credentials with the authority to crud a user and desable him , also he can accept teams and rejct them and notify them by sending them emails.
  - It has a realtime notification system on the onground and the backgruond to keep users engaged and up to date.
  - It has a lot of authentication methods for users such as : email and password authentfcation with email verification and password reset functionalities ,support for oauth credentials sign in (it supports : Google, Facebook, Play Games, Game Center, Apple, GitHub, Microsoft, Twitter, and Yahoo auths) and supplimentary anonymous auth for the admin for security reasons.

Dependencies :
  - "express": "^4.19.2" ===> node js framwork for web dev.
  - "firebase-admin": "^12.1.1" ===> node sdk for building baas.
  - "http": "^0.0.1-security" ===> node package to interact with apis.
  - "nodemailer": "^6.9.13" ===> node package for sending emails.
  - "socket.io": "^4.7.5" ===> node package to handle realtime updates.

Tips :
  - This api is detailed and built to handle every functionality related to the subject in details.
  - This is one of the few projects that uses most used and essancial firebase cloud services with node you can take it as example or tutorial that helps you build your projects with the same technologies.

Documentation :

Authentication API Documentation

Endpoints
Register User with Email and Password
Endpoint: POST /auth/registerWithEmailAndPassword
Description: Registers a new user with email, password, name, school, and motivation.
Parameters:
email (string, required): User's email address.
password (string, required): User's password.
name (string, required): User's full name.
school (string, required): User's school name.
motivation (string, required): User's motivation statement.
Response:
200 OK: { "message": "EMAIL_SENT" }
404 Not Found: { "err": "error_message" }
Login User with Email and Password
Endpoint: POST /auth/loginWithEmailAndPassword
Description: Logs in a user with email and password.
Parameters:
email (string, required): User's email address.
password (string, required): User's password.
notificationToken (string, optional): Token for sending notifications.
Response:
200 OK: Sets idToken and refreshToken cookies.
404 Not Found: { "err": "error_message" }
Get User Profile
Endpoint: GET /auth/getMyProfile
Description: Retrieves the profile of the authenticated user.
Authentication: Bearer token required.
Response:
200 OK: { "user": user_data }
404 Not Found: { "err": "error_message" }
Get User by UID
Endpoint: POST /auth/getUser
Description: Retrieves a user's profile by their UID.
Parameters:
uid (string, required): User's unique identifier.
Response:
200 OK: { "user": user_data }
404 Not Found: { "err": "error_message" }
Update User
Endpoint: POST /auth/updateUser
Description: Updates user information.
Authentication: Bearer token required.
Parameters:
email (string, optional): New email address.
name (string, optional): New name.
school (string, optional): New school name.
motivation (string, optional): New motivation statement.
Response:
200 OK: { "message": "PROFILE_UPDATED" }
404 Not Found: { "err": "error_message" }
Add Supplementary Information
Endpoint: POST /auth/addSupplementaryInfo
Description: Adds supplementary information to the user's profile.
Authentication: Bearer token required.
Parameters:
school (string, required): User's school name.
motivation (string, required): User's motivation statement.
Response:
200 OK: { "message": "PROFILE_UPDATED" }
404 Not Found: { "err": "error_message" }
Logout User
Endpoint: POST /auth/logout
Description: Logs out the user and removes the notification token.
Authentication: Bearer token required.
Parameters:
notificationToken (string, required): Token to be removed.
Response:
200 OK: { "message": "LOGGEDOUT_SUCCESSFULLY" }
404 Not Found: { "err": "error_message" }
Refresh ID Token
Endpoint: GET /auth/refreshIdToken
Description: Refreshes the ID token using the refresh token.
Authentication: Bearer token required.
Response:
200 OK: Sets new idToken cookie.
404 Not Found: { "err": "error_message" }
Send Password Reset Link
Endpoint: POST /auth/sendPasswordResetLink
Description: Sends a password reset link to the user's email.
Parameters:
email (string, required): User's email address.
Response:
200 OK: { "message": "EMAIL_SENT" }
404 Not Found: { "err": "error_message" }
Send Email Verification Link
Endpoint: GET /auth/sendEmailVerificationLink
Description: Sends an email verification link to the user's email.
Authentication: Bearer token required.
Response:
200 OK: { "message": "EMAIL_SENT" }
404 Not Found: { "err": "error_message" }
Sign In with OAuth Credential
Endpoint: POST /auth/signInWithOAuthCredential
Description: Signs in a user with OAuth credentials.
Parameters:
providerId (string, required): OAuth provider ID.
motivation (string, required): User's motivation statement.
school (string, required): User's school name.
Response:
200 OK: Sets idToken and refreshToken cookies.
404 Not Found: { "err": "error_message" }
Sign In Anonymously
Endpoint: GET /auth/signInAnonymously
Description: Signs in a user anonymously.
Response:
200 OK: Sets idToken and refreshToken cookies.
404 Not Found: { "err": "error_message" }
Socket Events
User Handler
userSnapshot
Description: Listens for real-time updates to the user's profile.
Authorization: Bearer token required.
Response: Emits user data changes in real-time.
Error Codes
INTERNAL_SERVER_ERROR: General internal server error.
INVALID_ARGUMENTS: Invalid arguments provided.
USER_NOT_FOUND: User not found.
EMAIL_NOT_VERIFIED: Email not verified.
UNAUTHORIZED: Unauthorized access.
NO_TOKEN_PROVIDED: No token provided.
LOGGEDOUT_SUCCESSFULLY: User logged out successfully.
PROFILE_UPDATED: User profile updated successfully.
EMAIL_SENT: Email sent successfully.
