import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  console.log('Dashboard render - user:', user, 'loading:', loading, 'isAuthenticated:', isAuthenticated);

  useEffect(() => {
    // Only redirect if we're not loading and definitely not authenticated
    if (!loading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  console.log('Rendering dashboard for user:', user.username, 'role:', user.role);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'administrator':
        return 'bg-red-100 text-red-800';
      case 'prompt_master':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getUpgradeInfo = () => {
    if (user.role === 'user') {
      const likesNeeded = Math.max(0, 10 - user.total_likes);
      if (likesNeeded > 0) {
        return `Get ${likesNeeded} more likes to become a Prompt Master!`;
      } else {
        return 'Congratulations! You\'re eligible for Prompt Master status!';
      }
    }
    return null;
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome back, {user.username}!
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Ready to create and share amazing prompts?
          </p>
          <div className="flex justify-center">
            <Badge className={`text-lg px-4 py-2 ${getRoleColor(user.role)}`}>
              {user.role === 'administrator' ? 'Administrator' : 
               user.role === 'prompt_master' ? 'Prompt Master' : 'User'}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-purple-600">
                {user.total_likes || 0}
              </CardTitle>
              <CardDescription>Total Likes Received</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-purple-600">
                {user.prompt_count || 0}
              </CardTitle>
              <CardDescription>Prompts Created</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-purple-600">
                {user.role === 'administrator' ? 'Admin' : 
                 user.role === 'prompt_master' ? 'Master' : 'User'}
              </CardTitle>
              <CardDescription>Current Level</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Upgrade Progress */}
        {user.role === 'user' && (
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🏆</span>
                <span>Level Up Progress</span>
              </CardTitle>
              <CardDescription>
                {getUpgradeInfo()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-purple-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, ((user.total_likes || 0) / 10) * 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {user.total_likes || 0}/10 likes needed for Prompt Master
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/prompts/create')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">✨</span>
                <span>{t('nav.createPrompt') || '创建新 Prompt'}</span>
              </CardTitle>
              <CardDescription>
                {t('dashboard.createPromptDesc') || '分享你的创意 Prompts'}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/prompts')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">🔍</span>
                <span>{t('nav.browsePrompts')}</span>
              </CardTitle>
              <CardDescription>
                {t('dashboard.browsePromptDesc') || '发现社区优秀 Prompts'}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/my-prompts')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">📚</span>
                <span>{t('nav.myPrompts')}</span>
              </CardTitle>
              <CardDescription>
                {t('dashboard.myPromptDesc') || '管理和编辑你创建的 Prompts'}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Admin Quick Access */}
        {user.role === 'administrator' && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <span>⚡</span>
                <span>Administrator Panel</span>
              </CardTitle>
              <CardDescription>
                Manage users, prompts, and system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/admin')}
                className="bg-red-600 hover:bg-red-700"
              >
                Open Admin Panel
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
