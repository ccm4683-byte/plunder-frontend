// src/pages/MyProducts.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyProducts() {
  const [products, setProducts] = useState([]);

  useEffect(()=>{
    (async ()=>{
      try {
        const res = await api.get('/products/mine');
        setProducts(res.data || []);
      } catch(e) {
        console.error(e);
      }
    })();
  },[]);

  return (
    <div style={{padding:24}}>
      <h2>내 상품</h2>
      <ul>
        {products.map(p => (
          <li key={p.id || p._id}>{p.title} — {p.price}원</li>
        ))}
      </ul>
    </div>
  );
}
