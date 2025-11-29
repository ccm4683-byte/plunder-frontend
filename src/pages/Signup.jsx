// src/pages/Signup.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 응원팀 선택 추가
  const [team, setTeam] = useState('');
  const { signup } = useContext(AuthContext);
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({ email, password, team });
      alert('회원가입 완료. 로그인해주세요.');
      nav('/login');
    } catch (err) {
      alert(err.response?.data?.message || err.message || '회원가입 실패');
    }
  };

  return (
    <form onSubmit={onSubmit} style={{maxWidth:420, margin:'40px auto', display:'flex', flexDirection:'column', gap:8}}>
      <h2>회원가입</h2>
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <input placeholder="응원팀" value={team} onChange={e=>setTeam(e.target.value)} />
      <button type="submit">가입</button>
    </form>
  );
}
