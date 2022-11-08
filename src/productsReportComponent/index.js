import React from "react";
import { Link } from "react-router-dom";
//import xlsx from 'json-as-xlsx'; //npm install json-as-xlsx
import ExcelJS from 'exceljs'; //npm install json-as-xlsx
import './styles.css'; //Solo pa centrar el boton
import FileSaver from 'file-saver';
import axios from 'axios';
var report_products_number = 1

export default class ProductsReport extends React.Component {
    generateReport(){
      window.api.send('products:fetch');
      window.api.receive('products:fetch',  async (data) => {
          console.log(data)
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Productos");
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
              {font: {italic: true, 'name': 'Roboto','size': 10}, text: "# de reporte de productos:" + report_products_number},
            ]
          };
          report_products_number++
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
              barcode:"0",
              category:"0",
              name:"0",
              quantity:"0",
              price:"0",
              manufacture:"0",
              lastPurchase:"0",
              providerCode:"0",
              discountPercent:"0",
              hasDiscount:"0",
            }
            for (var key in obj){
              if(key === 'barcode') new_content['barcode'] = obj[key]
              else if(key === 'category') new_content['category'] = obj[key]
              else if(key === 'name') new_content['name'] = obj[key]
              else if(key === 'quantity') new_content['quantity'] = obj[key]
              else if(key === 'price') new_content['price'] = obj[key]
              else if(key === 'manufacture') new_content['manufacture'] = obj[key]
              else if(key === 'lastPurchase') new_content['lastPurchase'] = obj[key]
              else if(key === 'providerCode') new_content['providerCode'] = obj[key]
              else if(key === 'discountPercent') new_content['discountPercent'] = obj[key]
              else if(key === 'hasDiscount'){
                new_content['hasDiscount'] = obj[key]
                aux.push(new_content)
              }
            }
            array.push(Object.values(aux[0]))
          }
  
          worksheet.addTable({
            name: 'Tabla_products',
            ref: 'B15',
            headerRow: true,
            style: {
              theme: 'TableStyleMedium4',
              showRowStripes: true,
            },
            columns: [
              {name: "barcode",  filterButton: false},
              {name: "category", filterButton: true},
              {name: "name",  filterButton: false},
              {name: "quantity",  filterButton: false},
              {name: "price",  filterButton: false},
              {name: "manufacture",  filterButton: true},
              {name: "lastPurchase", filterButton: false},
              {name: "providerCode",  filterButton: true},
              {name: "discountPercent", filterButton: false},
              {name: "hasDiscount",  filterButton: true},
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
          var file_name = "products_report_" + new Date().toJSON().slice(0,10).replace(/-/g,'/')
    
          workbook.xlsx.writeBuffer().then(function (data) {
            var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            FileSaver.saveAs(blob, file_name)
          });
          

      });
    }
  
  render(){
    return(
      <div class = "container">
        <button onClick={this.generateReport}>Generar reporte de productos</button>
        <Link to="/">Proveedores</Link>
      </div>
    );
  }
}