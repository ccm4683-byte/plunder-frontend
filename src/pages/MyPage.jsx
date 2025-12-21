import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function MyPage() {
  const { user, logout } = useContext(AuthContext);

  // AuthContext가 아직 로딩 중이거나 유저가 없으면
  if (!user) {
    return <div style={{ padding: 20 }}>로그인 정보가 없습니다. 다시 로그인 해주세요.</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>👤 내 정보 (My Profile)</h2>
      
      <div style={{ marginTop: '20px', fontSize: '18px', lineHeight: '2' }}>
        <p><strong>📧 이메일:</strong> {user.email}</p>
        <p><strong>🔖 내 역할:</strong> 
          <span style={{ color: user.role === 'admin' ? 'red' : 'blue', fontWeight: 'bold', marginLeft: '5px' }}>
            {user.role.toUpperCase()}
          </span>
        </p>

        {user.role === 'fan' && (
          <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
            <p><strong>📣 나의 응원팀:</strong> <span style={{ color: '#6200ee', fontWeight: 'bold' }}>{user.favoriteTeam}</span></p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              * 응원팀이 승리하면 상품 목록에서 할인이 자동 적용됩니다.
            </p>
          </div>
        )}
      </div>

      <button 
        onClick={logout} 
        style={{ marginTop: '30px', padding: '10px 20px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        로그아웃
      </button>
    </div>
  );
}