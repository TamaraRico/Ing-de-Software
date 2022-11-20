// librerias importadas
import React from 'react';
import Portal from './portal';
import {Button , Box}from '@mui/material';
import swal from 'sweetalert';

// Componentes usados
import UsernameTextField from './formComponent/UsernameTextField'
import PasswordTextField from './formComponent/PasswordTextField'
import EntradaPickers from './formComponent/EntradaPickers'
import SalidaPickers from './formComponent/SalidaPickers'

// Variables para los datos del usuario
var user = null;
var pass = null;
var entry = null;
var out = null;
var exit = null;

class ModalAdd extends React.Component{
    // 
    state = {
        user: "",
        pass: "",
        entry: "",
        out: "",
    }
    
    userState = (childData) =>{
        this.setState({user: childData})
    }
    
    passState = (childData) =>(
        this.setState({pass: childData})
    )

    entryState = (childData) =>(
        this.setState({entry: childData})
    )

    outState = (childData) =>(
        this.setState({out: childData})
    )

    render(){
        const { children, toogle, active } = this.props;

        exit = toogle;
        user = this.state.user;
        pass = this.state.pass;
        entry = this.state.entry;
        out = this.state.out
        
        return (
            <Portal>
                {active && (
                    <div style={styles.wrapper}>
                        <div style={styles.window}>
                            <Box>
                                <ButtonExit/>
                                <div>{children}</div>
                                <div>
                                    <UsernameTextField parentCallback = {this.userState}/>
                                </div>
                                <div>
                                    <PasswordTextField parentCallback = {this.passState}/>
                                </div>
                                <div>
                                    <EntradaPickers parentCallback = {this.entryState}/>
                                </div>
                                <div>
                                    <SalidaPickers parentCallback = {this.outState}/>
                                </div>
                                <div>
                                    <AddButton/>
                                </div>
                            </Box>
                        </div>
                    </div>
                )}
            </Portal>
        );
    }
}

class ButtonExit extends React.Component{
    render(){
        return(
            <Button 
            variant="text"
            margin="dense"
            onClick={exit}>
            X
            </Button>
        )
    }
}

class AddButton extends React.Component{


    validate(){
        if((user != '') && (pass != '')) {
            window.api.send('user:load',user);
            let t1 = entry.split(':'),t2 = out.split(':');;
            let h = parseInt(t1[0]), m = parseInt(t1[1]), s = 0;
            let he = new Date(new Date(new Date().setHours(h,m,s)).toISOString());
     
            h = parseInt(t2[0]);
            m = parseInt(t2[1]);
            let ho = new Date(new Date(new Date().setHours(h,m,s)).toISOString());
            var userA = {
                name: user,
                password: pass,
                role: 'employee',
                entrada: he,
                salida: ho,
                checkin: false,
                checkout: false,   
            }
            window.api.receive('user:get', (data) => {     
                const data2 = JSON.parse(data);

                if(data2 == null){
                    window.api.send('users:insert', userA);
                    window.api.receive('users:insert',  async (confirmacion) => {
                        if(confirmacion){
                            swal({
                                title: 'Exito',
                                text: 'Usuario Creado Correctamente',
                                icon: 'success',
                                confirmButtonText: 'Cerrar'
                            })
                            exit()
                        }
                        else{
                            swal({
                                title: 'Error!',
                                text: 'No se pudo guardar el usuario :(',
                                icon: 'error',
                                confirmButtonText: 'Cerrar'
                            })
                        }
                    });
                } else {
                    swal({
                        title: 'Error!',
                        text: 'Ususario ya existe',
                        icon: 'error',
                        confirmButtonText: 'Cerrar'
                    })   
                }
            });     
        } else {
            swal({
                title: 'Error!',
                text: 'Falta algun campo!',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            })
        }
    }
    
    render(){
        return(
            <Button 
            variant="contained"
            onClick={this.validate}
            margin="dense">
            Agregar Usuario
            </Button>
        )
    }
}

const styles = {
    wrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        heigt: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    window: {
        position: 'relative',
        background: '#fff',
        borderRadius: 5,
        padding: 15,
        boxShadow: '2px 2px 10px rgba(0,0,0,0.3)',
        zIndex: 10,
        minWidth: 320,
    },
    closeBtn: {
        position: 'absolute',
        top: 0,
        right: 0,
    }
}

export default ModalAdd;