import React from "react";
import { Link } from "react-router-dom";

class Login extends React.Component {
  render() {
    return(<div>
        <div>
          <h1>Usuario</h1>
        </div>
        <div>
          <input type="text" id ="username"/>
        </div>
        <div>
          <h1>Contrasena</h1>
        </div>
        <div>
          <input type="password" id ="password"/>
        </div>
        {/* <Link to="/pos">Ir a main</Link> */}
        <button  onClick={this.validate}  >Iniciar Sesion</button>
      </div>
    );
  }

  validate(){
    var user = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    if((user != '') && (pass != '')) {
      window.api.send('user:load',user);

      window.api.receive('user:get', (data) => {
        const data2 = JSON.parse(data);
        if(data2.password == pass){
          if(data2.role == 'administrator'){
            
          } else {
            
          }
        } else {
          console.log("Error")
        }
      });
    }
  }
}

export default (Login);