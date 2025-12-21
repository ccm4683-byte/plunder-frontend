// src/components/Header.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ 
      padding: '15px 30px', 
      borderBottom: '1px solid #ddd', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      {/* 로고 */}
      <div>
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>
          Plunder 🏴‍☠️
        </Link>
      </div>
      
      {/* 네비게이션 메뉴 */}
      <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/products" style={{ textDecoration: 'none', color: '#555', fontWeight: '500' }}>전체 상품</Link>
        
        {user ? (
          <>
            {/* 스폰서 전용 메뉴 */}
            {user.role === 'sponsor' && (
              <>
                <Link to="/products/create" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>상품 등록</Link>
                <Link to="/products/mine" style={{ textDecoration: 'none', color: '#007bff' }}>내 상품 관리</Link>
              </>
            )}

            {/* 관리자 전용 메뉴 */}
            {user.role === 'admin' && (
              <Link to="/admin/game" style={{ textDecoration: 'none', color: '#dc3545', fontWeight: 'bold' }}>
                🎮 경기 관리
              </Link>
            )}

            {/* ▼▼▼ [추가된 부분] 내 정보 버튼 ▼▼▼ */}
            <Link to="/mypage" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', display:'flex', alignItems:'center', gap:'5px' }}>
              👤 내 정보
            </Link>

            {/* 유저 이메일 표시 */}
            <span style={{ color: '#888', fontSize: '14px' }}>| {user.email}님</span>

            {/* 로그아웃 버튼 */}
            <button 
              onClick={handleLogout} 
              style={{ 
                padding: '5px 10px', 
                background: '#333', color: 'white', 
                border: 'none', borderRadius: '4px', cursor: 'pointer' 
              }}
            >
              로그아웃
            </button>
          </>
        ) : (
          /* 로그인 안 했을 때 */
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: '#333' }}>로그인</Link>
            <Link to="/signup" style={{ 
              textDecoration: 'none', padding: '8px 15px', 
              backgroundColor: '#333', color: 'white', borderRadius: '4px' 
            }}>
              회원가입
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}