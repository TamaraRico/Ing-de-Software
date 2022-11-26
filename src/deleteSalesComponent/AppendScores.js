
import CreateSalesTable from "./CreateSalesTable";

import {global_variables} from './index';

function AppendScores(element) {
    global_variables.elements++
    const table = document.querySelector('.table')
    let tableBodyRow = document.createElement('tr')
    tableBodyRow.className = 'tableBodyRow'
  
    let ID = document.createElement('td')
    ID.innerText = element['_id']
  
    let employee = document.createElement('td')
    employee.innerText = element['employee']
  
    let date = document.createElement('td')
    date.innerText = element['factured_date'].toLocaleDateString("es-ES")
  
    let products = document.createElement('td')
    products.innerText = Object.keys(element['purchased_products']).length
    
    let total = document.createElement('td')
    total.innerText = element['total']
  
    let button_td = document.createElement('td')
    var button = document.createElement('input')
    button.type = "button";
    button.id = "button_"+((global_variables.pageSize*(global_variables.pagina_actual-1))+global_variables.elements);
    
    button.className = 0;
    button.className = element['_id'];
    button.value = "Eliminar";
    button.onclick = (function() {
      console.log("onclick "+button.className)
      var answer = window.confirm("Eliminar registro "+button.id.split('_')[1]+"?");
      if (answer) {
        window.api.send('sale:delete', button.className);
  
        window.api.send('sales:fetch');
        window.api.receive('sales:fetch',  async (data) => {
          console.log("Deleted!");
          CreateSalesTable()
          global_variables.data_size = data.length
          global_variables.global_data = data
          global_variables.pagina_actual = 1
          for (let i = 0; i < global_variables.pageSize;i++){
            AppendScores(data[i])
          }
        });
      }
    });
    button_td.appendChild(button)
    tableBodyRow.append(ID, employee, date, products, total, button_td)
    table.append(tableBodyRow)
}
export default AppendScores;