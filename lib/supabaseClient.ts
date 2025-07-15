// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zzluocxspocoktyeaouo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6bHVvY3hzcG9jb2t0eWVhb3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTE4NDcsImV4cCI6MjA2ODE2Nzg0N30.K1NMb4NSoByklK9ImMMsIGR_cOA1M9scYVJm7Ftl7LM';

export const supabase = createClient(supabaseUrl, supabaseKey);
