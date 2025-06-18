
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Trash2, Send } from 'lucide-react';
import { useComments } from '@/hooks/useComments';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CommentSectionProps {
  promptId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ promptId }) => {
  const { comments, loading, addComment, deleteComment } = useComments(promptId);
  const { user } = useAuth();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const success = await addComment(newComment);
    
    if (success) {
      setNewComment('');
      toast({
        title: '成功',
        description: '评论已发布',
      });
    } else {
      toast({
        title: '错误',
        description: '发布评论失败，请重试',
        variant: "destructive"
      });
    }
    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    const success = await deleteComment(commentId);
    
    if (success) {
      toast({
        title: '成功',
        description: '评论已删除',
      });
    } else {
      toast({
        title: '错误',
        description: '删除评论失败',
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'administrator':
        return 'destructive';
      case 'prompt_master':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'administrator':
        return '管理员';
      case 'prompt_master':
        return 'Prompt大师';
      default:
        return '用户';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>评论</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">加载中...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <span>评论 ({comments.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 添加评论 */}
        {user && (
          <div className="space-y-3">
            <Textarea
              placeholder="写下你的评论..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                className="gradient-primary"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? '发布中...' : '发布评论'}
              </Button>
            </div>
          </div>
        )}

        {!user && (
          <div className="text-center py-4 text-muted-foreground">
            请登录后发表评论
          </div>
        )}

        {/* 评论列表 */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无评论，来发表第一条评论吧！
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border-l-2 border-gray-200 pl-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.author.avatar || undefined} alt={comment.author.username} />
                      <AvatarFallback className="gradient-primary text-white text-sm">
                        {comment.author.username ? comment.author.username.charAt(0).toUpperCase() : '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{comment.author.username}</span>
                      <Badge variant={getRoleBadgeVariant(comment.author.role)} className="text-xs">
                        {getRoleDisplayName(comment.author.role)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                  </div>
                  {user && user.id === comment.user_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap pl-11">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
