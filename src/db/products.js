const ObjectID = require('mongodb').ObjectId


const getProductByBarcode = async (products, barcode) => {
    try{
        const product = await products.findOne({barcode : barcode})
        return product
    }catch(e){
        throw e;
    }
}

module.exports = {getProductByBarcode};