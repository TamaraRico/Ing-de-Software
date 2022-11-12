const ObjectID = require('mongodb').ObjectId

const getUserByName = async (users, name) =>{
    try {
        const user = await users.findOne({name: name});
        return user;
    } catch (e) {
        throw e;
    }
}

module.exports = {getUserByName}