import React from 'react';
import TextField from '@mui/material/TextField';


//IF WE WANT TO GO TO ANOTHER PAGE, WE USE LINK
//import { Link } from 'react-router-dom';

class POS extends React.Component {
    render(){
        return (
            <ProductsComponent />
        );
    }
}


//CLASS TO HANDLE THE RETRIEVING PRODUCTS FROM THE BARCODE
class ProductsComponent extends React.Component{
    keyPressed(e){
        if(e.keyCode == 13){
            console.log("value: ", e.target.value)
        }
    }

    render(){
        return (
            <div className='productsHeader'>
                <TextField 
                    id="barcode_tosubtotal" 
                    label="Codigo de barras" 
                    variant="outlined"
                    onKeyDown={this.keyPressed}>
                </TextField>
                <Link to="/addProduct">Agregar producto</Link>
            </div>
        );
    }
}

export default POS;