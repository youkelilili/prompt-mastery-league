
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, User, Calendar, Tag, MessageCircle } from 'lucide-react';
import { PromptWithAuthor } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';

interface PromptCardProps {
  prompt: PromptWithAuthor;
  onLike?: (promptId: string) => void;
  onDelete?: (promptId: string) => void;
  showActions?: boolean;
  onViewDetails?: (promptId: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ 
  prompt, 
  onLike, 
  onDelete,
  showActions = true,
  onViewDetails
}) => {
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
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

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{prompt.title}</CardTitle>
            {prompt.description && (
              <CardDescription>{prompt.description}</CardDescription>
            )}
          </div>
          {showActions && (
            <div className="flex items-center space-x-2 ml-2">
              {onLike && user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLike(prompt.id)}
                  className={`${prompt.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${prompt.isLiked ? 'fill-current' : ''}`} />
                  {prompt.likes_count}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails?.(prompt.id)}
                className="text-gray-500"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                {prompt.comments_count || 0}
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Avatar className="w-10 h-10">
              <AvatarImage src={prompt.author.avatar || undefined} alt={prompt.author.username} />
              <AvatarFallback className="gradient-primary text-white font-semibold">
                {prompt.author.username ? prompt.author.username.charAt(0).toUpperCase() : '?'}
              </AvatarFallback>
            </Avatar>
            <span>{prompt.author.username}</span>
            <Badge variant={getRoleBadgeVariant(prompt.author.role)} className="text-xs">
              {getRoleDisplayName(prompt.author.role)}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(prompt.created_at)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm whitespace-pre-wrap">{prompt.content}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {prompt.category && (
                <Badge variant="outline">{prompt.category}</Badge>
              )}
              {prompt.tags && prompt.tags.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Tag className="w-3 h-3" />
                  <div className="flex space-x-1">
                    {prompt.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {prompt.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{prompt.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {onDelete && user && user.id === prompt.author_id && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(prompt.id)}
              >
                删除
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
