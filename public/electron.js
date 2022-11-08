const path = require('path')
const  url  = require('url')
const ExcelJS = require('exceljs')
const { app, BrowserWindow, ipcMain } = require('electron')
var FileSaver = require('file-saver');
const MongoDB = require('../src/db/mongoUtil');

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

//EXAMPLE OF LOAD WITH MONGODB
ipcMain.on('provider:load', getSabritasProvider)


//EXAMPLE OF ASYNC FUNCTION TO RETRIEVE DATA FROM MONGODB
async function getSabritasProvider(){
    try{
        var database = MongoDB.getDB();
        var providers = database.collection('providers');

        const res = await providers.findOne({name: 'Sabritas'})

        mainWindow.webContents.send('provider:get', JSON.stringify(res))
    } catch (err) {
        console.log(err)
    }
}


//--------  INICIO CONSULTAS DE IRVIN :) ------------
ipcMain.on('products:fetch', getProducts)
async function getProducts(){
    try{
        mainWindow.webContents.send('products:fetch',await MongoDB.fetchProducts() )
    } catch (err) {
        console.log(err)
    }
}

ipcMain.on('providers:fetch', getProviders)
async function getProviders(){
    try{
        MongoDB.fetchProviders()
        mainWindow.webContents.send('providers:fetch',await MongoDB.fetchProviders())
    } catch (err) {
        console.log(err)
    }
}
//--------  FIN CONSULTAS DE IRVIN :) ------------