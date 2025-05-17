
import { supabase } from './client';

export interface UserProfile {
    id: string;
    name: string;
    birthdate: Date | string;
    gender: string;
    onboarding_completed: boolean;
    created_at?: string;
    updated_at?: string;
}

/**
 * Create a new user profile or update an existing one
 */
export async function upsertProfile(profile: Omit<UserProfile, 'created_at' | 'updated_at'>) {
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
            onboarding_completed: profile.onboarding_completed
        }, {
            onConflict: 'id'
        });

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Get a user profile by ID
 */
export async function getProfile(userId: string): Promise<UserProfile | null> {
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
        throw error;
    }

    return data;
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
    const { error } = await supabase
        .from('user_profiles')
        .update({ onboarding_completed: true })
        .eq('id', userId);

    if (error) {
        throw error;
    }
} 
