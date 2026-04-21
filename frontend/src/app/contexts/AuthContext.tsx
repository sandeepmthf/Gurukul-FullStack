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

// Single Admin Account - only this account can create teacher IDs
const ADMIN_ACCOUNT = {
  id: 'admin-master',
  name: 'Administrator',
  email: 'admin@gurukul.com',
  password: 'admin@123',
  mobile: '+91 9876543210',
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
    // Check admin account
    if (email === ADMIN_ACCOUNT.email && password === ADMIN_ACCOUNT.password) {
      const { password: _, ...userWithoutPassword } = ADMIN_ACCOUNT;
      setUser(userWithoutPassword);
      localStorage.setItem('gurukul_user', JSON.stringify(userWithoutPassword));
      return { success: true };
    }

    // Check teacher accounts created by admin
    const teachers = JSON.parse(localStorage.getItem('gurukul_teachers') || '[]');
    const teacher = teachers.find(
      (t: any) => t.email === email && t.password === password
    );

    if (teacher) {
      const { password: _, ...userWithoutPassword } = teacher;
      setUser(userWithoutPassword);
      localStorage.setItem('gurukul_user', JSON.stringify(userWithoutPassword));
      return { success: true };
    }

    // Check registered student users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('gurukul_registered_users') || '[]');
    const registeredUser = registeredUsers.find(
      (u: any) => u.email === email && u.password === password
    );

    if (registeredUser) {
      const { password: _, ...userWithoutPassword } = registeredUser;
      setUser(userWithoutPassword);
      localStorage.setItem('gurukul_user', JSON.stringify(userWithoutPassword));
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const loginWithOTP = async (contact: string, type: 'mobile' | 'email'): Promise<{ success: boolean; error?: string }> => {
    // Find user by mobile or email
    const registeredUsers = JSON.parse(localStorage.getItem('gurukul_registered_users') || '[]');
    const teachers = JSON.parse(localStorage.getItem('gurukul_teachers') || '[]');
    
    let foundUser = null;

    if (type === 'mobile') {
      foundUser = registeredUsers.find((u: any) => u.mobile === contact) ||
                  teachers.find((t: any) => t.mobile === contact);
    } else {
      foundUser = registeredUsers.find((u: any) => u.email === contact) ||
                  teachers.find((t: any) => t.email === contact);
    }

    if (!foundUser) {
      return { success: false, error: 'Account not found. Please register first.' };
    }

    // Login successful - set user
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('gurukul_user', JSON.stringify(userWithoutPassword));

    return { success: true };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    // Check if email already exists
    const registeredUsers = JSON.parse(localStorage.getItem('gurukul_registered_users') || '[]');
    const teachers = JSON.parse(localStorage.getItem('gurukul_teachers') || '[]');
    
    const emailExists = 
      registeredUsers.some((u: any) => u.email === data.email) ||
      teachers.some((t: any) => t.email === data.email) ||
      data.email === ADMIN_ACCOUNT.email;

    if (emailExists) {
      return { success: false, error: 'Email already registered' };
    }

    // Only allow student registration through public form
    if (data.role !== 'student') {
      return { success: false, error: 'Only students can register. Teachers must be created by admin.' };
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      role: data.role,
      password: data.password,
      batch: data.batch,
    };

    // Save to localStorage
    registeredUsers.push(newUser);
    localStorage.setItem('gurukul_registered_users', JSON.stringify(registeredUsers));

    // Auto login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('gurukul_user', JSON.stringify(userWithoutPassword));

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