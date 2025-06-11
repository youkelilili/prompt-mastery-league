
-- First, let's ensure the foreign key constraint exists and is properly named
ALTER TABLE public.prompts DROP CONSTRAINT IF EXISTS prompts_author_id_fkey;
ALTER TABLE public.prompts 
ADD CONSTRAINT prompts_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Enable RLS on both tables if not already enabled
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for prompts
DROP POLICY IF EXISTS "Public prompts are viewable by everyone" ON public.prompts;
CREATE POLICY "Public prompts are viewable by everyone" 
ON public.prompts FOR SELECT 
TO authenticated 
USING (is_public = true);

DROP POLICY IF EXISTS "Users can view their own prompts" ON public.prompts;
CREATE POLICY "Users can view their own prompts" 
ON public.prompts FOR SELECT 
TO authenticated 
USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can insert their own prompts" ON public.prompts;
CREATE POLICY "Users can insert their own prompts" 
ON public.prompts FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update their own prompts" ON public.prompts;
CREATE POLICY "Users can update their own prompts" 
ON public.prompts FOR UPDATE 
TO authenticated 
USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete their own prompts" ON public.prompts;
CREATE POLICY "Users can delete their own prompts" 
ON public.prompts FOR DELETE 
TO authenticated 
USING (auth.uid() = author_id);

-- Create basic RLS policies for profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);
