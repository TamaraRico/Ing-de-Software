import React from "react";
import './inventario.css';
import Button from '@mui/material/Button';

function getInventory() {
  return new Promise((resolve, reject) => {
    window.api.send('product:findAllProducts');
    window.api.receive('product:getAllProducts', (data) => {
      resolve(data);
    });
  });
}

class Inventory extends React.Component {
   fetchInventory(){
      getInventory().then((data) => {
        if (data !== "null") {
          const dataInventory = JSON.parse(data);
           return dataInventory;
/*           const a = dataInventory
          const p = {
            barcode: product.barcode,
            name: product.name,
            category: product.category,
            quantity: 1,
            inventory: product.quantity,
            price: product.priceUnit, 
          };*/
        } else{
          throw console.error("no hay productos en la base de datos");
        }
   })
  }
    render() {
    return(
        <div className="App">
         <h3>Inventario</h3>
         <table>
          <tr>
            <th>id</th>
            <th>Codigo de Barras</th>
            <th>Categoria</th>
            <th>Nombre</th>
            <th>Cantidad en almacen</th>
            <th>Precio unitario</th>
            <th>Precio de venta</th>
            <th>Manufactura</th>
            <th>Última compra</th>
            <th>Proveedor</th>
          </tr>
          {this.fetchInventory().map((val, key) => {
            return (
              <tr key={key}>
                <td>{val._id}</td>
                <td>{val.barcode}</td>
                <td>{val.category}</td>
                <td>{val.name}</td>
                <td>{val.quantity}</td>
                <td>{val.priceUnity}</td>
                <td>{val.priceUnity}</td>
                <td>{val.manufacture}</td>
                <td>{val.lastPurchase}</td>
                <td>{val.providerCode}</td>
              </tr>
            )
          })}
        </table> 
        <ReturnButton/> 
      </div>
    );
  }
}

class ReturnButton extends React.Component{
  validate(){
    window.location.pathname = "/admin";
  }

  render(){
    return(<Button 
            variant="contained"
            onClick={this.validate}>
            Regresar
            </Button>
    )
  }
}

export default Inventory;