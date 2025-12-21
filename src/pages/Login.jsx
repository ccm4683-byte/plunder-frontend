// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  // AuthContext에서 login 함수 가져오기 (이게 핵심!)
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // AuthContext의 login 함수 실행
    // (API 호출, 토큰 저장, 헤더 업데이트, 페이지 이동을 저 안에서 다 해줍니다)
    const success = await login(formData.email, formData.password);

    if (success) {
      alert("로그인 성공! 환영합니다.");
    }
    // 실패 시 alert는 AuthContext 안에서 띄우거나, 여기서 처리됩니다.
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>로그인</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          name="email" 
          placeholder="이메일" 
          value={formData.email} 
          onChange={handleChange}
          style={{ padding: '10px' }}
        />
        <input 
          type="password" 
          name="password" 
          placeholder="비밀번호" 
          value={formData.password} 
          onChange={handleChange}
          style={{ padding: '10px' }}
        />
        <button 
          type="submit" 
          style={{ padding: '12px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          로그인하기
        </button>
      </form>
    </div>
  );
}