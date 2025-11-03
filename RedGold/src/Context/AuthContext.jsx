import React, { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

// Backend endpoints
const PROFILE_URL = "auth/me";
const LOGIN_URL = "auth/login";

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ On mount — check for existing token and fetch user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch logged-in user profile
  const fetchUser = async (token) => {
    try {
      const resp = await fetch(`${BASE_URL}${PROFILE_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.ok) {
        const data = await resp.json();
        setUser(data);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login and immediately set user without delay
  const login = async (email, password) => {
    try {
      const resp = await fetch(`${BASE_URL}${LOGIN_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.detail || "Login failed");
      }

      const data = await resp.json();

      // Save token
      localStorage.setItem("token", data.token);
      localStorage.setItem("token_type", data.token_type);

      // 🟢 Directly fetch user after login
      await fetchUser(data.token);

      // 🟢 Redirect after setting user
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  // ✅ Logout and clear user + token
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_type");
    setUser(null);
    navigate("/");
  };

  // Wait until loading completes to avoid flicker
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to use auth context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
