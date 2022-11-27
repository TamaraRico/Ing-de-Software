const ObjectID = require('mongodb').ObjectId


const fetchSales = async (sells) => {
    try{
        const res = await sells.find({})
        //Chocomaniobra para que me lleguen los datos como quiero xd
        var aux = []
        while(await res.hasNext()) {
            const doc = await res.next();
            doc._id = (doc._id).toString()
            doc.purchased_products = (doc.purchased_products).length
            doc.factured_date = new Date(doc.factured_date).toISOString()
            aux.push(doc)
        }
    } catch (err) {
        console.log(err)
    }
    return aux
}

const fetchSalesByDate = async (sells, start, end) => {
    console.log(start, end)
    try{
        var query = {
            factured_date: {
                $gte: start,
                $lte: end
            }
        }
        const res = await sells.find(query, {})
        
        var aux = []
        while(await res.hasNext()) {
            const doc = await res.next();
            doc._id = (doc._id).toString()
            doc.purchased_products = (doc.purchased_products).length
            doc.factured_date = new Date(doc.factured_date).toISOString()
            aux.push(doc)
        }
    } catch (err) {
        console.log(err)
    }
    return aux
}

const deleteSale = async (sells, id) => {
    try{
        var query = {_id: new ObjectID(id)}
        await sells.deleteOne(query,{});
    } catch (err) {
        console.log(err)
    }
}

const deleteSaleByDate = async (sells,elements) => {
    try{
        console.log(elements.map((str) => (new ObjectID(str))))
        var query = {
            _id: {$in:elements.map((str) => (new ObjectID(str)))}
        }
        await sells.deleteMany(query, {});
    } catch (err) {
        console.log(err)
    }
}

const insertSale = async (sells,venta) => {
    try{
        await sells.insertOne(venta,{});
    } catch (err) {
        console.log(err)
    }
}

module.exports = {fetchSales, fetchSalesByDate, deleteSale, deleteSaleByDate, insertSale};