
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { DatabaseProfile } from '@/types/database';

interface UpgradeProgressProps {
  user: DatabaseProfile;
}

export const UpgradeProgress: React.FC<UpgradeProgressProps> = ({ user }) => {
  const { t } = useLanguage();

  const getUpgradeInfo = () => {
    if (user.role === 'user') {
      const likesNeeded = Math.max(0, 10 - user.total_likes);
      if (likesNeeded > 0) {
        return t('dashboard.upgradeInfo').replace('{count}', likesNeeded.toString());
      } else {
        return t('dashboard.eligible');
      }
    }
    return null;
  };

  if (user.role !== 'user') {
    return null;
  }

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🏆</span>
          <span>{t('dashboard.levelProgress')}</span>
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
          {user.total_likes || 0}/10 {t('general.likes')} needed for {t('role.promptMaster')}
        </p>
      </CardContent>
    </Card>
  );
};
