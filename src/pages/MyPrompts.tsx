
import React from 'react';
import { Layout } from '@/components/Layout';
import { PromptCard } from '@/components/PromptCard';
import { useMyPrompts } from '@/hooks/useMyPrompts';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const MyPrompts: React.FC = () => {
  const { prompts, loading, deletePrompt } = useMyPrompts();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async (promptId: string) => {
    const success = await deletePrompt(promptId);
    if (success) {
      toast({
        title: "成功",
        description: "Prompt 已删除",
      });
    } else {
      toast({
        title: "错误",
        description: "删除失败，请重试",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">加载中...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">我的 Prompts</h1>
            <p className="text-muted-foreground">
              管理和编辑您创建的 Prompts
            </p>
          </div>
          <Button onClick={() => navigate('/prompts/create')} className="gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            创建新 Prompt
          </Button>
        </div>

        {prompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">您还没有创建任何 Prompts</p>
            <Button onClick={() => navigate('/prompts/create')} className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              创建第一个 Prompt
            </Button>
          </div>
        ) : (
          <>
            <div className="text-sm text-muted-foreground">
              总共 {prompts.length} 个 Prompts
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
