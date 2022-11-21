import React from "react";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";
import { Link } from 'react-router-dom';
import Modal from './modal'

function getProduct(barcode){
    return new Promise((resolve, reject) => {
        window.api.send('product:getByBarcode', barcode);
        
        window.api.receive('product:getOne', (data) => {
            resolve(data);
        });
    })
}

function isInProductArray(array, barcode) {
  var p_index = -1;
  array.map((product, index) => {
    if (product.barcode == barcode) {
      p_index = index;
    }
  });

  return p_index;
}

function calculateQuantityToSellInProduct(productQuantity, inventoryQuantity) {
  var safe_update = 0;
  if (inventoryQuantity - productQuantity < 5) {
    Swal.fire({
      title: "Advertencia",
      text:
        "Producto proximo a quedar sin inventario - Restantes" +
        (inventoryQuantity - productQuantity),
      icon: "warning",
    });
  }

  if (productQuantity > inventoryQuantity) {
    Swal.fire({
      title: "Error",
      text: "Venta de producto excede cantidad de inventario",
      icon: "error",
    });

    safe_update = -1;
  }

  return safe_update;
}

class POS extends React.Component {
  render() {
    return (
        <div>
            <PermissionsComponent/>
            <InternalActions />
            <SellsActions />
            <ProductsComponent />
        </div>
    );
  }
}

//CLASS TO HANDLE THE RETRIEVING PRODUCTS FROM THE BARCODE
class ProductsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      total: 0,
    };
    this.addNewProduct = this.addNewProduct.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleEditProduct = this.handleEditProduct.bind(this);
    this.handleTotalSell = this.handleTotalSell.bind(this)
  }

  addNewProduct(product) {
    /*
        TO ADD A NEW PRODUCT WE NEED TO CHECK:
        -> VERIFY THAT THE PRODUCT TO ADD DOESN'T EXIST IN THE CURRENT ARRAY
        */

    //CHECK IF PRODUCT ALREADY EXISTS
    const index = isInProductArray(this.state.products, product.barcode);
    if (index != -1) {
      if (
        calculateQuantityToSellInProduct(product.quantity, product.inventory) !=
        -1
      ) {
        this.state.products[index].quantity += 1;
        this.state.total += product.price;

        var updatedProducts = this.state.products;
        var total = this.state.total;
        this.setState(
          (state) => ({
            products: updatedProducts,
            total: total,
          }),
          () => {
            console.log("States updated");
          }
        );
      }
    } else {
      if (product.inventory == 0) {
        Swal.fire({
          title: "Error",
          text: "No hay en inventario",
          icon: "error",
        });
      } else {
        if (product.inventory < 5) {
          Swal.fire({
            title: "Advertencia",
            text:
              "Producto proximo a quedar sin inventario - Restantes: " +
              (product.inventory - 1),
            icon: "warning",
          });
        }

        //THIS IS WORKING TO ADD A NEW PRODUCT TO THE ARRAY
        var newProducts = this.state.products.concat([product]);
        this.setState(
          (state) => ({
            products: newProducts,
            total: state.total + product.price,
          }),
          () => {
            console.log("States updated: ");
          }
        );
      }
    }
  }

  handleChangeInput(e) {
    if (e.keyCode === 13 || e.key === "Enter") {
      e.preventDefault();
      getProduct(e.target.value).then((data) => {
        if (data !== "null") {
          const product = JSON.parse(data);
          const p = {
            barcode: product.barcode,
            name: product.name,
            category: product.category,
            quantity: 1,
            inventory: product.quantity,
            price: product.priceUnit,
          };
          this.addNewProduct(p);
        } else {
          Swal.fire({
            title: "Error!",
            text: "Producto no encontrado",
            icon: "error",
            timer: 2000,
          });
        }
      });
    }
  }

  handleEditProduct(e) {
    let id = parseInt(e.target.parentNode.getAttribute("productId"));
    var total =
      this.state.total -
      this.state.products[id].price * this.state.products[id].quantity;
    this.state.products.splice(id, 1);
    this.setState(
      (state) => ({
        products: this.state.products,
        total: total,
      }),
      () => {
        console.log("States updated");
      }
    );
  }

  handleTotalSell(e){
    //DEVELOPED BY IRVIN - ADDED BY ADRIAN
    if(this.state.products.length !== 0){
      let fecha = new Date(new Date().toISOString());
      let empleado = localStorage.getItem('usuario')
      let productos = []
      var categories = {};
      this.state.products.forEach( function(json, indice, array) {
        var category = json.category;
        if (!(category in categories)){ categories[category] = [];}
        json = {
          barcode: json.barcode,
          quantity: json.quantity
        }
        categories[category].push(json);
      });
      for (let i in categories){
        let aux = {
          category: i,
          products: categories[i]
        }
        productos.push(aux)
      }
      var venta = {
        factured_date: fecha,
        employee: empleado,
        purchased_products: productos,
        total: this.state.total
      }
      window.api.send('sales:insert', venta);
      window.api.receive('sales:insert',  async (confirmacion) => {
        if(confirmacion){
          Swal.fire({
            title: 'Venta guardada',
            text: 'Venta guardada en la BDD',
            icon: 'success',
            confirmButtonText: 'Cerrar'
          })
          this.setState({products: [],total: 0,}) //Clear total n products
        }
        else{
          Swal.fire({
            title: 'Error!',
            text: 'No se pudo guardar la venta :(',
            icon: 'error',
            confirmButtonText: 'Cerrar'
          })
        }
      });
    }

  }

  render() {
    return (
      <div className="productsComponent">
        <TextField
          id="barcode_tosubtotal"
          label="Codigo de barras"
          variant="outlined"
          onKeyDown={this.handleChangeInput}
        ></TextField>
        <Link to="/">Regresar a login</Link>
        <table>
          <thead>
            <tr>
              <th>CODIGO DE BARRAS</th>
              <th>NOMBRE DE PRODUCTO</th>
              <th>PRECIO UNITARIO</th>
              <th>CANTIDAD</th>
              <th>MODIFICACION</th>
            </tr>
          </thead>
          <tbody>
            {this.state.products.map((product, index) => (
              <tr productId={index}>
                <td id>{product.barcode}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td onClick={this.handleEditProduct}>Borrar</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <h1>TOTAL A PAGAR: $<b>{this.state.total}</b></h1>
          <Button variant="contained" onClick={this.handleTotalSell}>FINALIZA COMPRA </Button>
        </div>
      </div>
    );
  }
}

/*
CLASS TO HANDLE INTERNAL ACTIONS
    -> MOVIMIENTO INTERNO
    -> CORTE DE CAJA EN X
    -> CORTE DE CAJA EN Z
*/
class InternalActions extends React.Component {
    render(){
        return (
          <div className="sellActions">
          <Button>Movimiento Interno</Button>
          <Button>Corte de caja en X</Button>
          <Button>Corte de caja en Z</Button>
          </div>
        );
    }
}

/*
CLASS TO HANDLE SELLS ACTIONS
    -> APLICAR DESCUENTO
    -> APLICAR DEVOLUCION
*/
class SellsActions extends React.Component {
    render(){
        return(
            <div className="sellActions">
                <Button>Aplicar descuento</Button>
                <Button>Aplicar devolucion</Button>
            </div>
        );
    }
}

class PermissionsComponent extends React.Component{

  state = {
      active: false,
  }

  toogle = () =>{
      this.setState({active: !this.state.active});
  }

  render(){
    
      return(
          <div>
              <Button variant="contained" onClick={this.toogle} margin="dense">Pedir permisos</Button>
              <div>
                <Modal active ={this.state.active} toogle = {this.toogle}>
                    <div>
                        Ingrese Usuario Administrador
                    </div>
                </Modal>
                
              </div>
          </div>
      );   
  }
}

export default POS;