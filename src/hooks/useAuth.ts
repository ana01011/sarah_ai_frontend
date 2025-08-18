import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types/Chat';

export const useAuth = () => {
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
        picture: decoded.picture,
        given_name: decoded.given_name || '',
        family_name: decoded.family_name || ''
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
      if (email !== 'test@250323' || password !== 'Ahmed@250323') {
        throw new Error('Invalid test credentials. Please use the exact credentials provided.');
      }

      const testUser: User = {
        id: 'test-user-250323',
        name: 'Test User',
        email: 'test@250323',
        picture: '',
        given_name: 'Test',
        family_name: 'User'
      };

      const mockToken = btoa(JSON.stringify({
        sub: testUser.id,
        email: testUser.email,
        name: testUser.name,
        iat: Date.now(),
        exp: Date.now() + (24 * 60 * 60 * 1000)
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
    localStorage.removeItem('sarah-chat-history');
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    isLoading,
    error,
    loginWithGoogle,
    loginWithTestCredentials,
    logout,
    clearError
  };
};