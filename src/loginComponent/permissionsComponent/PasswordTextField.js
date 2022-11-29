import React from "react";
import {TextField}from '@mui/material';

class PasswordTextField extends React.Component{
    getValue = (e) => {
      var pass = e.target.value
      this.props.parentCallback(pass);
    };
    
    render(){
      return( <TextField fullWidth
                id="password" 
                label="Contrasena" 
                type="password"              
                onChange={this.getValue}
                margin="dense"
                />)
    }
  }

export default PasswordTextField;