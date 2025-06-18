
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { PromptCard } from '@/components/PromptCard';
import { CommentSection } from '@/components/CommentSection';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { usePrompts } from '@/hooks/usePrompts';
import { useToast } from '@/hooks/use-toast';

const PromptDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { prompts, toggleLike } = usePrompts();
  const { toast } = useToast();

  const prompt = prompts.find(p => p.id === id);

  const handleLike = async (promptId: string) => {
    await toggleLike(promptId);
  };

  if (!id) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">提示词不存在</h1>
          <Button onClick={() => navigate('/prompts')}>返回浏览</Button>
        </div>
      </Layout>
    );
  }

  if (!prompt) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-lg">加载中...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
          </Button>
        </div>

        <PromptCard
          prompt={prompt}
          onLike={handleLike}
          showActions={true}
        />

        <CommentSection promptId={id} />
      </div>
    </Layout>
  );
};

export default PromptDetail;
