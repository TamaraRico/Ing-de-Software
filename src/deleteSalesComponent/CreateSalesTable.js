import React from "react";
import {global_variables} from './index';
function CreateSalesTable() {
    const container = document.querySelector("div.container")
    let tableHeaders = ["ID", "Employee", "Date", "# Products", "Total", '']
  
  
    while (container.firstChild) container.removeChild(container.firstChild)
    global_variables.elements = 0
    let table = document.createElement('table')
    table.className = 'table'
    let tableHead = document.createElement('thead')
    tableHead.className = 'tableHead'
    let tableHeaderRow = document.createElement('tr')
    tableHeaderRow.className = 'tableHeaderRow'
    tableHeaders.forEach(header => {
      let tableHeader = document.createElement('th')
      tableHeader.innerText = header
      tableHeaderRow.append(tableHeader)
    })
    tableHead.append(tableHeaderRow)
    table.append(tableHead)
    let tableBody = document.createElement('tbody')
    tableBody.className = "tableBody"
    table.append(tableBody)
    container.append(table)
}
export default CreateSalesTable;