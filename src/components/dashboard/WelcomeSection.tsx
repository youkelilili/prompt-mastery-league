
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { DatabaseProfile } from '@/types/database';

interface WelcomeSectionProps {
  user: DatabaseProfile;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ user }) => {
  const { t } = useLanguage();

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
    <div className="text-center px-4">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
        {t('dashboard.welcome').replace('{username}', user.username)}
      </h1>
      <p className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
        {t('dashboard.subtitle')}
      </p>
      <div className="flex justify-center">
        <Badge variant={user.role === 'administrator' ? 'destructive' : user.role === 'prompt_master' ? 'default' : 'secondary'} className="text-sm sm:text-base px-3 py-1">
          {getRoleDisplayName(user.role)}
        </Badge>
      </div>
    </div>
  );
};
