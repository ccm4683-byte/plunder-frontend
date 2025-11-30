// src/pages/Signup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    favoriteTeam: '', // 응원팀 필수
    role: 'fan' // 기본값 팬
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 팬인데 응원팀 선택 안 했으면 막기
    if (formData.role === 'fan' && !formData.favoriteTeam.trim()) {
      alert('팬은 응원하는 팀을 반드시 입력해야 합니다!');
      return;
    }

    try {
      // 1. 회원가입 요청 (주소: 4000번 포트)
      // '/signup'으로 보냅니다 (아까 백엔드에서 '/signup'으로 통일했었죠?)
      await axios.post('http://localhost:4000/api/auth/signup', formData);
      
      alert('회원가입 성공! 이제 로그인 해주세요.');
      navigate('/login'); // 로그인 화면으로 이동

    } catch (err) {
      console.error(err);
      // 에러 메시지 보여주기
      const msg = err.response?.data?.msg || '회원가입 중 오류가 발생했습니다.';
      alert(`가입 실패: ${msg}`);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>회원가입</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* 이메일 */}
        <div>
          <label style={{ display:'block', marginBottom:5, fontWeight:'bold' }}>이메일</label>
          <input 
            type="text" 
            name="email" 
            placeholder="example@test.com" 
            value={formData.email} 
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label style={{ display:'block', marginBottom:5, fontWeight:'bold' }}>비밀번호</label>
          <input 
            type="password" 
            name="password" 
            placeholder="비밀번호" 
            value={formData.password} 
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>

        {/* 응원팀 (가장 중요!) */}
        <div>
          <label style={{ display:'block', marginBottom:5, fontWeight:'bold' }}>응원하는 팀</label>
          <input 
            type="text" 
            name="favoriteTeam" 
            placeholder="예: T1, Gen.G (필수)" 
            value={formData.favoriteTeam} 
            onChange={handleChange}
            // 팬일 때는 필수 입력
            required={formData.role === 'fan'}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>

        {/* 스폰서 가입용 (테스트할 때 유용) */}
        {/* 필요 없으면 이 div 전체를 지워도 됩니다 */}
        <div style={{ fontSize: '14px', color: '#666' }}>
          <label>
            <input 
              type="checkbox" 
              name="role" 
              value="sponsor"
              onChange={(e) => setFormData({ ...formData, role: e.target.checked ? 'sponsor' : 'fan' })}
            />
            스폰서로 가입하기 (체크 시 스폰서 권한 신청)
          </label>
        </div>

        <button 
          type="submit" 
          style={{ padding: '12px', backgroundColor: '#6200ee', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'16px' }}
        >
          가입하기
        </button>
      </form>
    </div>
  );
}
