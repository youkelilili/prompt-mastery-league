
-- Create a table for prompts
CREATE TABLE public.prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_public BOOLEAN DEFAULT true,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for prompt likes
CREATE TABLE public.prompt_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(prompt_id, user_id)
);

-- Create a profiles table to store user information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'prompt_master', 'administrator')),
  avatar TEXT,
  total_likes INTEGER DEFAULT 0,
  prompt_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prompts
CREATE POLICY "Anyone can view public prompts" ON public.prompts
  FOR SELECT USING (is_public = true OR auth.uid() = author_id);

CREATE POLICY "Users can create their own prompts" ON public.prompts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own prompts" ON public.prompts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own prompts" ON public.prompts
  FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for prompt_likes
CREATE POLICY "Anyone can view likes" ON public.prompt_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like prompts" ON public.prompt_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike prompts" ON public.prompt_likes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Anyone can view profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update prompt stats
CREATE OR REPLACE FUNCTION update_prompt_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update likes count for prompts
  IF TG_TABLE_NAME = 'prompt_likes' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.prompts 
      SET likes_count = likes_count + 1 
      WHERE id = NEW.prompt_id;
      
      UPDATE public.profiles 
      SET total_likes = total_likes + 1 
      WHERE id = (SELECT author_id FROM public.prompts WHERE id = NEW.prompt_id);
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.prompts 
      SET likes_count = likes_count - 1 
      WHERE id = OLD.prompt_id;
      
      UPDATE public.profiles 
      SET total_likes = total_likes - 1 
      WHERE id = (SELECT author_id FROM public.prompts WHERE id = OLD.prompt_id);
    END IF;
  END IF;
  
  -- Update prompt count for users
  IF TG_TABLE_NAME = 'prompts' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.profiles 
      SET prompt_count = prompt_count + 1 
      WHERE id = NEW.author_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.profiles 
      SET prompt_count = prompt_count - 1 
      WHERE id = OLD.author_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for updating stats
CREATE TRIGGER prompt_likes_stats_trigger
  AFTER INSERT OR DELETE ON public.prompt_likes
  FOR EACH ROW EXECUTE FUNCTION update_prompt_stats();

CREATE TRIGGER prompts_stats_trigger
  AFTER INSERT OR DELETE ON public.prompts
  FOR EACH ROW EXECUTE FUNCTION update_prompt_stats();
