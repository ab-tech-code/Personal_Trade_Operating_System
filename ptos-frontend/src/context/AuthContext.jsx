import React from "react";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("ptos_token");
    if (storedToken) setToken(storedToken);
    setLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem("ptos_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("ptos_token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
