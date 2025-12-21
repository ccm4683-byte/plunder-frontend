// src/pages/Signup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LCK_TEAMS = [
  "Gen.G", "Hanwha Life Esports", "kt Rolster", "T1", "Dplus KIA", 
  "BNK FEARX", "Nongshim RedForce", "OKSavingsBank BRION", "DRX", "DN FREECS"
];

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    favoriteTeam: '',
    role: 'fan',
    age: '',
    gender: 'male' // 기본값: 팬
  });
  
  const navigate = useNavigate();

  // 입력값 변경 핸들러 (텍스트, 드롭다운 공용)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 팀 선택 핸들러
  const handleTeamSelect = (teamName) => {
    setFormData({ ...formData, favoriteTeam: teamName });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 검증: "팬"으로 가입하는데 팀을 안 골랐으면 막음
    if (formData.role === 'fan' && !formData.favoriteTeam) {
      alert('팬으로 가입하시려면 응원하는 팀을 반드시 선택해주세요!');
      return;
    }

    const payload = {
      ...formData,
      name: formData.email.split('@')[0] // 예: test@abc.com -> 이름은 'test'가 됨
    };

    try {
      await axios.post('https://plunder-backend.onrender.com/api/auth/signup', formData);
      alert('회원가입 성공! 로그인 해주세요.');
      navigate('/login'); 
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.msg || '회원가입 중 오류가 발생했습니다.';
      alert(`가입 실패: ${msg}`);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>회원가입</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* 1. 이메일 */}
        <div>
          <label style={{ display:'block', marginBottom:5, fontWeight:'bold' }}>이메일</label>
          <input 
            type="text" name="email" placeholder="example@test.com" 
            value={formData.email} onChange={handleChange} required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>

        {/* 2. 비밀번호 */}
        <div>
          <label style={{ display:'block', marginBottom:5, fontWeight:'bold' }}>비밀번호</label>
          <input 
            type="password" name="password" placeholder="비밀번호" 
            value={formData.password} onChange={handleChange} required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>

        {/* 3. [중요] 역할 선택 (드롭다운 메뉴) */}
        <div>
          <label style={{ display:'block', marginBottom:5, fontWeight:'bold' }}>가입 유형 선택</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', fontSize: '16px', boxSizing: 'border-box' }}
          >
            <option value="fan">팬 (Fan) - 승리 시 할인 혜택</option>
            <option value="sponsor">스폰서 (Sponsor) - 상품 등록 가능</option>
            <option value="admin">관리자 (Admin) - 경기 결과 조작</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display:'block', fontWeight:'bold', marginBottom:5 }}>나이</label>
          <input 
            type="number" name="age" placeholder="예: 25"
            value={formData.age} onChange={handleChange} required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display:'block', fontWeight:'bold', marginBottom:5 }}>성별</label>
          <select 
            name="gender" 
            value={formData.gender} onChange={handleChange}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          >
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>
      </div>

        {/* 4. 팀 선택 (역할이 'fan'일 때만 보여줌) */}
        {formData.role === 'fan' && (
          <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
            <label style={{ display:'block', marginBottom:8, fontWeight:'bold' }}>
              응원하는 팀 선택 <span style={{color:'red'}}>*</span>
            </label>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {LCK_TEAMS.map((team) => (
                <button
                  key={team}
                  type="button"
                  onClick={() => handleTeamSelect(team)}
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer',
                    backgroundColor: formData.favoriteTeam === team ? '#6200ee' : 'white',
                    color: formData.favoriteTeam === team ? 'white' : '#333',
                    fontWeight: formData.favoriteTeam === team ? 'bold' : 'normal',
                    transition: '0.2s'
                  }}
                >
                  {team}
                </button>
              ))}
            </div>
            {formData.favoriteTeam && (
              <p style={{ marginTop: '5px', fontSize: '14px', color: '#6200ee', textAlign: 'center' }}>
                선택된 팀: <strong>{formData.favoriteTeam}</strong>
              </p>
            )}
          </div>
        )}

        <button 
          type="submit" 
          style={{ padding: '15px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize:'16px', fontWeight: 'bold', marginTop: '10px' }}
        >
          가입하기
        </button>
      </form>
    </div>
  );
}