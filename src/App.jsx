// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductList from './pages/ProductList';
import ProductCreate from './pages/ProductCreate';
import MyProducts from './pages/MyProducts';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products/create" element={<ProtectedRoute><ProductCreate /></ProtectedRoute>} />
        <Route path="/products/mine" element={<ProtectedRoute><MyProducts /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
