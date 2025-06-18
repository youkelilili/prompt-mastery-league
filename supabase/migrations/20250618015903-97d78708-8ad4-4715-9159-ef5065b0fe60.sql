
-- 为 profiles 表添加描述字段
ALTER TABLE public.profiles ADD COLUMN bio TEXT;

-- 创建评论表
CREATE TABLE public.prompt_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 为评论表启用 RLS
ALTER TABLE public.prompt_comments ENABLE ROW LEVEL SECURITY;

-- 评论的 RLS 策略
CREATE POLICY "Anyone can view comments" ON public.prompt_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON public.prompt_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.prompt_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.prompt_comments
  FOR DELETE USING (auth.uid() = user_id);

-- 为 prompts 表添加评论数量字段
ALTER TABLE public.prompts ADD COLUMN comments_count INTEGER DEFAULT 0;

-- 创建函数来更新评论统计
CREATE OR REPLACE FUNCTION update_comment_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.prompts 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.prompt_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.prompts 
    SET comments_count = comments_count - 1 
    WHERE id = OLD.prompt_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器来自动更新评论统计
CREATE TRIGGER prompt_comments_stats_trigger
  AFTER INSERT OR DELETE ON public.prompt_comments
  FOR EACH ROW EXECUTE FUNCTION update_comment_stats();
