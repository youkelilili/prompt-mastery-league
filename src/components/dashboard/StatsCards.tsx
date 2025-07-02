
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <Card className="text-center">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
            {user.total_likes || 0}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">{t('dashboard.totalLikes')}</CardDescription>
        </CardHeader>
      </Card>

      <Card className="text-center">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
            {user.prompt_count || 0}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">{t('dashboard.promptsCreated')}</CardDescription>
        </CardHeader>
      </Card>

      <Card className="text-center sm:col-span-2 lg:col-span-1">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl font-bold text-primary break-words">
            {getRoleDisplayName(user.role)}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">{t('dashboard.currentLevel')}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
