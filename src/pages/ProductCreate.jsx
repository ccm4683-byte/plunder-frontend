// src/pages/ProductCreate.jsx
import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function ProductCreate() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', { title, price, description });
      alert('상품 등록 완료');
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || err.message || '상품등록 실패');
    }
  };

  return (
    <form onSubmit={onSubmit} style={{maxWidth:600, margin:'24px auto', display:'flex', flexDirection:'column', gap:8}}>
      <h2>상품 등록</h2>
      <input placeholder="제목" value={title} onChange={e=>setTitle(e.target.value)} />
      <input placeholder="가격" value={price} onChange={e=>setPrice(e.target.value)} />
      <textarea placeholder="설명" value={description} onChange={e=>setDescription(e.target.value)} />
      <button type="submit">등록</button>
    </form>
  );
}
