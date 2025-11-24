'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Verify token on mount and when pathname changes
  useEffect(() => {
    const verifyToken = async () => {
      // Skip verification on login page
      if (pathname === '/admin/login') {
        setIsLoading(false);
        return;
      }

      const storedToken = localStorage.getItem('adminToken');
      
      if (!storedToken) {
        setIsLoading(false);
        if (pathname?.startsWith('/admin') && pathname !== '/admin/login') {
          router.push('/admin/login');
        }
        return;
      }

      try {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setToken(storedToken);
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('adminToken');
          setUser(null);
          setToken(null);
          if (pathname?.startsWith('/admin') && pathname !== '/admin/login') {
            router.push('/admin/login');
          }
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('adminToken');
        setUser(null);
        setToken(null);
        if (pathname?.startsWith('/admin') && pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [pathname, router]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setUser(null);
    router.push('/admin/login');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
