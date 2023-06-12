import React from 'react';
import './components/home/containers/default/DefaultHeader.css'
import './App.css';
import HomePage from './components/home/HomePage';
import DefaultHeader from './components/home/containers/default/DefaultHeader';
import CategoryCreatePage from './components/category/create/CategoryCreatePage';
import { Route, Routes } from 'react-router-dom';
import DefaultLayout from './components/home/containers/default/DefaultLayout';
import CategoryEditPage from './components/category/edit/CategoryEditPage';
import LoginPage from './components/auth/login/LoginPage';
import RegisterPage from './components/auth/register/RegisterPage';
import ProductCreatePage from './components/product/create/ProductCreatePage';


function App() {
  return (
    <>
      
      <Routes>
        <Route path="/" element ={<DefaultLayout/>}>
          <Route index element={<HomePage/>}/>
          <Route path ="categories/create" element={<CategoryCreatePage/>}/>
          <Route path ="categories/:id/edit" element={<CategoryEditPage/>}/>
          <Route path ="products/create" element={<ProductCreatePage/>}/>
          <Route path ="login" element={<LoginPage/>}/>
          <Route path ="register" element={<RegisterPage/>}/>
        </Route>
      </Routes>

      
    </>
  );
}

export default App;
