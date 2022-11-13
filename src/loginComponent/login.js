import React from "react";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
  load(){
    window.api.send('provider:load');

    window.api.receive('provider:get', (data) => {
      console.log(data)
    });
  }
  
  render(){
    return(
      <div>
        <h1>Hola mundo</h1>
        <button onClick={this.load}>Load sabritas</button>
        <Link to="/pos">Ir a main</Link>
        <Link to="/addProduct">Agregar producto</Link>
      </div>
    );
  }
}