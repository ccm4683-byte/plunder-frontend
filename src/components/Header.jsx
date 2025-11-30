// src/components/Header.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header style={{ padding: '15px 20px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
      
      {/* 1. 로고 */}
      <div style={{ fontWeight: 'bold', fontSize: '24px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#6200ee' }}>Plunder</Link>
      </div>

      {/* 2. 메뉴 (가운데) */}
      <nav style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>상품 목록</Link>
        
        {/* 🔥 핵심: 스폰서(sponsor)일 때만 상품 등록 버튼이 보임! */}
        {user && user.role === 'sponsor' && (
          <>
            <Link to="/products/create" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>상품 등록</Link>
            <Link to="/products/mine" style={{ textDecoration: 'none', color: '#333' }}>내 상품</Link>
          </>
        )}
      </nav>

      {/* 3. 우측 로그인/로그아웃 버튼 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {user ? (
          <>
            <span style={{ fontSize: '14px', color: '#666' }}>
              {user.role === 'sponsor' ? '👑 스폰서님' : '😀 팬님'}
            </span>
            <button 
              onClick={logout}
              style={{ padding: '6px 12px', border: '1px solid #ccc', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: '#333' }}>로그인</Link>
            <Link to="/signup" style={{ textDecoration: 'none', color: '#6200ee', fontWeight: 'bold' }}>회원가입</Link>
          </>
        )}
      </div>
    </header>
  );
}