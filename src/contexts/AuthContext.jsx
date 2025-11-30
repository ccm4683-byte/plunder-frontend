// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // 로그인 정보 (token, role)
  const [loading, setLoading] = useState(true); // 로딩 중인가?

  // 1. 앱이 켜질 때(새로고침 될 때) 실행
  useEffect(() => {
    const token = localStorage.getItem('token'); // 'access_token' 아님!
    const role = localStorage.getItem('role');

    if (token) {
      // 토큰이 있으면 로그인 상태로 설정
      setUser({ token, role });
    }
    setLoading(false);
  }, []);

  // 2. 로그인 함수 (나중에 Login.jsx에서 쓸 수 있음)
  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setUser({ token, role });
  };

  // 3. 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    window.location.href = '/'; // 메인으로 이동하며 새로고침
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}