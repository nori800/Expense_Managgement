import { createClient } from '@supabase/supabase-js';

// テスト用にダミーのクライアントを作成
export const supabase = {
  auth: {
    signInWithPassword: async () => ({ data: {}, error: null }),
    signUp: async () => ({ data: {}, error: null }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  }
};