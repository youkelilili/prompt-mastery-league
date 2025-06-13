
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DatabasePrompt, PromptWithAuthor, DatabaseProfile } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';

export const usePrompts = () => {
  const [prompts, setPrompts] = useState<PromptWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  const fetchPrompts = async () => {
    try {
      console.log('Fetching prompts...');
      setLoading(true);
      
      // First, fetch the public prompts
      const { data: promptsData, error: promptsError } = await supabase
        .from('prompts')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (promptsError) {
        console.error('Error fetching prompts:', promptsError);
        throw promptsError;
      }

      console.log('Prompts data fetched:', promptsData?.length || 0);

      if (!promptsData || promptsData.length === 0) {
        setPrompts([]);
        return;
      }

      // Get all unique author IDs
      const authorIds = [...new Set(promptsData.map(prompt => prompt.author_id))];

      // Fetch the profiles for these authors
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', authorIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Create a map of profiles by ID for easy lookup
      const profilesMap = new Map(
        (profilesData || []).map(profile => [profile.id, profile])
      );

      if (user) {
        // Check which prompts the user has liked
        const { data: likedPrompts } = await supabase
          .from('prompt_likes')
          .select('prompt_id')
          .eq('user_id', user.id);

        const likedPromptIds = new Set(likedPrompts?.map(like => like.prompt_id) || []);

        const promptsWithLikes: PromptWithAuthor[] = promptsData.map(prompt => ({
          ...prompt,
          author: profilesMap.get(prompt.author_id) as DatabaseProfile,
          isLiked: likedPromptIds.has(prompt.id)
        })).filter(prompt => prompt.author); // Filter out prompts without valid authors

        setPrompts(promptsWithLikes);
      } else {
        // Transform the data to match our expected structure
        const transformedPrompts: PromptWithAuthor[] = promptsData.map(prompt => ({
          ...prompt,
          author: profilesMap.get(prompt.author_id) as DatabaseProfile
        })).filter(prompt => prompt.author); // Filter out prompts without valid authors

        setPrompts(transformedPrompts);
      }
      
      console.log('Prompts processed:', prompts.length);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch when auth loading is complete
    if (!authLoading) {
      fetchPrompts();
    }
  }, [user, authLoading]);

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
