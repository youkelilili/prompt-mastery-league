
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DatabasePrompt, PromptWithAuthor } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';

export const usePrompts = () => {
  const [prompts, setPrompts] = useState<PromptWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      
      const { data: promptsData, error } = await supabase
        .from('prompts')
        .select(`
          *,
          author:profiles(*)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (user) {
        // Check which prompts the user has liked
        const { data: likedPrompts } = await supabase
          .from('prompt_likes')
          .select('prompt_id')
          .eq('user_id', user.id);

        const likedPromptIds = new Set(likedPrompts?.map(like => like.prompt_id) || []);

        const promptsWithLikes = promptsData?.map(prompt => ({
          ...prompt,
          isLiked: likedPromptIds.has(prompt.id)
        })) || [];

        setPrompts(promptsWithLikes as PromptWithAuthor[]);
      } else {
        setPrompts((promptsData || []) as PromptWithAuthor[]);
      }
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [user]);

  const toggleLike = async (promptId: string) => {
    if (!user) return;

    try {
      const prompt = prompts.find(p => p.id === promptId);
      if (!prompt) return;

      if (prompt.isLiked) {
        // Unlike
        await supabase
          .from('prompt_likes')
          .delete()
          .eq('prompt_id', promptId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('prompt_likes')
          .insert({
            prompt_id: promptId,
            user_id: user.id
          });
      }

      // Update local state
      setPrompts(prev => prev.map(p => 
        p.id === promptId 
          ? { 
              ...p, 
              isLiked: !p.isLiked,
              likes_count: p.isLiked ? p.likes_count - 1 : p.likes_count + 1
            }
          : p
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return { prompts, loading, refetch: fetchPrompts, toggleLike };
};
