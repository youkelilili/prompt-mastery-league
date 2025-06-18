import React from 'react';
import { Layout } from '@/components/Layout';
import { PromptCard } from '@/components/PromptCard';
import { usePrompts } from '@/hooks/usePrompts';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const BrowsePrompts: React.FC = () => {
  const { prompts, loading, toggleLike } = usePrompts();
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.author.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || prompt.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(prompts.map(p => p.category).filter(Boolean))];

  const handleViewDetails = (promptId: string) => {
    navigate(`/prompts/${promptId}`);
  };

  // Show loading only when auth is loading, or when we have no user and prompts are loading
  if (authLoading || (!user && loading)) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="ml-4 text-lg">{t('browse.loading')}</p>
        </div>
      </Layout>
    );
  }

  // If we have a user and loading is still true, show loading
  if (user && loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="ml-4 text-lg">{t('browse.loading')}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">{t('browse.title')}</h1>
          <p className="text-muted-foreground">
            {t('browse.subtitle')}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t('browse.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('browse.selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('browse.allCategories')}</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category || ''}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {t('browse.resultsCount').replace('{count}', filteredPrompts.length.toString())}
        </div>

        {/* Prompts Grid */}
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">{t('browse.noResults')}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {t('browse.noResultsHint')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onLike={handleLike}
                onViewDetails={handleViewDetails}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BrowsePrompts;
