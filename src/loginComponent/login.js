import React from "react";
import {Button , Box} from '@mui/material';
// import Swal from 'sweetalert2'
import './App.css';
import swal from 'sweetalert';

import UsernameTextField from './permissionsComponent/UsernameTextField';
import PasswordTextField from './permissionsComponent/PasswordTextField';

var user = null;
var pass = null;

class Login extends React.Component {
  state = {
    user: "",
    pass: "",
  }

  userState = (childData) => {
    this.setState({ user: childData })
  }
  passState = (childData) => (
    this.setState({ pass: childData })
  )

  render(){

    user = this.state.user;
    pass = this.state.pass;

    console.log(user)
    return(
      <div className= "login-component">
        <div className="login-container">
            <div className="textField-container">
              <div className="element">
              <div id="content">
                <Box>
                  <h1 position='center'>Pincelin</h1>
                  <div>
                    <UsernameTextField parentCallback={this.userState} />
                  </div>
                  <div>
                    <PasswordTextField parentCallback={this.passState} />
                  </div>
                  <div>
                    <LoginButton />
                  </div>
                </Box>
              </div>
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

class LoginButton extends React.Component{
  validate() {
      if ((user != null) && (pass != null)) {
        window.api.send('user:load', user);
        window.api.receive('user:get', (data) => {
          const data2 = JSON.parse(data);
          if (data != null) {
            if (data2.password == pass) {
              //INICIO MODIFICACION CHECKIN by IRVIN miau
              localStorage.setItem('usuario', data2.name) //NO ME BORREN ESTA LINEA AAAAAAAAAAAAAAAAAAAA
              let path = ""
              let str = ""
              let acceso = false
              if (data2.role == 'administrator') {
                path = "/admin"
                acceso = true
              } else {
                let checkin = new Date()
                
                let entrada = new Date(new Date(data2.entrada).toISOString())
                let last_checkout = new Date(new Date(data2.checkout).toISOString()) 
                
                //HORA DE PRUEBA
                entrada = new Date() //QUITAR AL TERMINAR EL DESARROLLO
                console.log(entrada)
                let entrada_min = new Date(entrada.getTime() - 10*60000)
                let entrada_max = new Date(entrada.getTime() + 10*60000)


                //10 minutos de tolerancia antes y despues de empezar la jornada
                if(checkin >= entrada_min && checkin <= entrada_max && last_checkout.getDay() !== checkin.getDay()){
                  acceso = true
                  str = "Sesion iniciada correctamente!"
                  window.api.send('users:checkin', data2._id, checkin);
                }
                else{
                  //Si ya no se esta en la tolerancia se checa si se inicio sesion antes para retomar la jornada
                  if(new Date(data2.checkin).getDay() === checkin.getDay() && last_checkout.getDay() !== checkin.getDay()){
                    str = "Retomando la sesion...🐥"
                    acceso = true
                  }
                  //Si llega aca es porque ni hizo el checkin ni esta en horario laboral jaja q wei
                }
                path = "/pos";
              }
              if(acceso){
                swal({
                  title: 'Sesion Iniciada!',
                  text: str,
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                  timer: 500
                })
                window.location.pathname = path
              }

              else
                swal({
                  title: 'Acceso no concedido',
                  text: 'Inicio de sesion fuera de horario permitido',
                  icon: 'error',
                  confirmButtonText: 'Aceptar'

                })
              //FIN MODIFICACION CHECKIN
            } else {
              swal({
                title: 'Error!',
                text: 'Contrasena incorrecta',
                icon: 'error',
                confirmButtonText: 'Cerrar'
              })
            }
          } else {
            swal({
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