import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid, InputAdornment, MenuItem } from "@mui/material";
import Swal from "sweetalert2";

export default function AddProvider() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (event) => {
    event.preventDefault();
    setOpen(true);
  };

  const handleClose = (event) => {
    event.preventDefault();
    setOpen(false);
  };

  const handleAddProvider = (event) => {
    event.preventDefault();

    //HOW TO GET DATA FROM DIALOG
    window.api.send('provider:getByCode',window.document.getElementById('code').value);
    //'product:getOne'

    window.api.receive('provider:getOne', (data) => {
        const data2 = JSON.parse(data);
        if(data2 != null){
            Swal.fire({
                title: 'Error!',
                text: 'El proveedor ya se encuentra registrado',
                icon: 'error',
                timer: 2000
            })
        }else{
            const formData = {
                'code'         : window.document.getElementById('code').value,
                'name'            : window.document.getElementById('name').value,
                'RFC'            : window.document.getElementById('RFC').value
            };
            window.api.send('provider:add', formData);
            Swal.fire({
                title: 'Accion completada!',
                text: 'Proveedor registrado con exito!',
                icon: 'success',
                timer: 2000
            })
            setOpen(false);
        }
    })
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Agregar Proveedor
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Dar de alta nuevo proveedor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Verificar correctamente todos los campos
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth autoFocus margin="dense" id="code" label="Codigo de proveedor" type="text" variant="filled" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="name" label="Nombre" type="text" variant="filled" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="RFC" label="RFC" type="text" variant="filled" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
          <Button onClick={handleAddProvider}>Agregar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
