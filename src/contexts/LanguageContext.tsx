
import React, { createContext, useContext } from 'react';

interface LanguageContextType {
  language: 'zh';
  t: (key: string) => string;
}

const translations = {
  // Navigation
  'nav.dashboard': '仪表盘',
  'nav.browsePrompts': '浏览 Prompts',
  'nav.myPrompts': '我的 Prompts',
  'nav.adminPanel': '管理面板',
  'nav.profile': '个人资料',
  'nav.settings': '设置',
  'nav.logout': '退出登录',
  'nav.createPrompt': '创建新 Prompt',
  'nav.promptPerfect': 'PromptPerfect',
  
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
  'general.loading': '加载中...',
  'general.cancel': '取消',
  'general.confirm': '确认',
  'general.save': '保存',
  'general.delete': '删除',
  'general.edit': '编辑',
  'general.create': '创建',
  'general.submit': '提交',
  'general.success': '成功',
  'general.error': '错误',
  
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
  'dashboard.loadingDashboard': '加载仪表盘...',
  
  // My Prompts Page
  'myPrompts.title': '我的 Prompts',
  'myPrompts.subtitle': '管理和编辑您创建的 Prompts',
  'myPrompts.createNew': '创建新 Prompt',
  'myPrompts.noPrompts': '您还没有创建任何 Prompts',
  'myPrompts.createFirst': '创建第一个 Prompt',
  'myPrompts.totalCount': '总共 {count} 个 Prompts',
  'myPrompts.deleteSuccess': 'Prompt 已删除',
  'myPrompts.deleteFailed': '删除失败，请重试',
  
  // Create Prompt Page
  'createPrompt.title': '创建新 Prompt',
  'createPrompt.subtitle': '与社区分享您的创意 Prompt',
  'createPrompt.details': 'Prompt 详情',
  'createPrompt.fillInfo': '填写以下信息来创建您的 Prompt',
  'createPrompt.titleLabel': '标题',
  'createPrompt.titlePlaceholder': '为您的 prompt 起一个吸引人的标题',
  'createPrompt.descriptionLabel': '描述',
  'createPrompt.descriptionPlaceholder': '简要描述这个 prompt 的用途',
  'createPrompt.contentLabel': 'Prompt 内容',
  'createPrompt.contentPlaceholder': '在这里输入您的 prompt 内容...',
  'createPrompt.categoryLabel': '分类',
  'createPrompt.categoryPlaceholder': '选择一个分类',
  'createPrompt.tagsLabel': '标签',
  'createPrompt.tagsPlaceholder': '输入标签，用逗号分隔 (例如: 创意, 故事, 有趣)',
  'createPrompt.creating': '创建中...',
  'createPrompt.create': '创建 Prompt',
  'createPrompt.success': 'Prompt 创建成功！',
  'createPrompt.failed': '创建失败，请重试',
  'createPrompt.titleRequired': '标题和内容是必填项',
  'createPrompt.loginRequired': '请先登录',
  
  // Categories
  'category.writing': '写作',
  'category.coding': '编程',
  'category.creative': '创意',
  'category.business': '商务',
  'category.education': '教育',
  'category.other': '其他',
  
  // Profile Page
  'profile.title': '个人资料',
  'profile.subtitle': '管理您的个人信息和头像',
  'profile.avatarSettings': '头像设置',
  'profile.avatarDesc': '上传或更换您的个人头像',
  'profile.basicInfo': '基本信息',
  'profile.username': '用户名',
  'profile.email': '邮箱',
  'profile.role': '角色',
  'profile.joinDate': '注册时间',
  'profile.stats': '统计信息',
  'profile.statsDesc': '您在 PromptHub 的活动统计',
  'profile.totalLikes': '获得的点赞',
  'profile.totalPrompts': '创建的 Prompts',
  'profile.loginRequired': '请先登录',
  
  // App Name
  'app.name': 'PromptHub'
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || keys[keys.length - 1];
  };

  return (
    <LanguageContext.Provider value={{
      language: 'zh',
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
