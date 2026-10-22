import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken } from "../api";

const AuthContext = createContext(null);
const STORAGE_KEY = "smart-campus-auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed.user);
      setToken(parsed.token);
      setAuthToken(parsed.token);
    }
    setLoading(false);
  }, []);

  const persist = (payload) => {
    setUser(payload.user);
    setToken(payload.token);
    setAuthToken(payload.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const login = async (form) => {
    const { data } = await api.post("/auth/login", form);
    persist(data);
    return data;
  };

  const signup = async (form) => {
    const { data } = await api.post("/auth/signup", form);
    persist(data);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken("");
    setAuthToken("");
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      signup,
      logout,
      isAuthenticated: Boolean(user && token),
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
