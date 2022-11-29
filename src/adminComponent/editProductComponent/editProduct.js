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
  const [name, setName] = React.useState('');
  const [barcode, setBarcode] = React.useState('');
  const [quantity, setQuantity] = React.useState('');
  const [priceUnit, setPriceUnit] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [manufacture, setManufacture] = React.useState('');
  const [lastPurchase, setLastPurchase] = React.useState('');
  const [providerCode, setProviderCode] = React.useState('');
  const [discountPercent, setDiscountPercent] = React.useState('');
  const [hasDiscount, setHasDiscount] = React.useState('');

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

  const handleChangeName = (event) => {
    event.preventDefault();
    setName(event.target.value);
  }
  const handleChangeBarcode = (event) => {
    event.preventDefault();
    setBarcode(event.target.value);
  }
  const handleChangeQuantity = (event) => {
    event.preventDefault();
    setQuantity(event.target.value);
  }
  const handleChangePriceUnit = (event) => {
    event.preventDefault();
    setPriceUnit(event.target.value);
  }
  const handleChangePrice = (event) => {
    event.preventDefault();
    setPrice(event.target.value);
  }
  const handleChangeManufacture = (event) => {
    event.preventDefault();
    setManufacture(event.target.value);
  }
  const handleChangeLastPurchase = (event) => {
    event.preventDefault();
    setLastPurchase(event.target.value);
  }
  const handleChangeProviderCode = (event) => {
    event.preventDefault();
    setProviderCode(event.target.value);
  }
  const handleChangeDiscountPercent = (event) => {
    event.preventDefault();
    setDiscountPercent(event.target.value);
  }
  const handleChangeHasDiscount = (event) => {
    event.preventDefault();
    setHasDiscount(event.target.value);
  }

  const handleSearchProduct = (event) => {
    event.preventDefault();
    
    window.api.send('product:getByBarcode',window.document.getElementById('search').value);
    //'product:getOne'

    window.api.receive('product:getOne', (data) => {
        const data2 = JSON.parse(data);
        if(data2 != null){
            setBarcode(data2.barcode);
            setName(data2.name);
            setCategory(data2.category);
            setQuantity(data2.quantity);
            setPriceUnit(data2.priceUnit);
            setPrice(data2.price);
            setManufacture(data2.manufacture);
            setLastPurchase(data2.lastPurchase);
            setProviderCode(data2.providerCode);
            setDiscountPercent(data2.discountPercent);
            setHasDiscount(data2.hasDiscount);
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
            window.api.send('products:update', {barcode: window.document.getElementById('barcode').value}, {$set:formData});
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
            </Grid>
            <Grid item xs={12} md={6}>
                <Button onClick={handleSearchProduct}>Buscar</Button>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth autoFocus margin="dense" id="barcode" label="Codigo de barras" type="text" variant="filled" onChange={handleChangeBarcode} value={barcode}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="name" label="Nombre" type="text" variant="filled" onChange={handleChangeName} value={name} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth select margin="dense" id="category" label="Categoria" variant="filled" value={category} onChange={handleChangeCategory}>{
                categories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="quantity" label="Cantidad en almacen" type="text" variant="filled" onChange={handleChangeQuantity} value={quantity} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="price" label="Precio unitario" type="text" variant="filled" onChange={handleChangePriceUnit} value={priceUnit} InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="salePrice" label="Precio de venta" type="text" variant="filled" onChange={handleChangePrice} value={price} InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="manufacture" label="Manufactura" type="text" variant="filled" onChange={handleChangeManufacture} value={manufacture}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="lastPurchase" label="Ultimo dia de compra" type="text" variant="filled" onChange={handleChangeLastPurchase} value={lastPurchase} />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField fullWidth margin="dense" id="providerCode" label="Codigo de proveedor" type="text" variant="filled" onChange={handleChangeProviderCode} value={providerCode} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="discountPercent" label="Porcentaje de descuento" type="text" variant="filled" onChange={handleChangeDiscountPercent} value={discountPercent} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth margin="dense" id="hasDiscount" label="¿Tiene descuento?" type="text" variant="filled" onChange={handleChangeHasDiscount} value={hasDiscount} />
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
