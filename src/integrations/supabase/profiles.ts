
import { supabase } from './client';

export interface UserProfile {
    id: string;
    name: string;
    birthdate: Date | string;
    gender: string;
    onboarding_completed: boolean;
    has_seen_welcome: boolean;
    goals?: string[];
    created_at?: string;
    updated_at?: string;
}

/**
 * Create a new user profile or update an existing one
 */
export async function upsertProfile(profile: Omit<UserProfile, 'created_at' | 'updated_at'>) {
    // Ensure user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        throw new Error('User must be authenticated to update profile');
    }

    // Ensure profile ID matches authenticated user ID (for security)
    // This is critical for RLS policies to work correctly
    if (profile.id !== session.user.id) {
        throw new Error('Profile ID must match authenticated user ID');
    }

    // Convert Date object to ISO string if birthdate is a Date
    const birthdate = profile.birthdate instanceof Date 
        ? profile.birthdate.toISOString().split('T')[0] // Format as YYYY-MM-DD
        : profile.birthdate;

    const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
            id: profile.id,
            name: profile.name,
            birthdate: birthdate,
            gender: profile.gender,
            onboarding_completed: profile.onboarding_completed,
            goals: profile.goals || [],
            has_seen_welcome: profile.has_seen_welcome
        }, {
            onConflict: 'id'
        });

    if (error) {
        console.error('Error upserting profile:', error);
        throw error;
    }

    return data;
}

/**
 * Get a user profile by ID
 */
export async function getProfile(userId: string): Promise<UserProfile | null> {
    // Ensure we're requesting the current user's profile due to RLS
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || (userId !== session.user.id)) {
        console.warn('Attempted to access profile that does not belong to the current user');
        return null;
    }

    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // PGRST116 = No rows returned, meaning no profile found
            return null;
        }
        console.error('Error fetching profile:', error);
        throw error;
    }

    return data as UserProfile;
}

/**
 * Check if a user has completed onboarding
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
    try {
        const profile = await getProfile(userId);
        return !!profile?.onboarding_completed;
    } catch (error) {
        console.error('Error checking onboarding status:', error);
        return false;
    }
}

/**
 * Mark a user's onboarding as complete
 */
export async function completeOnboarding(userId: string): Promise<void> {
    // Additional security check to ensure user can only update their own onboarding status
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || (userId !== session.user.id)) {
        throw new Error('User can only update their own onboarding status');
    }

    const { error } = await supabase
        .from('user_profiles')
        .update({ onboarding_completed: true })
        .eq('id', userId);

    if (error) {
        console.error('Error completing onboarding:', error);
        throw error;
    }
}
