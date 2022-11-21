import React from "react";
import Menu from './menuComponent/menu'
import ProductsReport from './productsReportComponent/index';
import ProvidersReport from './providersReportComponent/index';

import SalesGraph from "./stadisticsComponent/stadistics";

import './styles.css';

class Admin extends React.Component{
    render(){
        return(
        <div className="view-container">
            <Menu />
            <div id="main">
                <h1>DASHBOARD</h1>
                <h7><b>INICIO/</b>Dashboard</h7>
                <SalesGraph />
                <ProductsReport/>
                <ProvidersReport/>
            </div>
        </div>)
    }
}

//PARA ELIMINAR VENTAS
//<Link to="/deleteSales">Eliminar ventas o q</Link>

export default(Admin)