
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
        title: "错误",
        description: "标题和内容是必填项",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "错误",
        description: "请先登录",
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
        title: "成功",
        description: "Prompt 创建成功！",
      });
      
      navigate('/my-prompts');
    } catch (error) {
      console.error('Error creating prompt:', error);
      toast({
        title: "错误",
        description: "创建失败，请重试",
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
          <h1 className="text-3xl font-bold mb-2">创建新 Prompt</h1>
          <p className="text-muted-foreground">
            与社区分享您的创意 Prompt
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Prompt 详情</CardTitle>
            <CardDescription>
              填写以下信息来创建您的 Prompt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">标题 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="为您的 prompt 起一个吸引人的标题"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="简要描述这个 prompt 的用途"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Prompt 内容 *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="在这里输入您的 prompt 内容..."
                  rows={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">分类</Label>
                <Select onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择一个分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="writing">写作</SelectItem>
                    <SelectItem value="coding">编程</SelectItem>
                    <SelectItem value="creative">创意</SelectItem>
                    <SelectItem value="business">商务</SelectItem>
                    <SelectItem value="education">教育</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">标签</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="输入标签，用逗号分隔 (例如: 创意, 故事, 有趣)"
                />
              </div>

              <div className="flex justify-between pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                >
                  取消
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="gradient-primary"
                >
                  {isSubmitting ? '创建中...' : '创建 Prompt'}
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
