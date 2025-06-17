
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
    'nav.dashboard': '仪表盘',
    'nav.browsePrompts': '浏览 Prompts',
    'nav.myPrompts': '我的 Prompts',
    'nav.adminPanel': '管理面板',
    'nav.profile': '个人资料',
    'nav.settings': '设置',
    'nav.logout': '退出登录',
    'nav.createPrompt': '创建新 Prompt',
    
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
    'role.admin': '管理员',
    'role.promptMaster': 'Prompt 大师',
    'role.user': '用户',
    
    // General
    'general.likes': '点赞',
    'general.prompts': '提示词',
    
    // Dashboard
    'dashboard.welcome': '欢迎回来，{username}！',
    'dashboard.subtitle': '准备好创建和分享精彩的 Prompts 了吗？',
    'dashboard.createPromptDesc': '分享你的创意 Prompts',
    'dashboard.browsePromptDesc': '发现社区优秀 Prompts',
    'dashboard.myPromptDesc': '管理和编辑你创建的 Prompts',
    'dashboard.totalLikes': '总获赞数',
    'dashboard.promptsCreated': '创建的 Prompts',
    'dashboard.currentLevel': '当前等级',
    'dashboard.levelProgress': '等级进度',
    'dashboard.upgradeInfo': '再获得 {count} 个赞即可成为 Prompt 大师！',
    'dashboard.eligible': '恭喜！您已符合 Prompt 大师资格！',
    'dashboard.adminPanel': '管理员面板',
    'dashboard.manageSystem': '管理用户、prompts 和系统设置',
    'dashboard.openAdmin': '打开管理面板',
    'dashboard.loadingDashboard': '加载仪表盘...'
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
    'nav.createPrompt': 'Create New Prompt',
    
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
    'general.prompts': 'prompts',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back, {username}!',
    'dashboard.subtitle': 'Ready to create and share amazing prompts?',
    'dashboard.createPromptDesc': 'Share your creative prompts with the community',
    'dashboard.browsePromptDesc': 'Discover amazing prompts from other creators',
    'dashboard.myPromptDesc': 'Manage and edit your created prompts',
    'dashboard.totalLikes': 'Total Likes Received',
    'dashboard.promptsCreated': 'Prompts Created',
    'dashboard.currentLevel': 'Current Level',
    'dashboard.levelProgress': 'Level Up Progress',
    'dashboard.upgradeInfo': 'Get {count} more likes to become a Prompt Master!',
    'dashboard.eligible': 'Congratulations! You\'re eligible for Prompt Master status!',
    'dashboard.adminPanel': 'Administrator Panel',
    'dashboard.manageSystem': 'Manage users, prompts, and system settings',
    'dashboard.openAdmin': 'Open Admin Panel',
    'dashboard.loadingDashboard': 'Loading dashboard...'
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
    console.log('Setting language to:', lang);
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || keys[keys.length - 1];
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
