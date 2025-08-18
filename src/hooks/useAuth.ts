import { useState, useEffect } from 'react';
import { User } from '../types/User';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      // Dummy implementation - simulate Google auth with test credentials
      const dummyUser: User = {
        id: '1',
        email: 'ahmed250323@gmail.com',
        name: 'Ahmed Test User',
        picture: 'https://via.placeholder.com/100/4F46E5/FFFFFF?text=AT',
        given_name: 'Ahmed',
        family_name: 'User'
      };
      
      const dummyToken = 'dummy-jwt-token-' + Date.now();
      
      localStorage.setItem('token', dummyToken);
      localStorage.setItem('user', JSON.stringify(dummyUser));
      setToken(dummyToken);
      setUser(dummyUser);
      return true;
    } catch (error) {
      console.error('Google auth error:', error);
      return false;
    }
  };

  const handleDummyLogin = async (username: string, password: string) => {
    try {
      // Check dummy credentials
      if (username === 'ahmed250323' && password === 'password250323') {
        const dummyUser: User = {
          id: '1',
          email: 'ahmed250323@gmail.com',
          name: 'Ahmed Test User',
          picture: 'https://via.placeholder.com/100/4F46E5/FFFFFF?text=AT',
          given_name: 'Ahmed',
          family_name: 'User'
        };
        
        const dummyToken = 'dummy-jwt-token-' + Date.now();
        
        localStorage.setItem('token', dummyToken);
        localStorage.setItem('user', JSON.stringify(dummyUser));
        setToken(dummyToken);
        setUser(dummyUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const verifyToken = async () => {
    if (!token) return false;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    handleGoogleSuccess,
    handleDummyLogin,
    signOut,
    verifyToken
  };
};