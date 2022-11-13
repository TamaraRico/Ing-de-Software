# IS 2022 / PUNTO DE VENTA ( Papeleria Pincelin )

Establece una aplicacion de punto de venta + inventario y gestion por medio de MERN 

M: MongoDB

E: Electron.js

R: React.js

N: Nodejs

## Estructura de la aplicacion

La aplicacion contiene las siguientes carpetas
![Carpetas.png](https://user-images.githubusercontent.com/47167208/199149972-c5cd56e4-6d00-4c62-b1b5-a0da7e6ed22f.png)

Carpetas a destacar:

**public/**

![public.png](https://user-images.githubusercontent.com/47167208/199150441-51c5d46b-44e7-459d-8b3a-96849e8cd498.png)

Esta carpeta contiene todos los archivos relacionados con la carga de ambos frameworks (Electron.js y React.js)

**src/**

![src.png](https://user-images.githubusercontent.com/47167208/199150545-5efe17fd-28d6-44cd-90e8-fe2e92c7de9c.png)

Esta carpeta contiene todos los componentes React de la aplicacion asi como la configuracion y consultas a la base de datos por medio de la carpeta db/

Cabe mencionar que el archivo index.js es el encargado de generar todos los Links de los componentes, por lo que al agregar uno nuevo favor de agregarlo al archivo index.js

## Scripts de compilacion
![scripts.png](https://user-images.githubusercontent.com/47167208/199151000-054b70e2-9f19-4bb7-aa96-33b418c9ca5c.png)
Debido a la facilidad de Node.js, hice varios scripts para las diferentes tareas de la aplicacion, sin embargo existen 3 importantes:
* **build** : Compila todas las dependencias en un archivo ejecutable instalable
* **deploy** : Compila todas las dependencias en un archivo ejecutable instalable ademas de agregarlo al apartado Releases de Github
* **dev** :  Compila el programa en ventana de desarrollador

Estos scripts como su nombre menciona, son los encargados de compilar la aplicacion, en nuestro caso debido a que seguimos en fase de desarrollo, utilizaremos el script dev para ver el progreso.

Forma de ejecutar script en la terminal ( puede ser de vscode )
```terminal
npm run /*nombre del script*/
```

## Informacion adicional
### Como acceder a la base de datos
El archivo mongoUtils.js contiene toda la conexion a el servidor y exporta las funciones de conexion y seleccion de base de datos
![mongo.png](https://user-images.githubusercontent.com/47167208/199152384-114875b2-db71-4b18-b96d-5e9d88f702b0.png)

Para hacer una consulta debemos hacer uso del objeto **ipcMain** de electron, por lo que debemos modificar el archivo de public/electron.js
![electron.png](https://user-images.githubusercontent.com/47167208/199152678-11cd386a-8326-401d-af2c-2b97d7907242.png)

Debemos establecer un canal para pasar la informacion desde el servidor hasta el cliente, se resuelve de la siguiente manera:
![examplemongo.png](https://user-images.githubusercontent.com/47167208/199152819-b2177726-e705-478a-b217-bd394542e003.png)

Aqui suceden varias cosas:
* ipcMain.on(canal, funcion a realizar);
* mainWindow.webContents.send(canal{diferente}, dato a enviar{forma de JSON.stringify})

Por ultimo, en donde utilizaremos esos canales y como accederemos a ellos a traves de React:
![test.png](https://user-images.githubusercontent.com/47167208/199153343-a5d250ce-2eab-4ea3-a82c-7fe155cccdc5.png)

Como se puede observar, para hacer uso de la base de datos entre electron y React, es estableciendo canales y llamando por medio de ipcMain de lado electron.js o window.api.send/receive de lado React.js

Prueba de funcionamiento:
![test_elec.png](https://user-images.githubusercontent.com/47167208/199153620-10715c5a-6288-4aa1-8acd-8b890a2e5742.png)
