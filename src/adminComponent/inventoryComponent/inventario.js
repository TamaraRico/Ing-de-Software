import React from "react";
import Menu from "../menuComponent/menu"
import AddProduct from '../addProductComponent/addProduct';
import EditProduct from '../editProductComponent/editProduct';
import DeleteProduct from '../deleteProductComponent/deleteProduct';
import { Grid } from "@mui/material";
import {StickyTable} from "./inventoryTable";

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
        }, () => {
          console.log("Datos desde inventario.js: ", this.state.products)
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
      <div className="view-container">
        <Menu />
        <div id="main">
          <h1>INVENTARIO</h1>
          <h7><b>INICIO/</b>Inventario</h7>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div class="card">
                <table align="center">
                  <tr align="center">
                    <td align="center"><AddProduct /></td>
                    <td align="center"><EditProduct /></td>
                    <td align="center"><DeleteProduct /></td>
                  </tr>
                </table>
              </div>
            </Grid>
            <Grid item xs={12} md={12}>
              <div class="card">
                {this.state.products.length > 0 ? <StickyTable data={this.state.products}/> : null}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Inventory;