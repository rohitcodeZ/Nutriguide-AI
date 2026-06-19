import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("ng_token"));
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    if (!token) { 
      setLoading(false); 
      return; 
    }
    try {
      // 💥 Ensure active instance default header matches state token perfectly
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch {
      localStorage.removeItem("ng_token");
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { 
    fetchMe(); 
  }, [fetchMe]);

  /*
  ======================================================
  🔥 FIXED LOGIN HANDLER (WITH INSTANT HEADER INJECTION)
  ======================================================
  */
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: t, user: u } = res.data;
    
    if (!t) throw new Error("Authentication failed: No token returned.");

    // 1. Storage updates instantly
    localStorage.setItem("ng_token", t);
    
    // 2. CRITICAL STEP: Inject token directly into current Axios instance header configuration!
    // This stops dashboard API requests from failing on the very first redirect pass
    api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    
    // 3. React states trigger setup
    setToken(t);
    setUser(u);
    
    return u;
  };

  /*
  ======================================================
  🔥 FIXED REGISTER HANDLER (WITH INSTANT HEADER INJECTION)
  ======================================================
  */
  const register = async (data) => {
    const res = await api.post("/auth/register", data);
    const { token: t, user: u } = res.data;
    
    if (!t) throw new Error("Registration failed: No token returned.");

    localStorage.setItem("ng_token", t);
    
    // Inject token directly into active instance headers right away
    api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    
    setToken(t);
    setUser(u);
    
    return u;
  };

  const logout = () => {
    localStorage.removeItem("ng_token");
    delete api.defaults.headers.common["Authorization"]; // Drop active instance credentials completely
    setToken(null);
    setUser(null);
  };

  const updateUser = (u) => setUser(u);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}