import React, {Fragment, useState} from 'react';
import { Link } from 'react-router-dom';
import {AddProduct} from './addProduct';

export default class Product extends React.Component {
    load(){
      window.api.send('products:load');
  
      window.api.receive('products:get', (data) => {
        console.log(data)
      });
    }
    
    render(){
        AddProduct();
        return
    }
  }