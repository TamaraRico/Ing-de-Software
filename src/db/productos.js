const objectId = requiere('mongodb').ObjectId

//Agrega un solo producto
const insertOneProduct = async (products, newListing) => {
    try{
        const res = await products.insertOne(newListing);
        console.log(`New listing created with the following id: ${res.insertedId}`);
    } catch (err) {
        console.log(err)
    }
}

//Agrega varios productos
const insertMultipleProducts = async (products, newListings) => {
    try{
        const res = await products.insertMany(newListings);
        console.log(`${res.insertedCount} new listings created with the following id(s): `);
        console.log(res.insertedIds);
    } catch (err) {
        console.log(err)
    }
}

//Buscar un producto por nombre
const findOneProductByName = async (products, nameOfProduct) => {
    try{
        const product = await products.findOne({name: nameOfProduct})
        if(product){
            console.log(`Found a listing in the collection with the name '${nameOfProduct}'`);
            console.log(product);
            return product
        } else{
            console.log(`No listings found with the name '${nameOfProduct}'`);
        }
    } catch (err) {
        console.log(err)
        throw err;
    }
}

//Buscar varios producto por nombre
const findMultipleProductsByName = async (products, nameOfProduct) => {
    try{
        const cursor = await products.find({name: nameOfProduct}).limit(50);
        const res = await cursor.toArray();

        if(res.length > 0){
            console.log(`Found listing(s) in the collection with the name '${nameOfProduct}': `);
            res.forEach((result, i) => {
                console.log();
                console.log(`${i + 1}. name: ${res.name}`);
                console.log(`   category: ${res.category}`);
                console.log(`   quantity: ${res.quantity}`);
                console.log(`   priceUnit: ${res.priceUnit}`);
                console.log(`   price: ${res.price}`);
                console.log(`   manufacture: ${res.manufacture}`);
                console.log(`   barcode: ${res.barcode}`);
                console.log(`   lastPurchase: ${res.lastPurchase}`);
                console.log(`   providerCode: ${res.providerCode}`);
                console.log(`   discountPercent: ${res.discountPercent}`);
                console.log(`   hasDiscount: ${res.hasDiscount}`);
            })
            return res
        } else{
            console.log(`No listings found with the name '${nameOfProduct}'`);
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}

//Buscar todos los productos
const findAllProducts = async (products) => {
    try{
        const cursor = await products.find().limit(50);  //Maximo 50 pero se necesita ver como tomar todos por lotes

        const res = await cursor.toArray();

        if(res.length > 0){
            console.log(`Found listing(s) in the collection: `);
            res.forEach((result, i) => {
                console.log();
                console.log(`${i + 1}. name: ${res.name}`);
                console.log(`   category: ${res.category}`);
                console.log(`   quantity: ${res.quantity}`);
                console.log(`   priceUnit: ${res.priceUnit}`);
                console.log(`   price: ${res.price}`);
                console.log(`   manufacture: ${res.manufacture}`);
                console.log(`   barcode: ${res.barcode}`);
                console.log(`   lastPurchase: ${res.lastPurchase}`);
                console.log(`   providerCode: ${res.providerCode}`);
                console.log(`   discountPercent: ${res.discountPercent}`);
                console.log(`   hasDiscount: ${res.hasDiscount}`);
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
const findOneProductByBarcode = async (products, productBarcode) => {
    try{
        const product = await products.findOne({barcode: productBarcode})
        if(product){
            console.log(`Found a listing in the collection with the barcode '${productBarcode}'`);
            console.log(product);
            return product
        } else{
            console.log(`No listings found with the barcode '${productBarcode}'`);
        }
    } catch (err) {
        console.log(err)
        throw err;
    }
}

//Eliminar un solo producto
const deleteOneProductByName = async (products, nameOfProduct) => {
    try{
        const res = await products.deleteOne({name: nameOfProduct});
        console.log(`${res.deletedCount} document was deleted`);
    } catch (err) {
        console.log(err)
        throw err
    }
}

//Eliminar varios productos
const deleteMultipleProductsByName = async (products, nameOfProduct) => {
    try{
        const res = await products.deleteMany({name: nameOfProduct});
        console.log(`${res.deletedCount} document(s) was/were deleted`);
    } catch (err) {
        console.log(err)
        throw err
    }
}