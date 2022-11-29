import React, {Fragment, useState} from 'react';
import { Link } from 'react-router-dom';
import {AddProvider} from './addProvider';

export default class Provider extends React.Component {
    load(){
      window.api.send('provider:load');
  
      window.api.receive('provider:get', (data) => {
        console.log(data)
      });
    }
    
    render(){
        AddProvider();
        return
    }
  }