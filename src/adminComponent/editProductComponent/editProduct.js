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

const categories = [
    {
        value: 'Papeleria',
        label: 'Papeleria',
    },
    {
        value: 'Miscelanea',
        label: 'Miscelanea',
    },
    {
        value: 'Regalos',
        label: 'Regalos',
    }
]
export default function EditProduct() {
  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = React.useState('Papeleria');

  const handleClickOpen = (event) => {
    event.preventDefault();
    setOpen(true);
  };

  const handleClose = (event) => {
    event.preventDefault();
    setOpen(false);
  };

  const handleChangeCategory = (event) => {
    event.preventDefault();
    setCategory(event.target.value);
  }

  const handleSearchProduct = (event) => {
    event.preventDefault();
    
    window.api.send('product:searchOne',window.document.getElementById('search').value);
    //'product:getOne'

    window.api.receive('product:get', (data) => {
        const data2 = JSON.parse(data);
        if(data2 != null){
            window.document.getElementById('barcode').value = data2.barcode;
            window.document.getElementById('category').value = data2.category;
            window.document.getElementById('name').value = data2.name;
            window.document.getElementById('quantity').value = data2.quantity;
            window.document.getElementById('priceUnit').value = data2.priceUnit;
            window.document.getElementById('price').value = data2.price;
            window.document.getElementById('manufacture').value = data2.manufacture;
            window.document.getElementById('lastPurchase').value = data2.lastPurchase;
            window.document.getElementById('providerCode').value = data2.providerCode;
            window.document.getElementById('discountPercent').value = data2.discountPercent;
            window.document.getElementById('hasDiscount').value = data2.hasDiscount;
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

  const handleEditProduct = (event) => {
    event.preventDefault();

    //HOW TO GET DATA FROM DIALOG
    window.api.send('product:getByBarcode',window.document.getElementById('barcode').value);
    //'product:getOne'

    window.api.receive('product:getOne', (data) => {
        const data2 = JSON.parse(data);
        if(data2 != null){
            const formData = {
                'barcode'         : window.document.getElementById('barcode').value,
                'category'        : category,
                'name'            : window.document.getElementById('name').value,
                'quantity'        : parseInt(window.document.getElementById('quantity').value),
                'priceUnit'       : parseInt(window.document.getElementById('price').value),
                'price'           : parseInt(window.document.getElementById('salePrice').value),
                'manufacture'     : window.document.getElementById('manufacture').value,
                'lastPurchase'    : new Date(window.document.getElementById('lastPurchase').value),
                'providerCode'    : window.document.getElementById('providerCode').value,
                'discountPercent' : window.document.getElementById('discountPercent').value,
                'hasDiscount'     : window.document.getElementById('hasDiscount').value
            };
            window.api.send('products:edit', {barcode: window.document.getElementById('barcode').value}, formData);
            Swal.fire({
                title: 'Correcto!',
                text: 'Producto editado con exito!',
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
        Editar Producto
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar un producto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Verificar correctamente todos los campos
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <TextField fullWidth autoFocus margin="dense" id="search" label="Producto a buscar" type="text" variant="filled" />
                <Button onClick={handleSearchProduct}>Buscar</Button>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth autoFocus margin="dense" id="barcode" label="Codigo de barras" type="text" variant="filled" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="name" label="Nombre" type="text" variant="filled" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth select margin="dense" id="category" label="Categoria" variant="filled" value={category} onChange={handleChangeCategory}>{
                categories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="quantity" label="Cantidad en almacen" type="text" variant="filled" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="price" label="Precio unitario" type="text" variant="filled" InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="salePrice" label="Precio de venta" type="text" variant="filled" InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="manufacture" label="Manufactura" type="text" variant="filled"/>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="lastPurchase" label="Ultimo dia de compra" type="text" variant="filled" />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField fullWidth margin="dense" id="providerCode" label="Codigo de proveedor" type="text" variant="filled" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="discountPercent" label="Porcentaje de descuento" type="text" variant="filled" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="hasDiscount" label="¿Tiene descuento?" type="text" variant="filled" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
          <Button onClick={handleEditProduct}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
