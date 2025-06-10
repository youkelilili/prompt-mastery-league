
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'prompt_master' | 'administrator';
  avatar?: string;
  createdAt: Date;
  totalLikes: number;
  promptCount: number;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  description: string;
  category: string;
  tags: string[];
  authorId: string;
  author: User;
  likes: number;
  likedBy: string[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
