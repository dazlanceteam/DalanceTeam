import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/**
 * Example Deno Edge Function to notify an external webhook
 * when a user completes the onboarding pipeline (Step 3).
 * 
 * To deploy: supabase functions deploy notify-completion
 * To set webhook URL secretly (optional): supabase secrets set WEBHOOK_URL=https://testIsuru.site
 */

const WEBHOOK_URL = Deno.env.get("WEBHOOK_URL") || "https://testIsuru.site";

serve(async (req) => {
    try {
        // Parse the incoming request body (e.g. from a Supabase Database Webhook trigger on the "Finish" table)
        const payload = await req.json();

        // Check if this is an INSERT event into the Finish table
        if (payload.type === 'INSERT' && payload.table === 'Finish') {
            const { session_id, Payment_method, Work_capacity } = payload.record;

            console.log(`User finished onboarding. Session ID: ${session_id}`);

            // Send notification to the external webhook
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'onboarding_completed',
                    session_id,
                    payment_method: Payment_method,
                    work_capacity: Work_capacity,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`Webhook failed with status: ${response.status}`);
            }

            return new Response(
                JSON.stringify({ success: true, message: "Webhook notified successfully" }),
                { headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: "Ignored unrelated event" }),
            { headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }
});
