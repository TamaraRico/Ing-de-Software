import React from 'react';
import { createRoot } from 'react-dom/client'
import './index.css';

import ProductsReport from './productsReportComponent/index';
import ProvidersReport from './providersReportComponent/index';
import {BrowserRouter, Route, Routes} from 'react-router-dom'

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div className='App'>
          <Routes>
            <Route path='/' element={<ProductsReport />} /> 
            <Route path='/providersreport' element={<ProvidersReport />} /> 
          </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
)