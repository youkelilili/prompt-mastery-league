
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types/user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data for demo
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'administrator',
    createdAt: new Date('2024-01-01'),
    totalLikes: 0,
    promptCount: 0,
  },
  {
    id: '2',
    username: 'john_doe',
    email: 'john@example.com',
    role: 'user',
    createdAt: new Date('2024-02-01'),
    totalLikes: 5,
    promptCount: 3,
  },
  {
    id: '3',
    username: 'prompt_expert',
    email: 'expert@example.com',
    role: 'prompt_master',
    createdAt: new Date('2024-01-15'),
    totalLikes: 25,
    promptCount: 12,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const currentUser = users.find(u => u.id === userData.id);
      if (currentUser) {
        setUser(currentUser);
      }
    }
  }, [users]);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Attempting login with:', email);
    
    // Simple mock authentication
    const foundUser = users.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    console.log('Attempting registration:', { username, email });
    
    // Check if user already exists
    if (users.find(u => u.email === email || u.username === username)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      role: 'user',
      createdAt: new Date(),
      totalLikes: 0,
      promptCount: 0,
    };

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUserRole = (userId: string, newRole: User['role']) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
    
    if (user && user.id === userId) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const updateUserStats = (userId: string, likes: number, promptCount: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updatedUser = { ...u, totalLikes: likes, promptCount };
        
        // Auto-upgrade to prompt_master if conditions are met
        if (updatedUser.role === 'user' && updatedUser.totalLikes >= 10) {
          updatedUser.role = 'prompt_master';
        }
        
        return updatedUser;
      }
      return u;
    }));

    if (user && user.id === userId) {
      const updatedUser = { ...user, totalLikes: likes, promptCount };
      if (updatedUser.role === 'user' && updatedUser.totalLikes >= 10) {
        updatedUser.role = 'prompt_master';
      }
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
