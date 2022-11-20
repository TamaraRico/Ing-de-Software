const ObjectID = require('mongodb').ObjectId

const getUserByName = async (users, name) =>{
    try {
        const user = await users.findOne({name: name});
        return user;
    } catch (e) {
        throw e;
    }
}

const findAllUsers = async (users) => {

    try{        
        const cursor = await users.find({});

        const res = await cursor.toArray();
        
        console.log(res)
        if(res.length > 0){
            console.log(`Found listing(s) in the collection: `);
            res.forEach((result, i) => {
                console.log(`name: ${res.name}`);
            })
            
            return res
        } else{
            console.log(`No listings found`);
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}

const fetchUsers = async (users) => {
    try{
        const res = await users.find({})
        //Chocomaniobra para que me lleguen los datos como quiero xd
        var aux = []
        while(await res.hasNext()) {
            const doc = await res.next();
            doc._id = (doc._id).toString()
            aux.push(doc)
        }
    } catch (err) {
        console.log(err)
    }
    return aux
}

const insertUser = async (users,user) => {
    try{
        await users.insertOne(user,{});
    } catch (err) {
        console.log(err)
    }
}

const deleteUser = async (users, user) => {
    try{
        var query = {name: user}
        await users.deleteOne(query,{});
    } catch (err) {
        console.log(err)
    }
}

const updateOneUser = async (users,original,data) => {
    console.log('hola')
    try{
        await users.updateOne(original,data,
            function(err, res) {
                if (err) throw err;
                console.log(res.result.nModified + " document(s) updated")
            });
    } catch (err) {
        console.log(err)
    }
}

module.exports = {getUserByName, findAllUsers, fetchUsers, insertUser, deleteUser, updateOneUser}