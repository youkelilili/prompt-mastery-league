
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
          <p className="mt-4 text-muted-foreground">{t('dashboard.loadingDashboard')}</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  console.log('Rendering dashboard for user:', user.username, 'role:', user.role);

  return (
    <Layout>
      <div className="space-y-8">
        <WelcomeSection user={user} />
        <StatsCards user={user} />
        <UpgradeProgress user={user} />
        <QuickActions />
        <AdminPanel user={user} />
      </div>
    </Layout>
  );
};

export default Dashboard;
