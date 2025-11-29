// src/components/Header.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  return (
    <header style={{display:'flex', gap:12, padding:12, borderBottom:'1px solid #ddd', alignItems:'center'}}>
      <Link to="/" style={{fontWeight:700}}>Plunder</Link>
      <nav style={{display:'flex', gap:10}}>
        <Link to="/products">상품</Link>
        <Link to="/products/create">상품등록</Link>
        <Link to="/products/mine">내상품</Link>
      </nav>
      <div style={{marginLeft:'auto'}}>
        {user ? (
          <>
            <span style={{marginRight:8}}>{user.email || user.sub || user.id}</span>
            <button onClick={() => { logout(); nav('/'); }}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{marginRight:8}}>로그인</Link>
            <Link to="/signup">회원가입</Link>
          </>
        )}
      </div>
    </header>
  );
}
