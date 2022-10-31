import React from 'react';
import { createRoot } from 'react-dom/client'
import './index.css';

import Login from './loginComponent/login';
import POS from './posComponent/main';

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
          </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
)