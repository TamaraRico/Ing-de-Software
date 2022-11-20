import React from "react";
// import "./inventario.css";
import Button from "@mui/material/Button";

function getInventory() {
  return new Promise((resolve, reject) => {

    window.api.send('products:findAllProducts');

    window.api.receive("products:getAllProducts", (data) => {
      resolve(data);
    });
  });
}

class Inventory extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      products : []
    };

    this.fetchInventory = this.fetchInventory.bind(this);
  }

  fetchInventory() {
    getInventory().then((data) => {
      if (data !== "null") {
        const dataInventory = JSON.parse(data);

        var newProducts = this.state.products.concat(dataInventory)
        this.setState({
          products : newProducts
        });
      } else {
        throw console.error("no hay productos en la base de datos", this.state.products);
      }
    });
  }

  componentDidMount(){
    this.fetchInventory();
  }
  
  render() {
    return (
      <div className="App">
        <h3>Inventario</h3>
        <table>
          <thead>
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
          </thead>
          <tbody>
            {this.state.products.map((val, key) => (
                  <tr productId = {key}>
                    <td>{val._id}</td>
                    <td>{val.barcode}</td>
                    <td>{val.category}</td>
                    <td>{val.name}</td>
                    <td>{val.quantity}</td>
                    <td>{val.priceUnit}</td>
                    <td>{val.price}</td>
                    <td>{val.manufacture}</td>
                    <td>{val.lastPurchase}</td>
                    <td>{val.providerCode}</td>
                  </tr>
              ))}
          </tbody>
        </table>
        <ReturnButton />
      </div>
    );
  }
}

class ReturnButton extends React.Component {
  validate() {
    window.location.pathname = "/pos";
  }

  render() {
    return (
      <Button variant="contained" onClick={this.validate}>
        Regresar
      </Button>
    );
  }
}

export default Inventory;
