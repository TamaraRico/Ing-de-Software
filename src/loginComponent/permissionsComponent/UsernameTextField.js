import React from "react";
import {TextField}from '@mui/material';

class UsernameTextField extends React.Component{
  getValue = (e) => {
    var user = e.target.value
    this.props.parentCallback(user);
  };
  
  render(){
    return( <TextField 
              id="username" 
              label="Usuario" 
              variant="outlined"
              onChange={this.getValue}
              margin="dense"
              />)
  }
}

export default UsernameTextField;
