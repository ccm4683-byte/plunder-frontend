// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // useNavigate 대신 window.location 사용해서 강제 새로고침 효과 줄 예정
  // const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. 로그인 요청
      const res = await axios.post('http://localhost:4000/api/auth/login', formData);
      console.log("서버 응답:", res.data); // 디버깅용

      // 2. 토큰과 역할(Role) 꺼내기
      const token = res.data.token;
      
      // [핵심 수정] role이 res.data에 있을 수도 있고, res.data.user 안에 있을 수도 있음!
      // 둘 다 확인해서 있는 걸 가져옵니다.
      const role = res.data.role || (res.data.user && res.data.user.role);

      if (token && role) {
        // 3. 브라우저에 저장
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        
        alert(`로그인 성공! (${role === 'sponsor' ? '스폰서' : '팬'} 계정입니다)`);
        
        // 4. 메인으로 이동하면서 새로고침 (상태 즉시 반영)
        window.location.href = '/'; 
      } else {
        alert('로그인은 됐는데 정보를 불러오지 못했습니다.');
        console.log("토큰:", token, "역할:", role);
      }

    } catch (err) {
      console.error(err);
      alert('로그인 실패: 이메일과 비밀번호를 확인하세요.');
    }
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
          style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          로그인하기
        </button>
      </form>
    </div>
  );
}