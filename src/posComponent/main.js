import React from 'react';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2'


function getProduct(barcode){
    return new Promise((resolve, reject) => {
        window.api.send('product:getByBarcode', barcode);
        
        window.api.receive('product:getOne', (data) => {
            resolve(data);
        });
    })
}

function isInProductArray(array, barcode){
    var p_index = -1;
    array.map((product, index) => {
        if(product.barcode == barcode){
            p_index = index;
        }
    })

    return p_index;
}

function calculateQuantityToSellInProduct(productQuantity, inventoryQuantity){
    var safe_update = 0;
    if((inventoryQuantity - productQuantity) < 5){
        Swal.fire({
            title : "Advertencia",
            text : "Producto proximo a quedar sin inventario - Restantes" + (inventoryQuantity - productQuantity),
            icon : 'warning', 
        })
    }

    if(productQuantity > inventoryQuantity){
        Swal.fire({
            title : "Error",
            text: "Venta de producto excede cantidad de inventario",
            icon : 'error'
        })

        safe_update = -1;
    }

    return safe_update;
}

//IF WE WANT TO GO TO ANOTHER PAGE, WE USE LINK
//import { Link } from 'react-router-dom';

class POS extends React.Component {
    render(){
        return (
            <ProductsComponent />
        );
    }
}

//CLASS TO HANDLE THE RETRIEVING PRODUCTS FROM THE BARCODE
class ProductsComponent extends React.Component{    
    constructor(props){
        super(props);
        this.state = {
            products : [], 
            total: 0
        };
        this.addNewProduct = this.addNewProduct.bind(this)
        this.handleChangeInput = this.handleChangeInput.bind(this)
    }

    addNewProduct(product){
        /*
        TO ADD A NEW PRODUCT WE NEED TO CHECK:
        -> VERIFY THAT THE PRODUCT TO ADD DOESN'T EXIST IN THE CURRENT ARRAY
        */

        //CHECK IF PRODUCT ALREADY EXISTS
        const index = isInProductArray(this.state.products, product.barcode)
        if(index != -1){
            if(calculateQuantityToSellInProduct(product.quantity, product.inventory) != -1){
                this.state.products[index].quantity += 1;
                this.state.total += product.price

                var updatedProducts = this.state.products
                var total = this.state.total
                this.setState(state => ({
                    products: updatedProducts,
                    total: total
                }), () => {
                    console.log("States updated")
                })
            }
        }else{
            if(product.inventory == 0){
                Swal.fire({
                    title: "Error",
                    text: "No hay en inventario",
                    icon : 'error'
                })
            }else{
                if(product.inventory < 5){
                    Swal.fire({
                        title: "Advertencia",
                        text: "Producto proximo a quedar sin inventario - Restantes: " + (product.inventory - 1),
                        icon: 'warning'
                    })
                }

                //THIS IS WORKING TO ADD A NEW PRODUCT TO THE ARRAY
                var newProducts = this.state.products.concat([product])
                this.setState( state => ({
                    products : newProducts,
                    total : state.total + product.price
                }), () => {
                    console.log("States updated: ")
                })
            }
        }
    }

    handleChangeInput(e){
        if(e.keyCode === 13 || e.key === 'Enter'){
            e.preventDefault();
            getProduct(e.target.value).then((data) => {
                if(data !== 'null'){
                    const product = JSON.parse(data);
                    const p = {
                        barcode: product.barcode,
                        name: product.name,
                        category: product.category,
                        quantity: 1,
                        inventory: product.quantity,
                        price: product.priceUnit
                    };
                    this.addNewProduct(p);
                }
                else{
                    Swal.fire({
                        title: 'Error!',
                        text: 'Producto no encontrado',
                        icon: 'error',
                        timer: 2000
                    })
                }
            })
        }
    }

    render(){
        return (
            <div className='productsHeader'>
                <TextField 
                    id="barcode_tosubtotal" 
                    label="Codigo de barras" 
                    variant="outlined"
                    onKeyDown={this.handleChangeInput}>
                </TextField>
                <table>
                    <thead>
                        <th>CODIGO DE BARRAS</th>
                        <th>NOMBRE DE PRODUCTO</th>
                        <th>PRECIO UNITARIO</th>
                        <th>CANTIDAD</th>
                    </thead>
                    <tbody>
                        <ProductsList products={this.state.products}/>
                        <TotalComponent total = {this.state.total} />
                    </tbody>
                </table>
            </div>
        );
    }
}

class ProductsList extends React.Component {
    render(){
        return(
            this.props.products.map((product, index) => (
                <tr key = {index}>
                    <td>{product.barcode}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                </tr>
            ))
        )
    }
}

class TotalComponent extends React.Component {
    render(){
        return (
            <h1>Total a pagar: <b>{this.props.total}</b></h1>
        )
    }
}
export default POS;
