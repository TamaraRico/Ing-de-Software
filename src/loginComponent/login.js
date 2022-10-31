import { React } from "react";

import { Link } from "react-router-dom";

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;


export default class Login extends React.Component {
  
  render(){
    return(
      <div>
        <button onClick={this.load}>Carga sabritas</button>
        <Link to="/pos">Ir a main</Link>
      </div>
    );
  }
}