const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://adrianadame01:lambda-2022@cluster0.6mok6gs.mongodb.net/?retryWrites=true&w=majority";

var _db;

const connectDB = () => {
    const client = new MongoClient(uri);

    _db = client.db('papeleria-pincelin')
}

//--------  INICIO CONSULTAS DE IRVIN :) ------------
const fetchProducts = async () => {
    try{
        var database = getDB();
        var products = database.collection('products');
        const res = await products.find({})
        
        //Chocomaniobra para que me lleguen los datos como quiero xd
        var aux = []
        while(await res.hasNext()) {
            const doc = await res.next();
            aux.push(doc)
        }
        //_products = aux
    } catch (err) {
        console.log(err)
    }
    return aux
}
const fetchProviders = async () => {
    try{
        var database = getDB();
        var providers = database.collection('providers');
        const res = await providers.find({})
        
        //Chocomaniobra para que me lleguen los datos como quiero xd
        var aux = []
        while(await res.hasNext()) {
            const doc = await res.next();
            aux.push(doc)
        }
        //_products = aux
    } catch (err) {
        console.log(err)
    }
    return aux
}
//--------  FIN CONSULTAS DE IRVIN :) ------------
const getDB = () => _db;

module.exports = {  connectDB, getDB, 
                    fetchProviders,fetchProducts, 
                    };
