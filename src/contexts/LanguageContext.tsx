
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  zh: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.browsePrompts': 'Browse Prompts',
    'nav.myPrompts': 'My Prompts',
    'nav.adminPanel': 'Admin Panel',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Browse Prompts Page
    'browse.title': '浏览 Prompts',
    'browse.subtitle': '发现社区中的优秀 Prompts',
    'browse.searchPlaceholder': '搜索 prompts、作者...',
    'browse.allCategories': '所有分类',
    'browse.selectCategory': '选择分类',
    'browse.resultsCount': '找到 {count} 个 Prompts',
    'browse.noResults': '没有找到匹配的 Prompts',
    'browse.noResultsHint': '尝试调整搜索条件或浏览其他分类',
    'browse.loading': '加载中...',
    
    // User roles
    'role.admin': 'Admin',
    'role.promptMaster': 'Prompt Master',
    'role.user': 'User',
    
    // General
    'general.likes': 'likes',
    'general.prompts': 'prompts'
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.browsePrompts': 'Browse Prompts',
    'nav.myPrompts': 'My Prompts',
    'nav.adminPanel': 'Admin Panel',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Browse Prompts Page
    'browse.title': 'Browse Prompts',
    'browse.subtitle': 'Discover excellent Prompts from the community',
    'browse.searchPlaceholder': 'Search prompts, authors...',
    'browse.allCategories': 'All Categories',
    'browse.selectCategory': 'Select Category',
    'browse.resultsCount': 'Found {count} Prompts',
    'browse.noResults': 'No matching Prompts found',
    'browse.noResultsHint': 'Try adjusting search criteria or browse other categories',
    'browse.loading': 'Loading...',
    
    // User roles
    'role.admin': 'Admin',
    'role.promptMaster': 'Prompt Master',
    'role.user': 'User',
    
    // General
    'general.likes': 'likes',
    'general.prompts': 'prompts'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: handleSetLanguage,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
