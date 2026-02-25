import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Generic hook to fetch the latest row for a specific table by session_id,
// and to insert a new row back into that table.
export function useSupabaseForm<T extends Record<string, any>>(tableName: string) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch the latest entry for a given session
    const fetchLatestEntry = useCallback(async (sessionId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from(tableName)
                .select('*')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle(); // Returns null gracefully if 0 rows exist

            if (fetchError) {
                console.error(`Error fetching from ${tableName}:`, fetchError);
                setError(fetchError.message);
                return null;
            }

            return data as T;
        } catch (err) {
            console.error(`Unexpected error fetching from ${tableName}:`, err);
            setError('An unexpected error occurred while fetching data.');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [tableName]);

    // Insert a new entry (append-only)
    const saveEntry = useCallback(async (sessionId: string, formData: T) => {
        setIsLoading(true);
        setError(null);
        try {
            // Include the session_id with the payload
            const payload = { ...formData, session_id: sessionId };

            const { error: insertError } = await supabase
                .from(tableName)
                // Upsert updates the row if session_id already exists, preventing duplicates
                .upsert([payload], { onConflict: 'session_id' });

            if (insertError) {
                console.error(`Error inserting into ${tableName}:`, insertError);
                setError(insertError.message);
                return false;
            }

            return true;
        } catch (err) {
            console.error(`Unexpected error saving to ${tableName}:`, err);
            setError('An unexpected error occurred while saving data.');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [tableName]);

    return { fetchLatestEntry, saveEntry, isLoading, error };
}
