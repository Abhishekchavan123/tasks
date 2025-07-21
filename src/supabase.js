import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://zjndpzjkhkcdsdppityi.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqbmRwempraGtjZHNkcHBpdHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NDUwODAsImV4cCI6MjA2ODQyMTA4MH0.Jb3Pz25l-iqvnP4pRkwTplsX2knZBhQFZCDq1HDKRP8"

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 