import { createClient } from '@supabase/supabase-js'

// Vite требует приставки import.meta.env для доступа к переменным из .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)