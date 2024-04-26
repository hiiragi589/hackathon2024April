import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://xtkxyjjempaemrtxfmgt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0a3h5amplbXBhZW1ydHhmbWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM5NzQ0NDgsImV4cCI6MjAyOTU1MDQ0OH0.9fvXWS8V9H_RxilQPFAHNYO2kts6XAQyfYQCTOGDWw4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})