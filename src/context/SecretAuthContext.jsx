import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';
import { authenticateSecret } from '../services/secretAuth';

const SecretAuthContext = createContext(null);

export const SecretAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (password) => {
    setIsLoading(true);
    setError(null);

    try {
      // Try backend API unlock endpoint first
      const res = await api.unlockSecret(password);
      if (res.success) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      // If backend API returned explicit error message or fails
      try {
        // Dev service fallback
        const response = await authenticateSecret(password);
        if (response.success) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return true;
        }
      } catch (devErr) {
        setError("That doesn't seem to be the right key.");
        setIsAuthenticated(false);
        setIsLoading(false);
        return false;
      }
    }
  };

  const logout = async () => {
    try {
      await api.lockSecret();
    } catch (err) {
      // Ignore network failure on lock
    }
    setIsAuthenticated(false);
    setError(null);
    setIsLoading(false);
  };

  return (
    <SecretAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        setError,
      }}
    >
      {children}
    </SecretAuthContext.Provider>
  );
};

export const useSecretAuth = () => {
  const context = useContext(SecretAuthContext);
  if (!context) {
    throw new Error('useSecretAuth must be used within a SecretAuthProvider');
  }
  return context;
};
