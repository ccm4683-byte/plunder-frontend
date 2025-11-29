// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || err.message || '로그인 실패');
    }
  };

  return (
    <form onSubmit={onSubmit} style={{maxWidth:420, margin:'40px auto', display:'flex', flexDirection:'column', gap:8}}>
      <h2>로그인</h2>
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">로그인</button>
    </form>
  );
}
