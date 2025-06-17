
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CreatePrompt: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: '',
    isPublic: true
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: t('general.error'),
        description: t('createPrompt.titleRequired'),
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: t('general.error'),
        description: t('createPrompt.loginRequired'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Parse tags from comma-separated string
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const { error } = await supabase
        .from('prompts')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          content: formData.content.trim(),
          category: formData.category || null,
          tags: tagsArray,
          author_id: user.id,
          is_public: formData.isPublic
        });

      if (error) throw error;
      
      toast({
        title: t('general.success'),
        description: t('createPrompt.success'),
      });
      
      navigate('/my-prompts');
    } catch (error) {
      console.error('Error creating prompt:', error);
      toast({
        title: t('general.error'),
        description: t('createPrompt.failed'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('createPrompt.title')}</h1>
          <p className="text-muted-foreground">
            {t('createPrompt.subtitle')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('createPrompt.details')}</CardTitle>
            <CardDescription>
              {t('createPrompt.fillInfo')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">{t('createPrompt.titleLabel')} *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder={t('createPrompt.titlePlaceholder')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('createPrompt.descriptionLabel')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={t('createPrompt.descriptionPlaceholder')}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">{t('createPrompt.contentLabel')} *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder={t('createPrompt.contentPlaceholder')}
                  rows={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">{t('createPrompt.categoryLabel')}</Label>
                <Select onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('createPrompt.categoryPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="writing">{t('category.writing')}</SelectItem>
                    <SelectItem value="coding">{t('category.coding')}</SelectItem>
                    <SelectItem value="creative">{t('category.creative')}</SelectItem>
                    <SelectItem value="business">{t('category.business')}</SelectItem>
                    <SelectItem value="education">{t('category.education')}</SelectItem>
                    <SelectItem value="other">{t('category.other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">{t('createPrompt.tagsLabel')}</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder={t('createPrompt.tagsPlaceholder')}
                />
              </div>

              <div className="flex justify-between pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                >
                  {t('general.cancel')}
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="gradient-primary"
                >
                  {isSubmitting ? t('createPrompt.creating') : t('createPrompt.create')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreatePrompt;
