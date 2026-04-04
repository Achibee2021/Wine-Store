import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  // 1. Handle CORS for web requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const payload = await req.json()
    console.log("Payload received:", JSON.stringify(payload)) // This will show in your logs!

    // Supabase Webhooks wrap the data in a 'record' object
    const record = payload.record

    if (!record?.user_email) {
      console.error("No record or email found in payload")
      return new Response(JSON.stringify({ error: "Missing data" }), { status: 400 })
    }

    console.log(`Attempting to send email to: ${record.user_email}`)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'The Vintage Cellar <onboarding@resend.dev>', // Keep this for testing
        to: [record.user_email],
        subject: `Your Wine Order #${record.id.slice(0, 8)}`,
        html: `
          <div style="font-family: sans-serif; color: #4A0E0E;">
            <h1>Cheers! 🍷</h1>
            <p>Your order for <strong>€${record.total_amount}</strong> has been received.</p>
            <p>We are preparing your selection now.</p>
          </div>
        `,
      }),
    })

    const result = await res.json()
    console.log("Resend response:", JSON.stringify(result))

    return new Response(JSON.stringify(result), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    })

  } catch (err) {
    console.error("Function error:", err.message)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})