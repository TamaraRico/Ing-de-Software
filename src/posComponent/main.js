import React from "react";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
import swal from 'sweetalert';
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";
import Modal from './modal'
import './style.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {faDeleteLeft}  from "@fortawesome/free-solid-svg-icons";


library.add(faDeleteLeft);

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

function calculateChange(userC, type, total){
    let final = 0
    if(type == 0){
        //PAGO EN PESOS MEXICANOS
        final = parseInt(userC) - parseInt(total)
    }else{
        //PAGO EN DOLARES

        //CAMBIO EN PESOS MEXICANOS
        final = parseFloat(userC) - parseFloat(total)
        final = parseFloat(final) * parseFloat(19.25)
    }
    
    return final
}

function sellLoop(recibido){
	return new Promise( resolve => {
		window.recibidoTotal = parseInt(window.recibidoTotal) + parseInt(recibido)
		console.log("Cantidad recibida: ", recibido)
		console.log("Cantidad total: ", window.recibidoTotal)
		Swal.fire({
			title: 'COMPRA',
		  	icon: 'success',
		  	html:'<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input priceType" value="0" id="mxnPay" name="mailId[]"><label class="custom-control-label" for="mxnPay">MXN $' + Math.abs(window.change) + '</label></div> <div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input priceType" value="1" name="mailId[]" id="dllsPay"><label class="custom-control-label" for="dllsPay">DLLS $' + Math.abs(window.change) / 19.25 + '</label></div>' +
			  	'<br><div class="md-form md-outline"><input type="text" id="totalPrice" class="form-control totalPrice"><label for="totalPrice">Cantidad recibida</label></div>' +
			  	'<br>',
		  	showCancelButton: true,
		  	confirmButtonText: 'PAGAR',
		  	allowEnterKey: true,
		  	preConfirm: function(){
				var clientTotal = parseInt(Swal.getPopup().querySelector('#totalPrice').value)
				var checked = parseInt(Swal.getPopup().querySelector('.priceType:checked').value)
			  	return new Promise(function(resolve){
					resolve([
						clientTotal, checked
				  	])
			  	})
		  	},
		}).then( result => {
			if(result.value[0]){
				if(result.value[1] == 0){
					window.change = calculateChange(result.value[0], 0, Math.abs(window.change))
					if(window.change < 0){
						resolve(sellLoop(result.value[0]))
					}
					if(window.change > 0 || window.change == 0){
						window.recibidoTotal = parseInt(window.recibidoTotal) + parseInt(result.value[0])
						resolve(window.recibidoTotal)
					}
				}else if(result.value[1] == 1){
					window.change = calculateChange(result.value[0], 1, (Math.abs(window.change) / 19.25))
					if(window.change < 0){
						resolve(sellLoop(result.value[0]))
					}
					if(window.change > 0 || window.change == 0){
						window.recibidoTotal = parseInt(result.recibidoTotal) + parseInt(result.value[0]) * 19.25
						resolve(window.recibidoTotal)
					}
				}else{
					Swal.fire('Cancelado', 'No especifico la moneda con la que se pago', 'error')
					resolve(sellLoop(result.value[0]))
				}
			}else{
				Swal.fire('Error', 'Cantidad no ingresada', 'error')
				resolve(sellLoop(0))
			}
		})
	})
}

class POS extends React.Component {
  render() {
    return (
        <div>
			<Grid container spacing={2}>
                    <Grid item xs={4} md={3}>
						<InternalActions />
						<SellsActions />
                    </Grid> 
                    <Grid item xs={8} md={9}>
						<PermissionsComponent/>
						<ProductsComponent />
                    </Grid> 
                </Grid>
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
    this.addSellToDB = this.addSellToDB.bind(this)
  }

  addNewProduct(product) {
    /*
        TO ADD A NEW PRODUCT WE NEED TO CHECK:
        -> VERIFY THAT THE PRODUCT TO ADD DOESN'T EXIST IN THE CURRENT ARRAY
        */

    //CHECK IF PRODUCT ALREADY EXISTS
    const index = isInProductArray(this.state.products, product.barcode);
    if (index != -1) {
      if (calculateQuantityToSellInProduct(product.quantity, product.inventory) != -1) {
        this.state.products[index].quantity += 1;
		this.state.total += product.price;
			var updatedProducts = this.state.products;
			var total = this.state.total;
			this.setState((state) => ({
				products: updatedProducts,
				total: total,
			}),() => {
				if(product.hasDiscount){
					this.state.products[index+1].quantity += 1;
					this.state.total += this.state.products[index+1].price;
					var updatedProducts = this.state.products;
					var total = this.state.total;
					this.setState((state) => ({
						products : updatedProducts,
						total : total,
					}), () => {
						console.log("Updated")
					})
				}
			});
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
		console.log(product)
        //THIS IS WORKING TO ADD A NEW PRODUCT TO THE ARRAY
        var newProducts = this.state.products.concat([product]);

		this.setState((state) => ({
			  products: newProducts,
			  total: state.total + product.price,
			}),() => {
				if(product.hasDiscount){
					var discountedP = {
						barcode: product.barcode + "-1",
						name: "Descuento",
						category: product.category,
						quantity: 1,
						inventory: product.quantity,
						price: - parseFloat((product.price * product.discountPercent / 100)).toFixed(2),
						hasDiscount : product.hasDiscount,
						discountPercent : product.discountPercent
					}
					var newProducts = this.state.products.concat([discountedP]);
					this.setState((state) => ({
						products: newProducts,
						total: state.total + discountedP.price,
						}),() => {
						console.log("States updated: ");
					});	
				}
		});
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
			hasDiscount : product.hasDiscount,
			discountPercent : product.discountPercent
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
	console.log(e)
    let id = parseInt(e.target.parentNode.parentNode.parentNode.getAttribute("productId"));
    var total = this.state.total - this.state.products[id].price * this.state.products[id].quantity;
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
    Swal.fire({
		title: 'COMPRA',
      icon: 'success',
      html:'<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input priceType" value="0" id="mxnPay" name="mailId[]"><label class="custom-control-label" for="mxnPay">MXN $' + this.state.total + '</label></div> <div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input priceType" value="1" name="mailId[]" id="dllsPay"><label class="custom-control-label" for="dllsPay">DLLS $' + this.state.total / 19.25 + '</label></div>' +
          '<br><div class="md-form md-outline"><input type="text" id="totalPrice" class="form-control totalPrice"><label for="totalPrice">Cantidad recibida</label></div>' +
          '<br>',
      showCancelButton: true,
      confirmButtonText: 'PAGAR',
      allowEnterKey: true,
      preConfirm: function(){
		var clientTotal = parseInt(Swal.getPopup().querySelector('#totalPrice').value)
		var checked = parseInt(Swal.getPopup().querySelector('.priceType:checked').value)
          return new Promise(function(resolve){
              resolve([
				clientTotal, checked
              ])
          })
      },
    }).then((result) => {
		if(result.isConfirmed){
			if(result.value[0]){
				window.recibidoTotal = 0
				if(result.value[1] == 0){
					//MXN
					window.change = calculateChange(result.value[0], 0, this.state.total)
					console.log(window.change)
					if(window.change < 0){
						sellLoop(result.value[0]).then( promise => {
							Swal.fire({
								title: 'Compra exitosa',
								text: 'Cambio: MXN $' + window.change.toFixed(2).toString(),
								timer: 4000,
								icon: 'success'
							})
							this.addSellToDB()
							//GENERATE INVOICE
						})
					}else{
						Swal.fire({
							title: 'Compra exitosa',
							text: 'Cambio: MXN $' + window.change.toFixed(2).toString(),
							timer: 4000,
							icon: 'success'
						})
						this.addSellToDB()
						//GENERATE INVOICE
					}
				}else{
					//DLLS
					window.change = calculateChange(result.value[0], 1, this.state.total)
					if(window.change < 0){
						sellLoop().then( promise => {
							Swal.fire({
								title: 'Compra exitosa',
								text: 'Cambio: MXN $' + window.change.toFixed(2).toString(),
								icon: 'success',
							})
							this.addSellToDB()
							//GENERATE INVOICE
						})
					}else{
						Swal.fire({
							title: 'Compra exitosa',
							text: 'Cambio: MXN $' + window.change.toFixed(2).toString(),
							icon: 'success',
						})
						this.addSellToDB()
						//GENERATE INVOICE
					}
				}
			}else{
				Swal.fire('Error', 'Cantidad no ingresada', 'error')
			}
		}else{
			Swal.fire('Cancelado', 'Se cancelo la transaccion', 'error');
		}
	})
  }

  addSellToDB(){
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
          this.setState({products: [],total: 0,}) //Clear total n products
        }
      });
    }
  }

  render() {
    return (
      <div className="productsComponent">
		<h2>VENTA AL CLIENTE</h2>
        <TextField fullWidth
          id="barcode_tosubtotal"
          label="Codigo de barras"
          variant="filled"
          onKeyDown={this.handleChangeInput}
        ></TextField>
        <table id="products">
          <thead>
            <tr>
              <th>CODIGO DE BARRAS</th>
              <th>NOMBRE DE PRODUCTO</th>
              <th>PRECIO UNITARIO</th>
              <th>CANTIDAD</th>
            </tr>
          </thead>
          <tbody>
            {this.state.products.map((product, index) => (
              <tr productId={index}>
                <td id>{product.barcode}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td onClick={this.handleEditProduct}>{product.quantity}&nbsp;<FontAwesomeIcon id="delete-icon" icon="delete-left"/></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <table>
            <tr>
              <td>
                <h1 id="total">TOTAL A PAGAR: $ <b>{this.state.total + " MXN"}</b></h1>
                <h3><b>{(this.state.total / 19.25).toFixed(2) + " DLLS"}</b></h3>
              </td>
              <td>
                <Button variant="contained" onClick={this.handleTotalSell}>FINALIZA COMPRA</Button>
              </td>
            </tr>
          </table>
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
  logout(){
    window.api.send('user:load', localStorage.getItem('usuario'));
    window.api.receive('user:get', (logged_employee) => {
      const data = JSON.parse(logged_employee);
      let checkout = new Date()
      let salida = new Date(new Date(data.salida).toISOString())

      let salida_min = new Date(salida.getTime() - 10*60000)
      let salida_max = new Date(salida.getTime() + 10*60000)

      //10 minutos de tolerancia antes y despues de terminar la jornada
      if(checkout >= salida_min && checkout <= salida_max){
        swal({
          title: 'Nos vemos!',
          text: "Check out correcto: "+checkout.getHours()+":"+checkout.getMinutes(),
          icon: 'success',
          confirmButtonText: 'Aceptar',
        })
        .then((aceptar) =>{
          if(aceptar){
            window.api.send('users:checkout', data._id, checkout)
            window.location.pathname = '/'
          }
        })
      }
      //Si hace checkout dentro del horario laboral jaja
      if(checkout <= salida_min){
        swal({
          title: 'Confirmacion',
          text: "Si hace checkout no podra entrar otra vez por hoy",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((aceptar) =>{
          if(aceptar){
            swal({
              title: 'Nos vemos!',
              text: "Check out correcto: "+checkout.getHours()+":"+checkout.getMinutes(),
              icon: 'success',
              confirmButtonText: 'Aceptar',
            })
            .then((aceptar) =>{
              if(aceptar){
                window.api.send('users:checkout', data._id, checkout)
                window.location.pathname = '/'
              }
            })

          }
        })
      }
      if(checkout >= salida_max){
        swal({
          title: 'Nos vemos!',
          text: "Check out fuera de horario laboral: "+checkout.getHours()+":"+checkout.getMinutes(),
          icon: 'warning',
          confirmButtonText: 'Aceptar',
        })
        .then((aceptar) =>{
          if(aceptar){
            window.api.send('users:checkout', data._id, checkout)
            window.location.pathname = '/'
          }
        })
      }
    });




    //window.location.pathname = "/"
  }
  render(){
      return (
        <div className="internalActions">
    <h2>ACCIONES INTERNAS</h2>
          <Button>Movimiento Interno</Button>
          <Button>Corte de caja en X</Button>
          <Button>Corte de caja en Z</Button>
          <Button onClick={this.logout}>Check out</Button>
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
				<h2>ACCIONES DE VENTA</h2>
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
          <div className="permissionsComponent">
              <Button variant="contained" onClick={this.toogle} margin="dense">Actualizar inventario</Button>
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