
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { AvatarUpload } from '@/components/AvatarUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Calendar, Heart, FileText, Edit, Save, X } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bio, setBio] = useState<string>('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.avatar) {
      setAvatarUrl(user.avatar);
    }
    if (user?.bio) {
      setBio(user.bio);
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
        console.log('Profile updated with new avatar:', profile.avatar);
      }
    }
  };

  const handleEditBio = () => {
    setTempBio(bio);
    setIsEditingBio(true);
  };

  const handleSaveBio = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ bio: tempBio })
        .eq('id', user.id);

      if (error) throw error;

      setBio(tempBio);
      setIsEditingBio(false);
      toast({
        title: '成功',
        description: '个人介绍已更新',
      });
    } catch (error) {
      console.error('Error updating bio:', error);
      toast({
        title: '错误',
        description: '更新失败，请重试',
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setTempBio('');
    setIsEditingBio(false);
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
        return t('role.admin');
      case 'prompt_master':
        return t('role.promptMaster');
      default:
        return t('role.user');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">{t('profile.loginRequired')}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">{t('profile.title')}</h1>
          <p className="text-muted-foreground">
            {t('profile.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{t('profile.avatarSettings')}</span>
              </CardTitle>
              <CardDescription>
                {t('profile.avatarDesc')}
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
                <span>{t('profile.basicInfo')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('profile.username')}</label>
                <p className="text-lg">{user.username}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('profile.email')}</label>
                <p className="text-lg">{user.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('profile.role')}</label>
                <div className="mt-1">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('profile.joinDate')}</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(user.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bio Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>个人介绍</span>
              {!isEditingBio && (
                <Button variant="outline" size="sm" onClick={handleEditBio}>
                  <Edit className="w-4 h-4 mr-2" />
                  编辑
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              分享一些关于你自己的信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditingBio ? (
              <div className="space-y-4">
                <Textarea
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  placeholder="写一些关于你自己的介绍..."
                  rows={4}
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4 mr-2" />
                    取消
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSaveBio}
                    disabled={isSaving}
                    className="gradient-primary"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? '保存中...' : '保存'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="min-h-[80px] flex items-center">
                {bio ? (
                  <p className="whitespace-pre-wrap">{bio}</p>
                ) : (
                  <p className="text-muted-foreground italic">还没有添加个人介绍</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.stats')}</CardTitle>
            <CardDescription>
              {t('profile.statsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('profile.totalLikes')}</p>
                  <p className="text-2xl font-bold">{user.total_likes}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('profile.totalPrompts')}</p>
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
