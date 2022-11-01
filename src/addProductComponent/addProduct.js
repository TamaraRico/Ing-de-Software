import React, {Fragment, useState} from 'react';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';

const AddProduct = () => {
    const [product, setProduct] =useState({
        name: '',
        category: '',
        manufacture: '',
        providerCode: '',
        quantity: null,
        priceUnit: null,
        price: null
    });

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        window.api.send('product:searchOne',product.name);

        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('category', product.category);
        formData.append('manufacture', product.manufacture);
        formData.append('providerCode', product.providerCode);
        formData.append('quantity', product.quantity);
        formData.append('priceUnit', product.priceUnit);
        formData.append('price', product.price);

        window.api.receive('product:get', (data) => {
            const data2 = JSON.parse(data);
            if(data2){
                console.log("Producto ya registrado")
            } else {
                window.api.send('product:add', formData);
                window.api.receive('product:get', (data) => {
                    const data2 = JSON.parse(data);
                    if(data2){
                        console.log("El producto se registro correctamente")
                    } else {
                        console.log("Error al registrar el producto")
                    }
                });
            }
        });
    };

    return(
        <Fragment>
            <h2>Agregar producto</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="productName">Nombre del producto: </label>
                    <input type="text" 
                    className="form-control" 
                    name="productName" 
                    placeholder="Nombre del producto"
                    defaultValue={product.name}
                    onChange={handleChange}
                    required/>
                </div>

                <div className="form-group">
                    <label htmlFor="productCategory">Categoria: </label>
                    <input type="text" 
                    className="form-control" 
                    name="productCategory" 
                    placeholder="Categoria"
                    defaultValue={product.category}
                    onChange={handleChange}
                    required/>
                </div>

                <div className="form-group">
                    <label htmlFor="productManufacture">Fabricante: </label>
                    <input type="text" 
                    className="form-control" 
                    name="productManufacture" 
                    placeholder="Fabricante"
                    defaultValue={product.manufacture}
                    onChange={handleChange}
                    required/>
                </div>

                <div className="form-group">
                    <label htmlFor="productProviderCode">Codigo del proveedor: </label>
                    <input type="text" 
                    className="form-control" 
                    name="productProviderCode" 
                    placeholder="Codigo del proveedor"
                    defaultValue={product.providerCode}
                    onChange={handleChange}
                    required/>
                </div>

                <div className="form-group">
                    <label htmlFor="productQuantity">Cantidad: </label>
                    <input type="number" 
                    step="1"
                    min="0"
                    className="form-control" 
                    name="productQuantity" 
                    placeholder="Cantidad"
                    defaultValue={product.quantity}
                    onChange={handleChange}
                    required/>
                </div>

                <div className="form-group">
                    <label htmlFor="productPriceUnit">Precio unitario: </label>
                    <input type="number" 
                    step="1"
                    min="0"
                    className="form-control" 
                    name="productPriceUnit" 
                    placeholder="Precio unitario"
                    defaultValue={product.priceUnit}
                    onChange={handleChange}
                    required/>
                </div>

                <div className="form-group">
                    <label htmlFor="productPrice">Precio: </label>
                    <input type="number" 
                    step="1"
                    min="0"
                    className="form-control" 
                    name="productPrice" 
                    placeholder="Precio"
                    defaultValue={product.price}
                    onChange={handleChange}
                    required/>
                </div>

                <button type="submit" className="btn btn-primary">Guardar</button>
            </form>
        </Fragment>
    );
};

export default withRouter(AddProduct);