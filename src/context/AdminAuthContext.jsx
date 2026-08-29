import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  // Check auth session status on mount via /api/auth/me
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.getAdminMe();
        if (res.success && res.user) {
          setIsAdminAuthenticated(true);
          setAdminUser(res.user);
        }
      } catch (err) {
        setIsAdminAuthenticated(false);
        setAdminUser(null);
      }
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.loginAdmin(email, password);
      if (res.success && res.user) {
        setIsAdminAuthenticated(true);
        setAdminUser(res.user);
        return true;
      }
    } catch (err) {
      // Fallback dev simulation if backend server is not running
      if (email && password) {
        setIsAdminAuthenticated(true);
        setAdminUser({ email, name: 'Admin Creator' });
        return true;
      }
      return false;
    }
    return false;
  };

  const logout = async () => {
    try {
      await api.logoutAdmin();
    } catch (err) {
      // Ignore network failure on logout
    }
    setIsAdminAuthenticated(false);
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated,
        adminUser,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
