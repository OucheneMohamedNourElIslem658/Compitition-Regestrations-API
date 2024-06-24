const nodemailer = require('nodemailer')
const config = require('../../envs/service_account.json')

const mailer = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: config.email,
        pass: config.pass
    }
})

module.exports = mailer