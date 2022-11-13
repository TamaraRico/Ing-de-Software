const path = require('path')
const  url  = require('url')

const { app, BrowserWindow, ipcMain } = require('electron')

const MongoDB = require('../src/db/mongoUtil');
const Users = require('../src/db/users');
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

ipcMain.on('user:load',  async (e, username) =>{
    var users = MongoDB.getCollection('users');
    var u = await Users.getUserByName(users, username);
    mainWindow.webContents.send('user:get',JSON.stringify(u))
})

ipcMain.on('product:getByBarcode', async(e, product) => {
    var products = MongoDB.getCollection('products');
    var p = await Products.getProductByBarcode(products, product);
    mainWindow.webContents.send('product:getOne', JSON.stringify(p))
})