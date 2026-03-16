export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  await fetch(`${supabaseUrl}/rest/v1/usage_tracking?limit=1`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
  });

  res.status(200).json({ ok: true, pinged: new Date().toISOString() });
}
