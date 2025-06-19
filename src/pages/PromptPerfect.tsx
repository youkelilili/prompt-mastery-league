
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChatInterface } from '@/components/promptperfect/ChatInterface';

const PromptPerfect: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'assistant' | 'optimizer'>('assistant');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
            PromptPerfect
          </h1>
          <p className="text-muted-foreground">
            优化提示词，创建内容，重复使用
          </p>
        </div>

        <div className="flex justify-center">
          <div className="flex bg-muted p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('assistant')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'assistant'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              AI Assistant
            </button>
            <button
              onClick={() => setActiveTab('optimizer')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'optimizer'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Optimizer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChatInterface
            type="assistant"
            title="AI Assistant"
            placeholder="输入您的问题或需求..."
            isActive={activeTab === 'assistant'}
          />
          <ChatInterface
            type="optimizer"
            title="Optimizer"
            placeholder="输入需要优化的提示词..."
            isActive={activeTab === 'optimizer'}
          />
        </div>
      </div>
    </Layout>
  );
};

export default PromptPerfect;
