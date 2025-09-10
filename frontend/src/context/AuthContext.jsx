import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMe } from '../services/api';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('userToken') || null);
  const [isLoading, setIsLoading] = useState(true); // To handle initial auth check

  useEffect(() => {
    // This effect runs on initial app load to check if a token is valid
    const verifyUser = async () => {
      if (token) {
        try {
          // The API service automatically uses the token from localStorage
          const userData = await getMe();
          setUser(userData);
        } catch (error) {
          // Token is invalid or expired
          console.error("Token verification failed:", error);
          logout(); // Clear the invalid token
        }
      }
      setIsLoading(false);
    };
    verifyUser();
  }, [token]);

  const login = (userData, userToken) => {
    localStorage.setItem('userToken', userToken);
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setToken(null);
    setUser(null);
  };

  const authContextValue = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token, // A boolean to easily check if logged in
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook for easy consumption of the context
export const useAuth = () => {
  return useContext(AuthContext);
};