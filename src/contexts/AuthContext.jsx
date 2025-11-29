// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = jwtDecode(token);
        setUser({ id: payload.sub || payload.id, ...payload });
      } catch (e) {
        localStorage.removeItem('access_token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    // 백엔드 응답에 맞게 필드명 조정
    const accessToken = res.data.accessToken || res.data.token || res.data.access_token;
    if (!accessToken) throw new Error('토큰이 응답에 없습니다.');
    localStorage.setItem('access_token', accessToken);
    const payload = jwtDecode(accessToken);
    setUser({ id: payload.sub || payload.id, ...payload });
    return res;
  };

  const signup = async (payload) => {
    return api.post('/auth/signup', payload);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  const me = async () => {
    return api.get('/auth/me');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, me }}>
      {children}
    </AuthContext.Provider>
  );
};
