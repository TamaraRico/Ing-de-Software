import React from "react";
import { Link } from "react-router-dom";
import { DateRangePicker } from 'vanillajs-datepicker';
import CreateSalesTable from "./CreateSalesTable";
import AppendScores from "./AppendScores";
import EventListeners from "./EventListeners";
//npm install vanillajs-datepicker


/*
Comentario by Irvin:
  Factorizar que esto esta horrible ayuda me siento raro

--------------COMPONENTE NO TERMINADO HASTA CHECAR BUGS xd-----------------
Separar las funciones abajo de la clase DeleteSales en otro archivo pa que no
quede todo horrible, no lo hize por las variables globales xd
*/

export var global_variables = {
  elements: 0,
  sales_by_date:[],
  pageSize: 10,
  pagina_actual: 1,
  data_size: 0,
  global_data: 0,
}

export default class DeleteSales extends React.Component {
  create(){
    EventListeners()
    window.api.send('sales:fetch');
    window.api.receive('sales:fetch',  async (data) => {
      CreateSalesTable()
      global_variables.data_size = data.length
      global_variables.global_data = data
      for (let i = 0; i < global_variables.pageSize;i++){
        AppendScores(data[i])
      }
    });
  }
  
  render(){
    return(
        <>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vanillajs-datepicker@1.2.0/dist/css/datepicker.min.css"/>
          <div id="calendar">
            <input type="text" name="start"/>
            <span>to</span>
            <input type="text" name="end"/>  
          </div>
          <button id = 'submit'>Buscar ventas</button>
          <button id = 'delete' disabled = 'true'>Eliminar ventas</button>
          <div class = "container">
            <img onLoad={this.create} src='https://i.postimg.cc/6qgNvkjc/pincelin-logo.png' alt = 'logo'/>
            <p>Loading...</p>
          </div>
          <button id="prevButton">Previous</button> 
          <button id="nextButton">Next</button> 
          <hr/>
          <Link to="/admin">Regresar</Link>
        </>


    );
  }
}



