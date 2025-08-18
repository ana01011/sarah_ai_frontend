import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  loginWithGoogle: (credentialResponse: any) => Promise<void>;
  loginWithTestCredentials: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('sarah-user');
        const savedToken = localStorage.getItem('sarah-token');
        
        if (savedUser && savedToken) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('sarah-user');
        localStorage.removeItem('sarah-token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loginWithGoogle = async (credentialResponse: any) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!credentialResponse?.credential) {
        throw new Error('No credential received from Google');
      }

      const decoded: any = jwtDecode(credentialResponse.credential);
      
      const userData: User = {
        id: decoded.sub,
        name: decoded.name || decoded.email,
        email: decoded.email,
        picture: decoded.picture
      };

      localStorage.setItem('sarah-user', JSON.stringify(userData));
      localStorage.setItem('sarah-token', credentialResponse.credential);
      
      setUser(userData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithTestCredentials = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate exact test credentials
      if (email !== 'test@250323' || password !== 'Ahmed@250323') {
        throw new Error('Invalid test credentials. Please use the exact credentials provided.');
      }

      const testUser: User = {
        id: 'test-user-250323',
        name: 'Test User',
        email: 'test@250323',
        picture: undefined
      };

      const mockToken = btoa(JSON.stringify({
        sub: testUser.id,
        email: testUser.email,
        name: testUser.name,
        iat: Date.now(),
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }));

      localStorage.setItem('sarah-user', JSON.stringify(testUser));
      localStorage.setItem('sarah-token', mockToken);
      
      setUser(testUser);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Test login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('sarah-user');
    localStorage.removeItem('sarah-token');
    localStorage.removeItem('sarah-has-visited');
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      error,
      loginWithGoogle,
      loginWithTestCredentials,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};