
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
        setLoading(false);
        return;
      }

      // Get all unique author IDs
      const authorIds = [...new Set(promptsData.map(prompt => prompt.author_id))];
      console.log('Author IDs to fetch:', authorIds);

      // Fetch the profiles for these authors
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', authorIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Profiles data fetched:', profilesData?.length || 0);

      // Create a map of profiles by ID for easy lookup
      const profilesMap = new Map(
        (profilesData || []).map(profile => [profile.id, profile])
      );

      console.log('Profiles map created with keys:', Array.from(profilesMap.keys()));

      if (user) {
        // Check which prompts the user has liked
        const { data: likedPrompts } = await supabase
          .from('prompt_likes')
          .select('prompt_id')
          .eq('user_id', user.id);

        const likedPromptIds = new Set(likedPrompts?.map(like => like.prompt_id) || []);

        const promptsWithLikes: PromptWithAuthor[] = promptsData
          .map(prompt => {
            const author = profilesMap.get(prompt.author_id);
            if (!author) {
              console.warn('No author found for prompt:', prompt.id, 'author_id:', prompt.author_id);
              return null;
            }
            return {
              ...prompt,
              author: author as DatabaseProfile,
              isLiked: likedPromptIds.has(prompt.id)
            };
          })
          .filter((prompt): prompt is PromptWithAuthor => prompt !== null);

        console.log('Prompts with likes processed:', promptsWithLikes.length);
        setPrompts(promptsWithLikes);
      } else {
        // Transform the data to match our expected structure
        const transformedPrompts: PromptWithAuthor[] = promptsData
          .map(prompt => {
            const author = profilesMap.get(prompt.author_id);
            if (!author) {
              console.warn('No author found for prompt:', prompt.id, 'author_id:', prompt.author_id);
              return null;
            }
            return {
              ...prompt,
              author: author as DatabaseProfile,
              isLiked: false // Default to false when user is not logged in
            };
          })
          .filter((prompt): prompt is PromptWithAuthor => prompt !== null);

        console.log('Prompts processed without user:', transformedPrompts.length);
        setPrompts(transformedPrompts);
      }
    } catch (error) {
      console.error('Error fetching prompts:', error);
      setPrompts([]);
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
