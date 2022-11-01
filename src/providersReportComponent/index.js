import React from "react";
import { Link } from "react-router-dom";
import xlsx from 'json-as-xlsx'; //npm install json-as-xlsx
import './styles.css'; //Solo pa centrar el boton
export default class ProvidersReport extends React.Component {
    generateReport(){
        window.api.send('providers:fetch');
        window.api.receive('providers:fetch', (data) => {
          let document = []
          let productos_sheet = {
            sheet: "Proveedores",
            columns: [
              {label: "code", value: "code"},
              {label: "name", value: "name"},
              {label: "RFC", value: "RFC"}
            ],
            //Contenido vacio para rellenarlo con el json de datos
            content: [
    
            ]
          }
          for (let a in data){
            var obj = data[a];
            var aux = productos_sheet
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
                aux['content'].push(new_content)
              }
            }
          }
          document[0] = productos_sheet
          //Nombre de xlsx sujeto a cambios
          var file_name = "providers_report_" + new Date().toJSON().slice(0,10).replace(/-/g,'/')
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
        <button onClick={this.generateReport}>Generar reporte de proveedores</button>
        <Link to="/">Productos</Link>
      </div>
    );
  }
}