
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { UpgradeProgress } from '@/components/dashboard/UpgradeProgress';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { AdminPanel } from '@/components/dashboard/AdminPanel';
import { TopPromptsSection } from '@/components/dashboard/TopPromptsSection';

const Dashboard: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  console.log('Dashboard render - user:', user, 'loading:', loading, 'isAuthenticated:', isAuthenticated);

  // 如果未登录，显示公开版本的 Dashboard
  if (!loading && !isAuthenticated) {
    return (
      <Layout>
        <div className="space-y-8">
          {/* 公开版本的欢迎信息 */}
          <div className="text-center py-12 px-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent mb-4">
              欢迎来到 PromptHub
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              发现和分享最优质的 AI 提示词
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                登录
              </button>
              <button
                onClick={() => navigate('/prompts')}
                className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium"
              >
                浏览提示词
              </button>
            </div>
          </div>
          
          {/* 热门提示词排行 - 公开可见 */}
          <div className="max-w-4xl mx-auto">
            <TopPromptsSection />
          </div>
        </div>
      </Layout>
    );
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('dashboard.loadingDashboard')}</p>
        </div>
      </div>
    );
  }

  // 已登录用户的完整 Dashboard
  console.log('Rendering dashboard for user:', user?.username, 'role:', user?.role);

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        <WelcomeSection user={user!} />
        <StatsCards user={user!} />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-6 sm:space-y-8">
            <UpgradeProgress user={user!} />
            <QuickActions />
          </div>
          <div className="xl:sticky xl:top-8 xl:self-start">
            <TopPromptsSection />
          </div>
        </div>
        <AdminPanel user={user!} />
      </div>
    </Layout>
  );
};

export default Dashboard;
