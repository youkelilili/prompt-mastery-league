
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PromptWithAuthor } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';

export const useMyPrompts = () => {
  const [prompts, setPrompts] = useState<PromptWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMyPrompts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data: promptsData, error } = await supabase
        .from('prompts')
        .select(`
          *,
          profiles!prompts_author_id_fkey(*)
        `)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our expected structure
      const transformedPrompts = (promptsData || []).map(prompt => ({
        ...prompt,
        author: prompt.profiles
      }));

      setPrompts(transformedPrompts as PromptWithAuthor[]);
    } catch (error) {
      console.error('Error fetching my prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPrompts();
  }, [user]);

  const deletePrompt = async (promptId: string) => {
    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', promptId);

      if (error) throw error;

      setPrompts(prev => prev.filter(p => p.id !== promptId));
      return true;
    } catch (error) {
      console.error('Error deleting prompt:', error);
      return false;
    }
  };

  return { prompts, loading, refetch: fetchMyPrompts, deletePrompt };
};
