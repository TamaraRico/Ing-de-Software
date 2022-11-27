import React from 'react';
import { createRoot } from 'react-dom/client'
import './index.css';

import Login from './loginComponent/login';
import POS from './posComponent/main';
import Admin from './adminComponent/admin';
import Inventory from './adminComponent/inventoryComponent/inventario';
import Employee from './adminComponent/employeeComponent/employee';
import InventoryPos from './posComponent/inventarioPos';
import DeleteSales from './adminComponent/deleteSalesComponent/index';
import {BrowserRouter, Route, Routes} from 'react-router-dom'

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <BrowserRouter>
      <div className='App'>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/pos' element={<POS />} />  
            <Route path='/admin' element={<Admin />} />  
            <Route path='/inventory' element={<Inventory/>} />  
            <Route path='/employee' element={<Employee/>}/>
            <Route path='/inventoryPos' element={<InventoryPos/>}/>
            <Route path='/deleteSales' element={<DeleteSales />} /> 
          </Routes>
      </div>
    </BrowserRouter>
)