const services = require('../../../commun/utils/fb_config')
const admin = require('../../../commun/utils/admin_config')

class AdminActions {
    static admin = admin

    static async deleteUsers(uides){
        try {
            await admin.auth().deleteUsers(uides)
            return {
                message : 'user-deleted'
            }
        } catch (error) {
            return {
                err : error.code || 'internal-server-error'
            }
        }
    }

    static async disableUsers(uid) {
        try {
            // await admin.auth().updateUser(uid,)
            return {
                message: 'user-deleted'
            }
        } catch (error) {
            return {
                err: error.code || 'internal-server-error'
            }
        }
    }
}