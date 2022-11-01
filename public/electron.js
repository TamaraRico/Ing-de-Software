const path = require('path')
const  url  = require('url')

const { app, BrowserWindow, ipcMain } = require('electron')

const MongoDB = require('../src/db/mongoUtil');
const Products = require('../src/db/products');

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

ipcMain.on('products:searchOne', async (e, productName) => {
    products = MongoDB.getCollection('products')
    p = await Products.findOneProductByName(products, productName)
    mainWindow.webContents.send('products:get', JSON.stringify(p))
})

ipcMain.on('products:add', async (e, listing) => {
    products = MongoDB.getCollection('products')
    p = await Products.insertOneProduct(products, listing)
    mainWindow.webContents.send('products:get', JSON.stringify(p))
})