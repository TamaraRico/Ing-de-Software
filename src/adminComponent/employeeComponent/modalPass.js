// librerias importadas
import React from 'react';
import Portal from './portal';
import {Button , Box}from '@mui/material';
import swal from 'sweetalert';

// Componentes usados
import UsernameTextField from './formComponent/UsernameTextField'
import PasswordTextField from './formComponent/PasswordTextField'

// Variables para los datos del usuario
var user = null;
var pass = null;
var exit = null;

class ModalEdit extends React.Component{
    state = {
        user: "",
        pass: "",
    }
    
    userState = (childData) =>{
        this.setState({user: childData})
    }
    
    passState = (childData) =>(
        this.setState({pass: childData})
    )

    render(){
        const { children, toogle, active } = this.props;

        exit = toogle;
        user = this.state.user;
        pass = this.state.pass;

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
                                    <EditButton/>
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

class EditButton extends React.Component{
    validate(){
        if((user != '') || (pass != '')) {
            window.api.send('user:load',user);
            window.api.receive('user:get', (data) => {     
                const data2 = JSON.parse(data);
                if(data2 != null ){
                    if(data2.role != 'administrator'){
                        window.api.send('user:update', {name:user} ,{$set:{password:pass}})
                        swal({
                            title: 'Exito!',
                            text: 'Actualizacion Exitosa',
                            icon: 'success',
                            confirmButtonText: 'Cerrar'
                        }) 
                        exit()
                    } else {
                        swal({
                            title: 'Error!',
                            text: 'Es un usuario Administrador',
                            icon: 'error',
                            confirmButtonText: 'Cerrar'
                        }) 
                    }
                } else {
                    swal({
                        title: 'Error!',
                        text: 'Usuario no existe',
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
            Cambiar Contrasena
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

export default ModalEdit;