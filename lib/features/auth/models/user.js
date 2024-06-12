class UserModel {
    constructor(uid,name,email){
        this.uid = uid
        this.name = name
        this.email = email
    }

    toOBJ() {
        return {
            uid: this.uid,
            name : this.name,
            email : this.email
        }
    }

    static fromOBJ(object) {
        return new UserModel(
            object.uid,
            object.name,
            object.email
        )
    }
}

module.exports = UserModel