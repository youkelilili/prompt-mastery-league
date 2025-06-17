
import React from 'react';
import { Layout } from '@/components/Layout';
import { PromptCard } from '@/components/PromptCard';
import { useMyPrompts } from '@/hooks/useMyPrompts';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const MyPrompts: React.FC = () => {
  const { prompts, loading, deletePrompt } = useMyPrompts();
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async (promptId: string) => {
    const success = await deletePrompt(promptId);
    if (success) {
      toast({
        title: t('general.success'),
        description: t('myPrompts.deleteSuccess'),
      });
    } else {
      toast({
        title: t('general.error'),
        description: t('myPrompts.deleteFailed'),
        variant: "destructive"
      });
    }
  };

  // Show loading only when auth is loading OR when prompts are loading but we have a user
  if (authLoading || (loading && user)) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">{t('general.loading')}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('myPrompts.title')}</h1>
            <p className="text-muted-foreground">
              {t('myPrompts.subtitle')}
            </p>
          </div>
          <Button onClick={() => navigate('/prompts/create')} className="gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            {t('myPrompts.createNew')}
          </Button>
        </div>

        {prompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">{t('myPrompts.noPrompts')}</p>
            <Button onClick={() => navigate('/prompts/create')} className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              {t('myPrompts.createFirst')}
            </Button>
          </div>
        ) : (
          <>
            <div className="text-sm text-muted-foreground">
              {t('myPrompts.totalCount').replace('{count}', prompts.length.toString())}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onDelete={handleDelete}
                  showActions={false}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default MyPrompts;
