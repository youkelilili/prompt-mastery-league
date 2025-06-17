
export interface DatabasePrompt {
  id: string;
  title: string;
  content: string;
  description: string | null;
  category: string | null;
  tags: string[];
  author_id: string;
  is_public: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseProfile {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'prompt_master' | 'administrator';
  avatar: string | null;
  total_likes: number;
  prompt_count: number;
  created_at: string;
  updated_at: string;
}

export interface PromptWithAuthor extends DatabasePrompt {
  author: DatabaseProfile;
  isLiked: boolean; // Changed from optional to required
}
