
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { DatabaseProfile } from '@/types/database';

interface StatsCardsProps {
  user: DatabaseProfile;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ user }) => {
  const { t } = useLanguage();

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-purple-600">
            {user.total_likes || 0}
          </CardTitle>
          <CardDescription>{t('dashboard.totalLikes')}</CardDescription>
        </CardHeader>
      </Card>

      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-purple-600">
            {user.prompt_count || 0}
          </CardTitle>
          <CardDescription>{t('dashboard.promptsCreated')}</CardDescription>
        </CardHeader>
      </Card>

      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-purple-600">
            {getRoleDisplayName(user.role)}
          </CardTitle>
          <CardDescription>{t('dashboard.currentLevel')}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
