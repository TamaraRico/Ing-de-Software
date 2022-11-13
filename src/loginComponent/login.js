import React from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

var user = null;
var pass = null;

class Login extends React.Component {
  render() {
    return(
      <div class="App">
        <div>
          <UsernameTextField/>
        </div>
        <div>
          <PasswordTextField/>
        </div>
          <LoginButton/>
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
    if((user != '') && (pass != '')) {
      window.api.send('user:load',user);

      window.api.receive('user:get', (data) => {
        const data2 = JSON.parse(data);
        if(data2.password == pass){
          if(data2.role == 'administrator'){
            window.location.pathname = "/admin"
          } else {
            window.location.pathname = "/pos";
          }
        } else {
          console.log("Error");
        }
      });
    }
  }

  render(){
    return(<Button 
            variant="contained"
            onClick={this.validate}>
            Iniciar Sesion
            </Button>
    )
  }
}

export default (Login);