import { createContext, useContext, useState, useEffect } from "react";
import api from "../../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    if (!savedToken) {
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await api.get("auth/me", {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        setUser(res.data.user);
        setToken(savedToken);
      } catch {
        sessionStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  const login = (data) => {
    setUser(data.user);
    setToken(data.token);
    sessionStorage.setItem("token", data.token);
  };

  const logout = async () => {
    try {
      //  el interceptor añade el token automáticamente
      await api.post("auth/logout");
    } catch {
    } finally {
      setUser(null);
      setToken(null);
      sessionStorage.removeItem("token");
    }
  };

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, authHeader }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
