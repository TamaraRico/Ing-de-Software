import { Grid } from "@mui/material";
import React from "react";
import Menu from './menuComponent/menu'
import ProductsReport from './productsReportComponent/index';
import ProvidersReport from './providersReportComponent/index';
import DeleteSales from "../deleteSalesComponent";
import {TrafficGraph} from "./stadisticsComponent/stadistics";
import './styles.css';

class Admin extends React.Component{
    render(){
        return(
        <div className="view-container">
            <Menu />
            <div id="main">
                <div className="currentPage">
                    <h1>DASHBOARD</h1>
                    <h7><b>INICIO/</b>Dashboard</h7>
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <TrafficGraph /> 
                    </Grid>
                    <Grid item xs={8} md={8}>
                        <div className="card">
                            <DeleteSales />
                        </div>
                    </Grid> 
                    <Grid item xs={4} md={4}>
                        <div className="card">
                            <h1 className="title-graph">Reportes</h1>
                            <br/>
                            <br/>
                            <ProductsReport/>
                            <br/>
                            <br/>
                            <ProvidersReport/>
                        </div>
                    </Grid> 
                </Grid>
            </div>
        </div>)
    }
}

//PARA ELIMINAR VENTAS
//<Link to="/deleteSales">Eliminar ventas o q</Link>

export default(Admin)