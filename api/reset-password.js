export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: "Server not configured" });
  }

  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: "Email and new password are required" });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  try {
    // ── Look up user by email via SQL ────────────────────────────────────────
    const lookupRes = await fetch(
      `${supabaseUrl}/rest/v1/rpc/get_user_id_by_email`,
      {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email_input: email.toLowerCase().trim() })
      }
    );

    // Fallback — search via auth admin list
    const listRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?per_page=1000`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        }
      }
    );

    const listData = await listRes.json();
    const user = listData?.users?.find(
      u => u.email?.toLowerCase() === email.toLowerCase().trim()
    );

    if (!user) {
      return res.status(404).json({ error: "No account found with that email address." });
    }

    // ── Update password ──────────────────────────────────────────────────────
    const updateRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users/${user.id}`,
      {
        method: "PUT",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: newPassword })
      }
    );

    const updateData = await updateRes.json();

    if (!updateRes.ok) {
      return res.status(400).json({ error: updateData.message || "Failed to update password" });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
