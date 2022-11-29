// librerias importadas
import * as React from "react";
import Button from "@mui/material/Button";
import swal from 'sweetalert';

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid } from "@mui/material";

// Variables para los datos del usuario

export default function ModalPass() {
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = (event) => {
      event.preventDefault();
      setOpen(true);
    };
  
    const handleClose = (event) => {
      event.preventDefault();
      setOpen(false);
    };
  
    const handlePassEmployee = (event) => {
        event.preventDefault();
        var user = window.document.getElementById('name').value;
        var pass = window.document.getElementById('pass').value;
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
  
    return (
      <div>
        <Button variant="outlined" onClick={handleClickOpen} id="outlined-buttons">
          Cambiar contrasena Empleado
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Cambiar contrasena a un Empleado</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Verificar correctamente todos los campos
            </DialogContentText>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth autoFocus margin="dense" id="name" label="Nombre" type="text" variant="filled" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth margin="dense" id="pass" label="Contrasena" type="password" variant="filled" />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cerrar</Button>
            <Button onClick={handlePassEmployee}>Guardar</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}