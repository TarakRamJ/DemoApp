import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    const createdAt = localStorage.getItem('createdAt');
    const token = localStorage.getItem('token');
    
    if (token && username) {
      setUser({ username, role, email, createdAt });
    }
  }, []);

  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);
    if (data.email) localStorage.setItem('email', data.email);
    if (data.createdAt) localStorage.setItem('createdAt', data.createdAt);

    setUser({ 
      username: data.username, 
      role: data.role, 
      email: data.email || 'N/A', 
      createdAt: data.createdAt // Uses exact DB timestamp from LoginResponse
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, getInitials }}>
      {children}
    </AuthContext.Provider>
  );
};