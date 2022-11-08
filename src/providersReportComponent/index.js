import React from "react";
import { Link } from "react-router-dom";
//import xlsx from 'json-as-xlsx'; //npm install json-as-xlsx
import ExcelJS from 'exceljs'; //npm install json-as-xlsx
import './styles.css'; //Solo pa centrar el boton
import FileSaver from 'file-saver';
import axios from 'axios';
var report_providers_number = 1

export default class ProvidersReport extends React.Component {
    generateReport(){
      window.api.send('providers:fetch');
      window.api.receive('providers:fetch', async (data) => {
        console.log(data)
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Proveedores");
        worksheet.getCell('D2').value = {
          richText: [
            {font: {italic: true, 'name': 'Edwardian Script ITC','size': 36}, text: 'Papeleria pincelin'},
          ]
        };
        worksheet.getCell('D4').value = {
          richText: [
            {font: {italic: true, 'name': 'Roboto','size': 14}, text: 'Papeleria, regalos y mas'},
          ]
        };
        worksheet.getCell('D6').value = {
          richText: [
            {font: {bold: true, 'name': 'Roboto','size': 10}, text: 'Reporte de inventario'},
          ]
        };
        worksheet.getCell('D8').value = {
          richText: [
            {font: {italic: true, 'name': 'Roboto','size': 10}, text: new Date().toLocaleString()},
          ]
        };
        worksheet.getCell('D10').value = {
          richText: [
            {font: {italic: true, 'name': 'Roboto','size': 10}, text: "# de reporte de proveedores:" + report_providers_number},
          ]
        };
        report_providers_number++
        worksheet.mergeCells('D2:F2' ); worksheet.getCell('D2').alignment = {horizontal: 'center', vertical: 'center'}
        worksheet.mergeCells('D4:F4' ); worksheet.getCell('D4').alignment = {horizontal: 'center', vertical: 'center'}
        worksheet.mergeCells('D6:F6' ); worksheet.getCell('D6').alignment = {horizontal: 'center', vertical: 'center'}
        worksheet.mergeCells('D8:F8' ); worksheet.getCell('D8').alignment = {horizontal: 'center', vertical: 'center'}
        worksheet.mergeCells('D10:F10' ); worksheet.getCell('D10').alignment = {horizontal: 'center', vertical: 'center'}

        const imageBuffer = await axios.get('https://i.postimg.cc/6qgNvkjc/pincelin-logo.png', { responseType: 'arraybuffer' }); //npm install axios
        const imageId2 = workbook.addImage({
          buffer: imageBuffer.data,
          extension: 'png',
        });
        worksheet.addImage(imageId2, 'A2:C10');

        var aux = []
        var array = []
        for (let a in data){
          var obj = data[a];
          var new_content = {
            code:"0",
            name:"0",
            RFC:"0"
          }
          for (var key in obj){
            if(key === 'code') new_content['code'] = obj[key]
            else if(key === 'name') new_content['name'] = obj[key]
            else if(key === 'RFC'){
              new_content['RFC'] = obj[key]
              aux.push(new_content)
            }
          }
          array.push(Object.values(aux[0]))
        }
        console.log(array)

        worksheet.addTable({
          name: 'Tabla_proveedores',
          ref: 'D15',
          headerRow: true,
          style: {
            theme: 'TableStyleMedium4',
            showRowStripes: true,
          },
          columns: [
            {name: "code",  filterButton: false, alignment: { vertical: 'center', horizontal: 'center' }},
            {name: "name",  filterButton: false},
            {name: "RFC",  filterButton: false},
          ],
          rows: array,
        });

        //https://github.com/exceljs/exceljs/issues/83
        const autoWidth = (worksheet, minimalWidth = 10) => {
          worksheet.columns.forEach((column) => {
              let maxColumnLength = 0;
              column.eachCell({ includeEmpty: true }, (cell) => {
                  maxColumnLength = Math.max(
                      maxColumnLength,
                      minimalWidth,
                      cell.value ? cell.value.toString().length : 0
                  );
              });
              column.width = maxColumnLength + 2;
          });
        };
        autoWidth(worksheet)
        var file_name = "providers_report_" + new Date().toJSON().slice(0,10).replace(/-/g,'/')
        workbook.xlsx.writeBuffer().then(function (data) {
          var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
          FileSaver.saveAs(blob, file_name);
          blob = null
        });

      });
    }
  
  render(){
    return(
      <div class = "container">
        <button onClick={this.generateReport}>Generar reporte de proveedores</button>
        <Link to="/productsReport">Productos</Link>
      </div>
    );
  }
}  

/*
Imports necesarios:'
  FileSaver
  ExcelJS
  Axios (Para la imagen del reporte)
Modificacion realizada:
  En preloadjs:
  Se cambio de ipcRenderer.on() a ipcRenderer.once()

        receive: (channel, func) => {
            //CAMBIADO DE ON A ONCE
            ipcRenderer.once(channel, (event, ...args) =>  func(...args));
        }
  Esto debido a que al generar un reporte y cancelarlo los datos se van
  acumulando, generando muchas ventanas de guardado. Checar las consecuencias
  de tener once y si afecta o no a componentes futuros
*/