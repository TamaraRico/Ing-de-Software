import React from "react";
import Menu from "../menuComponent/menu"
import AddProvider from '../addProviderComponent/addProvider';
import { Grid } from "@mui/material";
import {StickyTable} from "./providersTable";

function getStoresProviders() {
  return new Promise((resolve, reject) => {

    window.api.send('providers:findAllProviders');

    window.api.receive("providers:getAllProviders", (data) => {
      resolve(data);
    });
  });
}

class StoresProviders extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      providers : []
    };

    this.fetchProviders = this.fetchProviders.bind(this);
  }

  fetchProviders() {
    getStoresProviders().then((data) => {
      if (data !== "null") {
        const dataProviders = JSON.parse(data);

        var newProviders = this.state.providers.concat(dataProviders)
        this.setState({
            providers : newProviders
        }, () => {
          console.log("Datos desde providers.js: ", this.state.providers)
        });
      } else {
        throw console.error("Ningun proveedor registrado en la base de datos", this.state.providers);
      }
    });
  }

  componentDidMount(){
    this.fetchProviders();
  }
  
  render() {
    return (
      <div className="view-container">
        <Menu />
        <div id="main">
          <h1>PROVEEDORES</h1>
          <h7><b>INICIO/</b>Proveedores</h7>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <div class="card">
                <AddProvider />
              </div>
            </Grid>
            <Grid item xs={12} md={12}>
              <div class="card">
                {this.state.providers.length > 0 ? <StickyTable data={this.state.providers}/> : null}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default StoresProviders;