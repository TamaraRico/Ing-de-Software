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
    try {
        var users = MongoDB.getCollection('users');
        var u = await Users.getUserByName(users, username);
        mainWindow.webContents.send('user:get',JSON.stringify(u))
    } catch (err) {
        console.log(err)

    }
})

ipcMain.on('users:findAllUsers', async (e) => {
    try{
        var users = MongoDB.getCollection('users')
        var pre = await Users.fetchUsers(users)
        mainWindow.webContents.send('users:getAllUsers', JSON.stringify(pre))
    } catch (err) {
        console.log(err)
    }
})

ipcMain.on('users:insert',async (e, user) =>{
    try{
        var users = MongoDB.getCollection('users');
        Users.insertUser(users, user)
        mainWindow.webContents.send('users:insert', true)
    } catch (err) {
        mainWindow.webContents.send('users:insert', false)
        console.log(err)
    }
})

ipcMain.on('user:delete',async function deleteOneSale(x, element){
    try{
        var users = MongoDB.getCollection('users');
        Users.deleteUser(users,element)
    } catch (err) {
        console.log(err)
    }
})

ipcMain.on('user:fetch',async function getUser(){
    try{
        var users = MongoDB.getCollection('users');
        mainWindow.webContents.send('users:fetch',await 
        Users.fetchUsers(users))
    } catch (err) {
        console.log(err)
    }
})


ipcMain.on('user:update', async(e, original, data)=>{
    try {
        var users = MongoDB.getCollection('users');
        Users.updateOneUser(users, original, data)
    } catch (err) {
        console.log(err);
    }
})


//--------  FIN CONSULTAS DE EDGAR :) ------------

//--------  INICIO CONSULTAS DE ADRIAN :) ------------
ipcMain.on('product:getByBarcode', async(e, product) => {
    var products = MongoDB.getCollection('products');
    var p = await Products.getProductByBarcode(products, product);
    mainWindow.webContents.send('product:getOne', JSON.stringify(p))
})

ipcMain.on('sells:getByEmployee', async (e, employee, start, end) => {
    var sells = MongoDB.getCollection('sells');
    var s = await Sells.fetchSellsByEmployeeAndDate(sells, employee, start, end);
    mainWindow.webContents.send('sells:getEmployee', s)
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

ipcMain.on('sales:insert',async (e, venta) =>{
    try{
        var sells = MongoDB.getCollection('sells');
        Sells.insertSale(sells, venta)
        mainWindow.webContents.send('sales:insert', true)
    } catch (err) {
        mainWindow.webContents.send('sales:insert', false)
        console.log(err)
    }
})
ipcMain.on('users:checkin',async (e, user_id, fecha) =>{
    try{
        var users = MongoDB.getCollection('users');
        Users.userCheckin(users, user_id, fecha)
    } catch (err) {
        console.log(err)
    }
})
ipcMain.on('users:checkout',async (e, user_id, fecha) =>{
    try{
        var users = MongoDB.getCollection('users');
        Users.userCheckout(users, user_id, fecha)
    } catch (err) {
        console.log(err)
    }
})
//--------  FIN CONSULTAS DE IRVIN :) ------------
