import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'administrator')) {
      navigate('/dashboard');
    }
  }, [loading, isAuthenticated, user?.role, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'administrator') {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
            管理员面板
          </h1>
          <p className="text-muted-foreground">
            系统管理和配置
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>👥</span>
                <span>用户管理</span>
              </CardTitle>
              <CardDescription>
                管理用户账户和权限
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                管理用户
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📝</span>
                <span>提示词管理</span>
              </CardTitle>
              <CardDescription>
                审核和管理平台提示词
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                管理提示词
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>⚙️</span>
                <span>系统设置</span>
              </CardTitle>
              <CardDescription>
                配置系统参数和功能
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                系统设置
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📊</span>
                <span>数据统计</span>
              </CardTitle>
              <CardDescription>
                查看平台使用统计数据
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                查看统计
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🔧</span>
                <span>维护工具</span>
              </CardTitle>
              <CardDescription>
                系统维护和诊断工具
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                维护工具
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📋</span>
                <span>日志查看</span>
              </CardTitle>
              <CardDescription>
                查看系统操作日志
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                查看日志
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🤖</span>
                <span>PromptPerfect 模型配置</span>
              </CardTitle>
              <CardDescription>
                配置 AI 模型和 PromptPerfect 功能
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate('/model-config')}>
                模型配置
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;