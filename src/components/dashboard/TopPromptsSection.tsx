
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Trophy } from 'lucide-react';
import { usePrompts } from '@/hooks/usePrompts';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

export const TopPromptsSection: React.FC = () => {
  const { prompts, loading } = usePrompts();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // 按点赞数排序，取前5个
  const topPrompts = prompts
    .sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
    .slice(0, 5);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 1:
        return <Trophy className="w-4 h-4 text-gray-400" />;
      case 2:
        return <Trophy className="w-4 h-4 text-amber-600" />;
      default:
        return <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-gray-500">#{index + 1}</span>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>热门提示词排行</span>
          </CardTitle>
          <CardDescription>最受欢迎的提示词</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-12 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span>热门提示词排行</span>
        </CardTitle>
        <CardDescription>最受欢迎的提示词</CardDescription>
      </CardHeader>
      <CardContent>
        {topPrompts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            暂无提示词数据
          </p>
        ) : (
          <div className="space-y-3">
            {topPrompts.map((prompt, index) => (
              <div 
                key={prompt.id} 
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/prompts/${prompt.id}`)}
              >
                <div className="flex items-center justify-center w-6">
                  {getRankIcon(index)}
                </div>
                
                <Avatar className="w-8 h-8">
                  <AvatarImage src={prompt.author.avatar || undefined} alt={prompt.author.username} />
                  <AvatarFallback className="text-xs">
                    {prompt.author.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{prompt.title}</p>
                  <p className="text-xs text-muted-foreground">
                    by {prompt.author.username}
                  </p>
                </div>
                
                <div className="flex items-center space-x-1 text-sm">
                  <Heart className="w-3 h-3 text-red-500" />
                  <span className="font-medium">{prompt.likes_count || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
