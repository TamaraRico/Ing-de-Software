import React from "react";
import { Link } from "react-router-dom";
import xlsx from 'json-as-xlsx'; //npm install json-as-xlsx
import './styles.css'; //Solo pa centrar el boton

export default class ProductsReport extends React.Component {
    generateReport(){
        window.api.send('products:fetch');
        console.log("xd")
        window.api.receive('products:fetch', (data) => {
            let document = []
            let productos_sheet = {
              sheet: "Productos",
              columns: [
                {label: "barcode", value: "barcode"},
                {label: "category", value: "category"},
                {label: "name", value: "name"},
                {label: "quantity", value: "quantity"},
                {label: "price", value: "price"},
                {label: "manufacture", value: "manufacture"},
                {label: "lastPurchase", value: "lastPurchase"},
                {label: "providerCode", value: "providerCode"},
                {label: "discountPercent", value: "discountPercent"},
                {label: "hasDiscount", value: "hasDiscount"}
              ],
              //Contenido vacio para rellenarlo con el json de datos
              content: [
      
              ]
            }
            for (let a in data){
              var obj = data[a];
              var aux = productos_sheet
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
                  aux['content'].push(new_content)
                }
              }
            }
            document[0] = productos_sheet
            //Nombre de xlsx sujeto a cambios
            var file_name = "products_report_" + new Date().toJSON().slice(0,10).replace(/-/g,'/')
            let settings = {
              fileName: file_name,
              extraLength: 3, 
              writeOptions: {},
              RTL: false, 
            }
            
            xlsx(document, settings)
        });

    }
  
  render(){
    return(
      <div class = "container">
        <button onClick={this.generateReport}>Generar reporte de productos</button>
        <Link to="/providersreport">Proveedores</Link>
      </div>
    );
  }
}