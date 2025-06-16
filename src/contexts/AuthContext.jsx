// contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    if (storedName && storedEmail) {
      setUser({ name: storedName, email: storedEmail });
    }
  }, []);

  const login = ({ name, email }) => {
    setUser({ name, email });
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
