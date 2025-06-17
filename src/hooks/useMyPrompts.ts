
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PromptWithAuthor, DatabasePrompt, DatabaseProfile } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';

export const useMyPrompts = () => {
  const [prompts, setPrompts] = useState<PromptWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  const fetchMyPrompts = async () => {
    if (!user) {
      setPrompts([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching my prompts for user:', user.id);
      setLoading(true);
      
      // First, fetch the prompts
      const { data: promptsData, error: promptsError } = await supabase
        .from('prompts')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (promptsError) {
        console.error('Error fetching my prompts:', promptsError);
        throw promptsError;
      }

      console.log('My prompts data fetched:', promptsData?.length || 0);

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

      // Combine prompts with their authors and add isLiked property
      const transformedPrompts: PromptWithAuthor[] = promptsData.map(prompt => ({
        ...prompt,
        author: profilesMap.get(prompt.author_id) as DatabaseProfile,
        isLiked: false // For user's own prompts, isLiked is not relevant but required by interface
      })).filter(prompt => prompt.author); // Filter out prompts without valid authors

      setPrompts(transformedPrompts);
      console.log('My prompts processed:', transformedPrompts.length);
    } catch (error) {
      console.error('Error fetching my prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch when auth loading is complete
    if (!authLoading) {
      fetchMyPrompts();
    }
  }, [user, authLoading]);

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
