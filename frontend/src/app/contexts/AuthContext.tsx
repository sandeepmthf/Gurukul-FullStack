import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'student' | 'teacher' | 'admin';
  batch?: string;
  subjects?: string[]; // For teachers - assigned subjects
}

interface AuthContextType {
  user: User | null;
  setAuthUser: (userData: User) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOTP: (contact: string, type: 'mobile' | 'email') => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: 'student' | 'teacher';
  batch?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_ACCOUNT = {
  id: 'admin-master',
  name: 'Master Administrator',
  email: 'infogurukul.theinstitute@gmail.com',
  mobile: '+91 9999999999',
  role: 'admin' as const,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    // We check both the remote server login data 'user' and the mock DB 'gurukul_user'
    const storedUser = localStorage.getItem('user') || localStorage.getItem('gurukul_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const setAuthUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Invalid email or password' };
      }
    } catch (err) {
      return { success: false, error: 'Network error or server down' };
    }
  };

  const loginWithOTP = async (contact: string, type: 'mobile' | 'email'): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [type === 'email' ? 'email' : 'mobile']: contact, otp: '123456' }) 
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    // Student registration is handled by OTPRegistration component directly calling the API.
    // This context method is a placeholder or can be used for auto-login after external registration.
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('gurukul_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setAuthUser,
        login,
        loginWithOTP,
        register,
        logout,
        isAuthenticated: !!user,
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