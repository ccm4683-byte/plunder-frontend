// src/pages/ProductList.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(()=>{
    (async ()=>{
      try {
        const res = await api.get('/products');
        setProducts(res.data || []);
      } catch(e) {
        console.error(e);
      }
    })();
  },[]);

  return (
    <div style={{padding:24}}>
      <h2>상품 목록</h2>
      <ul>
        {products.map(p => (
          <li key={p.id || p._id} style={{borderBottom:'1px solid #eee', padding:8}}>
            <div><strong>{p.title}</strong></div>
            <div>{p.description}</div>
            <div>{p.price}원</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
