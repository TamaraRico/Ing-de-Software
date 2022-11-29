const objectId = require('mongodb').ObjectId

const insertProvider = async (providers, newListing) => {
    try{
        const res = await providers.insertOne(newListing);
        console.log(`New listing created with the following id: ${res.insertedId}`);
    } catch (err) {
        console.log(err)
    }
}

//Agrega varios productos
const insertMultipleProviders = async (providers, newListings) => {
    try{
        const res = await providers.insertMany(newListings);
        console.log(`${res.insertedCount} new listings created with the following id(s): `);
        console.log(res.insertedIds);
    } catch (err) {
        console.log(err)
    }
}

//Buscar un producto por nombre
const findOneProviderByName = async (providers, nameOfProvider) => {
    try{
        const prov = await providers.findOne({name: nameOfProvider})
        if(prov){
            console.log(`Found a listing in the collection with the name '${nameOfProvider}'`);
            console.log(prov);
            return prov
        } else{
            console.log(`No listings found with the name '${nameOfProvider}'`);
        }
    } catch (err) {
        console.log(err)
        throw err;
    }
}

//Buscar varios producto por nombre
const findMultipleProvidersByName = async (providers, nameOfProvider) => {
    try{
        const cursor = await providers.find({name: nameOfProvider}).limit(50);
        const res = await cursor.toArray();

        if(res.length > 0){
            console.log(`Found listing(s) in the collection with the name '${nameOfProvider}': `);
            res.forEach((result, i) => {
                console.log();
                console.log(`${i + 1}. code: ${res.code}`);
                console.log(`   name: ${res.name}`);
                console.log(`   RFC: ${res.RFC}`);
            })
            return res
        } else{
            console.log(`No listings found with the name '${nameOfProvider}'`);
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}

//Buscar todos los productos
const findAllProviders = async (providers) => {
    try{
        const cursor = await providers.find().limit(50);  //Maximo 50 pero se necesita ver como tomar todos por lotes

        const res = await cursor.toArray();

        if(res.length > 0){
            console.log(`Found listing(s) in the collection: `);
            res.forEach((result, i) => {
                console.log();
                console.log(`${i + 1}. code: ${res.code}`);
                console.log(`   name: ${res.name}`);
                console.log(`   RFC: ${res.RFC}`);
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

//Buscar un producto por codigo de barras
const findOneProviderByCode = async (providers, providersCode) => {
    try{
        const prov = await providers.findOne({code: providersCode})
        if(prov){
            console.log(`Found a listing in the collection with the barcode '${providersCode}'`);
            console.log(prov);
            return prov
        } else{
            console.log(`No listings found with the barcode '${providersCode}'`);
            return prov
        }
    } catch (err) {
        console.log(err)
        throw err;
    }
}

const deleteProviderByCode = async (providers, providersCode) => {
    try{
        const res = await providers.deleteOne({code : providersCode})
    }catch(e){
        throw e
    }
}


//Eliminar un solo producto
const deleteOneProviderByName = async (providers, nameOfProvider) => {
    try{
        const res = await providers.deleteOne({name: nameOfProvider});
        console.log(`${res.deletedCount} document was deleted`);
    } catch (err) {
        console.log(err)
        throw err
    }
}

//Eliminar varios productos
const deleteMultipleProvidersByName = async (providers, nameOfProvider) => {
    try{
        const res = await providers.deleteMany({name: nameOfProvider});
        console.log(`${res.deletedCount} document(s) was/were deleted`);
    } catch (err) {
        console.log(err)
        throw err
    }
}

const getProductByCode = async (providers, code) => {
    try{
        const prov = await providers.findOne({code : code})
        return prov
    }catch(e){
        throw e;
    }
}


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

module.exports = {insertProvider, 
    insertMultipleProviders, 
    findOneProviderByName, 
    findMultipleProvidersByName,
    findAllProviders,
    findOneProviderByCode,
    deleteOneProviderByName,
    deleteProviderByCode,
    deleteMultipleProvidersByName,
    getProductByCode, 
    fetchProviders};