import React from "react";
import { TextField } from '@mui/material';

var time = '10:00'
class EntradaPickers extends React.Component{

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
            label = 'Entrada'
            value={time}
            onChange={this.getValue}>
            Entrada
            </TextField>
        )
    }
}

export default EntradaPickers;