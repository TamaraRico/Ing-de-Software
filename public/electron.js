const path = require('path')
const  url  = require('url')

const { app, BrowserWindow } = require('electron')
const { MongoClient } = require("mongodb")


// Replace the uri string with your connection string.
const uri = "mongodb+srv://adrianadame01:lambda-2022@cluster0.6mok6gs.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

/*
//TEST FOR MONGODB CONNECTION
async function run() {
    try {
      const database = client.db('papeleria-pincelin');
      const providers = database.collection('proveedores');
      const query = { nombre: 'Irvin' };
      const provider = await movies.findOne(query);
      console.log(provider);
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}
run().catch(console.dir);
*/

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width : 800,
        height : 600,
        webPreferences: {
            nodeIntegration : true,
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