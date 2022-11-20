import React from "react";
import { TextField } from '@mui/material';

var time = '11:00'
class SalidaPickers extends React.Component{

    getValue = (e) => {
       time = e.target.value
      this.props.parentCallback(time);
    };
    
    render(){
        return(
            <TextField 
            variant="outlined"
            type = 'time' 
            margin="dense"
            size = 'medium'
            value={time}
            onChange={this.getValue}>
            Salida
            </TextField>
        )
    }
}

export default SalidaPickers;