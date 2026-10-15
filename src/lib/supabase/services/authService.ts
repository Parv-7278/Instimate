import { getSupabaseClient } from '../client';
import { UserProfile, UserRole } from '@/types';

export const authService = {
  // Sign in with email and password
  async signIn(email: string, password: string) {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase client is not configured. Check your .env.local file.');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // Sign up a new user with metadata (role, institution, etc.)
  async signUp(params: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    institutionId?: string;
  }) {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase client is not configured. Check your .env.local file.');

    const { data, error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          full_name: params.fullName,
          role: params.role,
          institution_id: params.institutionId,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  // Fetch the user's application profile from public.profiles
  async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) return null;

      const profileRow = data as any;
      return {
        id: profileRow.id,
        email: profileRow.email,
        fullName: profileRow.full_name,
        role: profileRow.role as UserRole,
        institutionId: profileRow.institution_id || '',
        avatarUrl: profileRow.avatar_url || undefined,
        phone: profileRow.phone || undefined,
        department: profileRow.department || undefined,
        designation: profileRow.designation || undefined,
        memberId: profileRow.member_id || undefined,
        status: (profileRow.status as any) || 'Active',
      };
    } catch (err) {
      console.warn('Failed to fetch user profile:', err);
      return null;
    }
  },

  // Get current active session
  async getSession() {
    const supabase = getSupabaseClient();
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  // Sign out
  async signOut() {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  },
};
