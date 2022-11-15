import React from 'react';
import { createRoot } from 'react-dom/client'
import './index.css';

import Login from './loginComponent/login';
import POS from './posComponent/main';
import AddProduct from './adminComponent/addProductComponent/addProduct';
import Admin from './adminComponent/admin'
import Inventory from './adminComponent/inventoryComponent/inventario'
import DeleteSales from './deleteSalesComponent/index';
import {BrowserRouter, Route, Routes} from 'react-router-dom'

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div className='App'>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/pos' element={<POS />} />  
            <Route path='/admin' element={<Admin />} />  
            <Route path='/addProduct' element={<AddProduct />} />
            <Route path='/inventory' element={<Inventory/>} />  
            <Route path='/deleteSales' element={<DeleteSales />} /> 
          </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
)