// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zxeacckmdvvvhmdqbbvj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZWFjY2ttZHZ2dmhtZHFiYnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NDc4MTEsImV4cCI6MjA2NTEyMzgxMX0.o9Z6iYjnK5-3gv0SbmAZxhZPTY1g2WpgyFbzI8wyH3s";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);