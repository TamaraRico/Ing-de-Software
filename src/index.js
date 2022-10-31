import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './loginComponent/login';
import POS from './posComponent/main';

import {BrowserRouter, Route, Routes} from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <div className='App'>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/pos' element={<POS />} />  
          </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>, 
  document.getElementById('root')
)