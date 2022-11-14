import React from "react";
import './inventario.css';
import Button from '@mui/material/Button';

var dataInventory = null

class Inventory extends React.Component {
    getInventory(){
        window.api.send('product:findAllProducts');
        window.api.receive('product:getAllProducts', (data) => {
            dataInventory = JSON.parse(data);
            return dataInventory;
        });
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
          {this.getInventory().map((val, key) => {
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