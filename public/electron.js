const path = require('path')
const url  = require('url')
const { app, BrowserWindow, ipcMain } = require('electron')

const MongoDB = require('../src/db/mongoUtil');
const Users = require('../src/db/users');
const Providers = require('../src/db/providers');
const Products = require('../src/db/products');
const Sells = require('../src/db/sells');

MongoDB.connectDB();

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width : 800,
        height : 600,
        webPreferences: {
            nodeIntegration : true,
            contextIsolation: true,
            enableRemoteModule: false,
            devTools: true,
            preload: path.join(__dirname, "/preload.js")
        }
    })

    const startURL = process.env.ELECTRON_START_URL || url.format({
        pathname : path.join(__dirname, '/../build/index.html'),
        protocol : 'file',
        slashes : true
    })

    //Load the first html of the application
    mainWindow.loadURL(startURL);

    mainWindow.webContents.openDevTools({mode: 'detach'})

    mainWindow.on('closed', () =>{
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();
    }
});

app.on('activate',() =>{
    if(mainWindow === null){
        createWindow();
    }
});

//--------  INICIO CONSULTAS DE ALONDRA :) ------------
ipcMain.on('products:searchOne', async (e, productName) => {
    var products = MongoDB.getCollection('products')
    var p = await Products.findOneProductByName(products, productName)
    mainWindow.webContents.send('products:get', JSON.stringify(p))
})
    
ipcMain.on('products:add', async (e, listing) => {
    var products = MongoDB.getCollection('products')
    var p = await Products.insertOneProduct(products, listing)
    mainWindow.webContents.send('products:get', JSON.stringify(p))
})
//--------  FIN CONSULTAS DE ALONDRA :) ------------

//--------  INICIO CONSULTAS DE EDGAR :) ------------
ipcMain.on('user:load',  async (e, username) =>{
    var users = MongoDB.getCollection('users');
    var u = await Users.getUserByName(users, username);
    mainWindow.webContents.send('user:get',JSON.stringify(u))
})
//--------  FIN CONSULTAS DE EDGAR :) ------------

//--------  INICIO CONSULTAS DE ADRIAN :) ------------
ipcMain.on('product:getByBarcode', async(e, product) => {
    var products = MongoDB.getCollection('products');
    var p = await Products.getProductByBarcode(products, product);
    mainWindow.webContents.send('product:getOne', JSON.stringify(p))
})
//--------  FIN CONSULTAS DE ADRIAN :) ------------


//--------  INICIO CONSULTAS DE TAMARA :) ------------
ipcMain.on('products:findAllProducts', async (e) => {
    try{
        var products = MongoDB.getCollection('products')
        var p = await Products.fetchProducts(products)
        mainWindow.webContents.send('products:getAllProducts', JSON.stringify(p))
    } catch (err) {
        console.log(err)
    }
})
//--------  FIN CONSULTAS DE TAMARA :) ------------


//--------  INICIO CONSULTAS DE IRVIN :) ------------
ipcMain.on('products:fetch', async function getProducts(){
    try{
        var products = MongoDB.getCollection('products');
        mainWindow.webContents.send('products:fetch',await Products.fetchProducts(products) )
    } catch (err) {
        console.log(err)
    }
})

ipcMain.on('providers:fetch',async function getProviders(){
    try{
        var providers = MongoDB.getCollection('providers');
        mainWindow.webContents.send('providers:fetch',await Providers.fetchProviders(providers))
    } catch (err) {
        console.log(err)
    }
})

ipcMain.on('sales:fetch',async function getSales(){
    try{
        var sells = MongoDB.getCollection('sells');
        mainWindow.webContents.send('sales:fetch',await Sells.fetchSales(sells))
    } catch (err) {
        console.log(err)
    }
})

ipcMain.on('sales_by_date:fetch',async function getSalesByDate(x, start, end){
    try{
        var sells = MongoDB.getCollection('sells');
        mainWindow.webContents.send('sales_by_date:fetch',await Sells.fetchSalesByDate(sells,start,end))
    } catch (err) {
        console.log(err)
    }
})

ipcMain.on('sale:delete',async function deleteOneSale(x, element){
    try{
        var sells = MongoDB.getCollection('sells');
        Sells.deleteSale(sells,element)
    } catch (err) {
        console.log(err)
    }
})

ipcMain.on('sales_by_date:delete',async function deleteByDate(x, elements){
    try{
        var sells = MongoDB.getCollection('sells');
        Sells.deleteSaleByDate(sells,elements)
    } catch (err) {
        console.log(err)
    }
})

//--------  FIN CONSULTAS DE IRVIN :) ------------
