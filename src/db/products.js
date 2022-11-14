const ObjectID = require('mongodb').ObjectId


const getProductByBarcode = async (products, barcode) => {
    try{
        const product = await products.findOne({barcode : barcode})
        return product
    }catch(e){
        throw e;
    }
}

const fetchProducts = async (products) => {
    try{
        const res = await products.find({})
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

const getAllProducts = async (products) => {
    try{
        const product = await products.find({})
        console.log("Product de funcion getAllproducts", product)
        return product
    }catch(e){
        throw e;
    }
}

module.exports = {getProductByBarcode, fetchProducts, getAllProducts};