import React from "react";
import { Link } from "react-router-dom";
import ProductsReport from './productsReportComponent/index';
import ProvidersReport from './providersReportComponent/index';

class Admin extends React.Component{
    render(){
        return(
        <div>
            <h1>
                Administrator
            </h1>
            <Link to="/employee">Empleado</Link>
            <hr/>
            <Link to="/inventory">Inventario</Link>
            <hr/>
            <ProductsReport/>
            <hr/>
            <ProvidersReport/>
            <hr/>
            <Link to="/deleteSales">Eliminar ventas o q</Link>
            <hr/>
            <Link to="/">No soy logout pero regresame al login jaja</Link>
        </div>)
    }
}

export default(Admin)