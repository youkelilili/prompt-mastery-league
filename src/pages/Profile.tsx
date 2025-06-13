
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { AvatarUpload } from '@/components/AvatarUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { User, Calendar, Heart, FileText } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user?.avatar) {
      setAvatarUrl(user.avatar);
    }
  }, [user]);

  const handleAvatarUpdate = async (url: string) => {
    setAvatarUrl(url);
    
    // Refresh the user context by re-fetching the profile
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        // Update the user context with new avatar
        console.log('Profile updated with new avatar:', profile.avatar);
      }
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">请先登录</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">个人资料</h1>
          <p className="text-muted-foreground">
            管理您的个人信息和头像
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>头像设置</span>
              </CardTitle>
              <CardDescription>
                上传或更换您的个人头像
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <AvatarUpload 
                currentAvatarUrl={avatarUrl}
                onAvatarUpdate={handleAvatarUpdate}
              />
            </CardContent>
          </Card>

          {/* Profile Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>基本信息</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">用户名</label>
                <p className="text-lg">{user.username}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">邮箱</label>
                <p className="text-lg">{user.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">角色</label>
                <div className="mt-1">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">注册时间</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(user.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>统计信息</CardTitle>
            <CardDescription>
              您在 PromptHub 的活动统计
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">获得的点赞</p>
                  <p className="text-2xl font-bold">{user.total_likes}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">创建的 Prompts</p>
                  <p className="text-2xl font-bold">{user.prompt_count}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
