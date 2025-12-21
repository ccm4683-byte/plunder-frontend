// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 유저 정보 (이메일, 역할 등)
  const [token, setToken] = useState(localStorage.getItem('token') || ''); // 토큰
  const [loading, setLoading] = useState(true); // 로딩 상태 (깜빡임 방지)
  
  const navigate = useNavigate();

  // 1. 앱 실행 시(새로고침 시) 토큰이 있으면 유저 정보 가져오기
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // 백엔드에 "이 토큰 누구 거야?" 물어보기
          const res = await axios.get('https://plunder-backend.onrender.com/api/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          setUser(res.data); // 유저 정보 복구 성공!
          setToken(storedToken);
        } catch (err) {
          console.error("토큰 만료됨:", err);
          localStorage.removeItem('token');
          setToken('');
          setUser(null);
        }
      }
      setLoading(false); // 로딩 끝
    };

    initAuth();
  }, []);

  // 2. 로그인 함수
  const login = async (email, password) => {
    try {
      const res = await axios.post('https://plunder-backend.onrender.com/api/auth/login', { email, password });
      const { token, user } = res.data;
      
      // 저장 및 상태 업데이트
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      // 로그인 성공 시 스폰서/관리자/팬에 따라 이동
      if (user.role === 'admin') navigate('/admin/game');
      else if (user.role === 'sponsor') navigate('/products/mine');
      else navigate('/');
      
      return true;
    } catch (err) {
      console.error(err);
      alert('로그인 실패: 이메일이나 비밀번호를 확인하세요.');
      return false;
    }
  };

  // 3. 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};