
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CommentWithAuthor, DatabaseComment, DatabaseProfile } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';

export const useComments = (promptId: string) => {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      setLoading(true);
      
      // 获取评论
      const { data: commentsData, error: commentsError } = await supabase
        .from('prompt_comments')
        .select('*')
        .eq('prompt_id', promptId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      if (!commentsData || commentsData.length === 0) {
        setComments([]);
        return;
      }

      // 获取评论作者信息
      const authorIds = [...new Set(commentsData.map(comment => comment.user_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', authorIds);

      if (profilesError) throw profilesError;

      // 创建作者信息映射
      const profilesMap = new Map(
        (profilesData || []).map(profile => [profile.id, profile])
      );

      // 合并评论和作者信息
      const commentsWithAuthors: CommentWithAuthor[] = commentsData
        .map(comment => {
          const author = profilesMap.get(comment.user_id);
          if (!author) return null;
          return {
            ...comment,
            author: author as DatabaseProfile
          };
        })
        .filter((comment): comment is CommentWithAuthor => comment !== null);

      setComments(commentsWithAuthors);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (promptId) {
      fetchComments();
    }
  }, [promptId]);

  const addComment = async (content: string) => {
    if (!user || !content.trim()) return false;

    try {
      const { error } = await supabase
        .from('prompt_comments')
        .insert({
          prompt_id: promptId,
          user_id: user.id,
          content: content.trim()
        });

      if (error) throw error;

      await fetchComments();
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('prompt_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;

      setComments(prev => prev.filter(c => c.id !== commentId));
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  };

  return { comments, loading, addComment, deleteComment, refetch: fetchComments };
};
