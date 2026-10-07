import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, profileService } from '../api/services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    const token = localStorage.getItem('hf_access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await authService.getMe();
      setUser(data.user);
      setProfile(data.profile);
    } catch (err) {
      console.warn("Failed to fetch current user session:", err);
      localStorage.removeItem('hf_access_token');
      localStorage.removeItem('hf_refresh_token');
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    localStorage.setItem('hf_access_token', data.tokens.access);
    localStorage.setItem('hf_refresh_token', data.tokens.refresh);
    setUser(data.user);
    // Fetch profile
    try {
      const profData = await profileService.getProfile();
      setProfile(profData);
    } catch {
      // profile fetch fallback
    }
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    localStorage.setItem('hf_access_token', data.tokens.access);
    localStorage.setItem('hf_refresh_token', data.tokens.refresh);
    setUser(data.user);
    const profData = await profileService.getProfile();
    setProfile(profData);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('hf_access_token');
    localStorage.removeItem('hf_refresh_token');
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    try {
      const profData = await profileService.getProfile();
      setProfile(profData);
    } catch (err) {
      console.error("Error refreshing profile:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        setProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
