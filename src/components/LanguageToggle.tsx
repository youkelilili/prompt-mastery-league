
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center space-x-2"
      title={language === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <Globe className="h-4 w-4" />
      <span className="text-xs font-medium">
        {language === 'zh' ? 'EN' : '中'}
      </span>
    </Button>
  );
};
