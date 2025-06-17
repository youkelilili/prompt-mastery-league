
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { DatabaseProfile } from '@/types/database';

interface AdminPanelProps {
  user: DatabaseProfile;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ user }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  if (user.role !== 'administrator') {
    return null;
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-800">
          <span>⚡</span>
          <span>{t('dashboard.adminPanel')}</span>
        </CardTitle>
        <CardDescription>
          {t('dashboard.manageSystem')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={() => navigate('/admin')}
          className="bg-red-600 hover:bg-red-700"
        >
          {t('dashboard.openAdmin')}
        </Button>
      </CardContent>
    </Card>
  );
};
