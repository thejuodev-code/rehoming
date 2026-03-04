'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation } from '@apollo/client/react';
import { LOGIN } from '@/lib/mutations';
import { LoginData, LoginVariables } from '@/lib/mutations';
import { 
  getAuthToken, 
  getAuthUser, 
  setAuthToken, 
  setRefreshToken, 
  setAuthUser, 
  clearAuth,
  AuthUser 
} from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [loginMutation, { loading: isLoggingIn }] = useMutation<LoginData, LoginVariables>(LOGIN);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const token = getAuthToken();
    const savedUser = getAuthUser();
    
    if (token && savedUser) {
      setUser(savedUser);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setError(null);
    
    try {
      const { data } = await loginMutation({
        variables: { username, password }
      });

      if (data?.login) {
        const { authToken, refreshToken, user: userData } = data.login;
        
        // Store tokens and user data
        setAuthToken(authToken);
        setRefreshToken(refreshToken);
        setAuthUser(userData);
        
        // Update state
        setUser(userData);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || '로그인에 실패했습니다.');
      throw err;
    }
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading: isLoading || isLoggingIn,
        login, 
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
