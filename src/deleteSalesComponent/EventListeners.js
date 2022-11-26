import { DateRangePicker } from 'vanillajs-datepicker';
import CreateSalesTable from "./CreateSalesTable";
import AppendScores from "./AppendScores";
import {global_variables} from './index';

function EventListeners() {
    //Componentes con eventos
    const submit = document.getElementById('submit');
    const deletebtn = document.getElementById('delete');
    const elem = document.getElementById('calendar');
    const prevbtn = document.getElementById('prevButton');
    const nextbtn = document.getElementById('nextButton');
    const rangepicker = new DateRangePicker(elem, {
      clearBtn: true,
    }); 
    //--------------Click event listeners----------------
    submit.addEventListener('click', function(){
        console.log(global_variables)
      if(typeof(rangepicker.getDates('yyyy-mm-dd')[0]) === "undefined" || typeof(rangepicker.getDates('yyyy-mm-dd')[1]) === "undefined"){ 
        deletebtn.disabled = true
        console.log("waiting for 2 dates:" + elem[0])
        //Si no hay fechas se consultan todas las ventas
        window.api.send('sales:fetch');
        window.api.receive('sales:fetch',  async (data) => {
          CreateSalesTable()
          global_variables.data_size = data.length
          global_variables.global_data = data
          console.log(data)
          for (let i = 0; i < global_variables.pageSize;i++){
            AppendScores(data[i])
          }
        });
      }
      else{
        let start = rangepicker.getDates()[0]
        let end = rangepicker.getDates()[1]
        end.setDate(end.getDate() + 1); //Se suma 1 dia para buscar ventas dentro del mismo dia en caso de necesitarlo

        window.api.send('sales_by_date:fetch', start, end);
        window.api.receive('sales_by_date:fetch',  async (data) => {
          if(data.length === 0){ //No hay ventas en las fechas solicitadas
            const container = document.querySelector("div.container")
            while (container.firstChild) container.removeChild(container.firstChild)
            let msg = document.createElement('p')
            msg.innerHTML = 'No hay registros entre estas fechas'
            container.appendChild(msg);
            deletebtn.disabled = true
          }
          else{
            deletebtn.disabled = false
            global_variables.sales_by_date = []
            CreateSalesTable()
            global_variables.data_size = data.length
            global_variables.global_data = data
            for (let i in data){
                global_variables.sales_by_date[i] = data[i]._id
            }
            console.log(global_variables.sales_by_date)
            for (let i = 0; i < global_variables.pageSize;i++){
              AppendScores(data[i])
            }
          }
  
        });
      }
    });
    deletebtn.addEventListener('click', function(){
      var answer = window.confirm("Desea eliminar ventas entre las fechas " + rangepicker.getDates('yyyy-mm-dd')[0] + " a " + rangepicker.getDates('yyyy-mm-dd')[1] + "?");
      if (answer) {
        console.log("DELETE BUTTON:"+global_variables.sales_by_date)
        window.api.send('sales_by_date:delete', global_variables.sales_by_date);
        window.api.send('sales:fetch');
        window.api.receive('sales:fetch',  async (data) => {
          CreateSalesTable()
          global_variables.data_size = data.length
          global_variables.global_data = data
          console.log(data)
          for (let i = 0; i < global_variables.pageSize;i++){
            AppendScores(data[i])
          }
        });
      }
  
    });
  
    prevbtn.addEventListener('click', function(){
      if(global_variables.pagina_actual > 1){ 
        global_variables.pagina_actual--;
        console.log("prevbtn:"+global_variables.pagina_actual)
        CreateSalesTable()
        let start = ((global_variables.pagina_actual) * global_variables.pageSize) - global_variables.pageSize
        for (let i = start; i < ((global_variables.pagina_actual-1) * global_variables.pageSize) + global_variables.pageSize;i++){
          console.log("Element displayed:"+i)
          if(typeof(global_variables.global_data[i]) !== "undefined")
            AppendScores(global_variables.global_data[i]);
        }
      
      }
  
    });
    nextbtn.addEventListener('click', function(){
      if((global_variables.pagina_actual * global_variables.pageSize) < global_variables.data_size){ 
        
        global_variables.pagina_actual++;
        
        CreateSalesTable()
        for (let i = ((global_variables.pagina_actual-1) * global_variables.pageSize); i < ((global_variables.pagina_actual-1) * global_variables.pageSize) + global_variables.pageSize;i++){
          console.log("Element displayed:"+i)
          if(typeof(global_variables.global_data[i]) !== "undefined")
            AppendScores(global_variables.global_data[i])
        }
      
      }
  
    });
}
export default EventListeners;