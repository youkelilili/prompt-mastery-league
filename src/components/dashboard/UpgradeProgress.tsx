
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
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
          <span>🏆</span>
          <span className="break-words">{t('dashboard.levelProgress')}</span>
        </CardTitle>
        <CardDescription className="text-sm break-words">
          {getUpgradeInfo()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="w-full bg-muted rounded-full h-2 sm:h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, ((user.total_likes || 0) / 10) * 100)}%` }}
          ></div>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 break-words">
          {user.total_likes || 0}/10 {t('general.likes')} needed for {t('role.promptMaster')}
        </p>
      </CardContent>
    </Card>
  );
};
