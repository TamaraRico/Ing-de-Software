import React from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2'
import './App.css';

var user = null;
var pass = null;

class Login extends React.Component {
  render(){
    return(
      <div className= "login-component">
        <div className="login-container">
            <div className="textField-container">
              <div className="element">
                <UsernameTextField/>
                <PasswordTextField/>
                <LoginButton/>
              </div>
            </div>
          </div>
        <svg viewBox="0 0 1920 643" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M0 0L107.2 76.5476C212.8 153.095 427.2 306.19 640 306.19C852.8 306.19 1067.2 153.095 1280 183.714C1492.8 214.333 1707.2 428.667 1812.8 535.833L1920 643H1812.8C1707.2 643 1492.8 643 1280 643C1067.2 643 852.8 643 640 643C427.2 643 212.8 643 107.2 643H0V0Z" fill="#FFB4A2"/>
        </svg>
      </div>
    );
  }
}

class UsernameTextField extends React.Component{
  getValue(e){
    user = e.target.value
  }

  render(){
    return( <TextField
              id="username" 
              label="Usuario" 
              variant="outlined"
              onChange={this.getValue}
              />)
  }
}

class PasswordTextField extends React.Component{
  getValue(e){
    pass = e.target.value
  }
  render(){
    return( <TextField 
              id="password" 
              label="Contrasena" 
              type="password"              
              onChange={this.getValue}
              />)
  }
}

class LoginButton extends React.Component{
  validate(){
    if((user !== '') && (pass !== '')) {
      window.api.send('user:load',user);
      window.api.receive('user:get', (data) => {
        const data2 = JSON.parse(data);
        if(data2.password === pass){
          if(data2.role === 'administrator'){
            window.location.pathname = "/admin"
          } else {
            localStorage.setItem('usuario', data2.name)
            window.location.pathname = "/pos";
          }
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Usuario no encontrado',
            icon: 'error',
            confirmButtonText: 'Cerrar'
          })
        }
      });
    }
  }
  render(){
    return(
      <Button variant="contained" onClick={this.validate}> Iniciar Sesion </Button>
    )
  }
}

export default (Login);