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

export default function DeleteProduct() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [barcode, setBarcode] = React.useState('');


  const handleClickOpen = (event) => {
    event.preventDefault();
    setOpen(true);
  };

  const handleClose = (event) => {
    event.preventDefault();
    setOpen(false);
  };

  const handleChangeBarcode = (event) => {
    event.preventDefault();
    setBarcode(event.target.value);
  };

  const handleChangeName = (event) => {
    event.preventDefault();
    setName(event.target.value);
  };

  const handleSearchProduct = (event) => {
    event.preventDefault();
    
    window.api.send('product:getByBarcode',window.document.getElementById('search').value);
    //'product:getOne'

    window.api.receive('product:getOne', (data) => {
        const data2 = JSON.parse(data);
        if(data2 != null){
            setBarcode(data2.barcode);
            setName(data2.name);
        } else{
            Swal.fire({
                title: 'Error!',
                text: 'Producto no existente',
                icon: 'error',
                timer: 2000
            })
        }
    })
  }

  const handleDeleteProduct = (event) => {
    event.preventDefault();

    //HOW TO GET DATA FROM DIALOG
    window.api.send('product:getByBarcode',window.document.getElementById('barcode').value);
    //'product:getOne'

    window.api.receive('product:getOne', (data) => {
        const data2 = JSON.parse(data);
        if(data2 != null){
            window.api.send('products:delete', window.document.getElementById('barcode').value);
            Swal.fire({
                title: 'Correcto!',
                text: 'Producto eliminado con exito!',
                icon: 'success',
                timer: 2000
            })
            setOpen(false);
        }else{
            Swal.fire({
                title: 'Error!',
                text: 'Producto no existente',
                icon: 'error',
                timer: 2000
            })
        }
    })
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Eliminar Producto
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Eliminar un producto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Verificar que sea el producto correcto
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <TextField fullWidth autoFocus margin="dense" id="search" label="Producto a buscar" type="text" variant="filled" />
            </Grid>
            <Grid item xs={12} md={6}>
                <Button onClick={handleSearchProduct}>Buscar</Button>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth autoFocus margin="dense" id="barcode" label="Codigo de barras" type="text" variant="filled" onChange={handleChangeBarcode} value={barcode} InputProps={{readOnly: true}} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="name" label="Nombre" type="text" variant="filled" onChange={handleChangeName} value={name} InputProps={{readOnly: true}}/>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
          <Button onClick={handleDeleteProduct}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
