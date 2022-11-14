const ObjectID = require('mongodb').ObjectId


const fetchProviders = async (providers) => {
    try{
        const res = await providers.find({})
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
module.exports = {fetchProviders};