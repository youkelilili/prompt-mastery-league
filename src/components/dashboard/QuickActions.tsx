
import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/prompts/create')}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">✨</span>
            <span>{t('nav.createPrompt')}</span>
          </CardTitle>
          <CardDescription>
            {t('dashboard.createPromptDesc')}
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
            {t('dashboard.browsePromptDesc')}
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
            {t('dashboard.myPromptDesc')}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
