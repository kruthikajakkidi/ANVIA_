import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("anviaUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("anviaToken"));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("anviaToken")));

  useEffect(() => {
    async function checkAuth() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest("/auth/check-auth");
        setUser(data.payload);
        localStorage.setItem("anviaUser", JSON.stringify(data.payload));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [token]);

  async function login(credentials) {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    localStorage.setItem("anviaToken", data.token);
    localStorage.setItem("anviaUser", JSON.stringify(data.payload));
    setToken(data.token);
    setUser(data.payload);
    return data.payload;
  }

  async function register(payload) {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (data.token && data.payload) {
      persistAuth(data.token, data.payload);
    }

    return data.payload;
  }

  function persistAuth(nextToken, nextUser) {
    localStorage.setItem("anviaToken", nextToken);
    localStorage.setItem("anviaUser", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }

  async function acceptAuthToken(nextToken) {
    localStorage.setItem("anviaToken", nextToken);
    setToken(nextToken);

    const data = await apiRequest("/auth/check-auth");
    localStorage.setItem("anviaUser", JSON.stringify(data.payload));
    setUser(data.payload);
    return data.payload;
  }

  function logout() {
    localStorage.removeItem("anviaToken");
    localStorage.removeItem("anviaUser");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      acceptAuthToken,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
