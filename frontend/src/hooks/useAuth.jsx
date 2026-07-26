// useAuth hook — global authentication state
import { createContext, useContext, useState, useEffect } from 'react';
import { getSession, login as authLogin, logout as authLogout, register as authRegister } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) setUser(session.user);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const session = await authLogin(email, password);
    setUser(session.user);
    return session;
  };

  const register = async (data) => {
    const session = await authRegister(data);
    setUser(session.user);
    return session;
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
