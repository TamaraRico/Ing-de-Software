const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            ipcRenderer.send(channel, data);
        },
        receive: (channel, func) => {
            //CAMBIADO DE ON A ONCE
            ipcRenderer.once(channel, (event, ...args) =>  func(...args));
        }
    }
);