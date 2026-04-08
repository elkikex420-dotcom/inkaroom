import { createClient } from '@supabase/supabase-js';

// Sustituye estos valores con los de tu panel de Supabase
const supabaseUrl = 'https://eeccbsbfegrvujjsmsdz.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlY2Nic2JmZWdydnVqanNtc2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNjAzMDQsImV4cCI6MjA5MDgzNjMwNH0.YC9YB_3mH0H1w7UwDQh3Jxxfo1jqlAJLerUxMZt4b0k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);