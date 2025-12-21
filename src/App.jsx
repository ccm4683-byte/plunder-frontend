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
import GameController from './pages/GameController';
import { AuthProvider } from './contexts/AuthContext';
import MyPage from './pages/MyPage';
import ProductEdit from './pages/ProductEdit';

export default function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/products/create" element={<ProtectedRoute><ProductCreate /></ProtectedRoute>} />
        <Route path="/products/mine" element={<ProtectedRoute><MyProducts /></ProtectedRoute>} />
        <Route path="/products/edit/:id" element={<ProtectedRoute><ProductEdit /></ProtectedRoute>} />
        <Route path="/admin/game" element={<GameController />} />
        <Route path="/mypage" element={<MyPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
