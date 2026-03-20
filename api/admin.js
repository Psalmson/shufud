const ADMIN_EMAILS = ["psalmsonlarinre@gmail.com"];

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: "Server not configured" });
  }

  // Verify admin
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.replace("Bearer ", "");
  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: supabaseKey }
  });
  const userData = await userRes.json();
  if (!userData?.email || !ADMIN_EMAILS.includes(userData.email)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { action } = req.query;

  // ── GET all users ──────────────────────────────────────────────────────────
  if (req.method === "GET" && action === "users") {
    try {
      const [authRes, profilesRes, usageRes] = await Promise.all([
        fetch(`${supabaseUrl}/auth/v1/admin/users?per_page=1000`, {
          headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
        }),
        fetch(`${supabaseUrl}/rest/v1/profiles?select=*`, {
          headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
        }),
        fetch(`${supabaseUrl}/rest/v1/usage_tracking?select=*&date=eq.${new Date().toISOString().split("T")[0]}`, {
          headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
        })
      ]);

      const authData = await authRes.json();
      const profiles = await profilesRes.json();
      const usage = await usageRes.json();

      // Active auth users
      const activeAuthIds = new Set((authData.users || []).map(u => u.id));

      // Merge active auth users with profiles
      const activeUsers = (authData.users || []).map(u => {
        const profile = profiles.find(p => p.id === u.id) || {};
        const todayUsage = usage.find(us => us.user_id === u.id);
        const createdAt = new Date(u.created_at);
        const trialDaysLeft = Math.max(0, 7 - Math.floor((Date.now() - createdAt) / (1000 * 60 * 60 * 24)));
        return {
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          last_sign_in: u.last_sign_in_at,
          display_name: profile.display_name || null,
          tier: profile.tier || "free",
          tier_expires_at: profile.tier_expires_at || null,
          tier_updated_at: profile.tier_updated_at || null,
          is_admin: profile.is_admin || false,
          total_recipes: profile.total_recipes_generated || 0,
          usage_today: todayUsage?.count || 0,
          trial_days_left: trialDaysLeft,
          trial_expired: trialDaysLeft === 0 && (profile.tier || "free") === "free",
          deleted: false
        };
      });

      // Deleted profiles (not in active auth users)
      const deletedProfiles = profiles.filter(p => p.deleted === true);
      const deletedUsers = deletedProfiles.map(p => ({
        id: p.id,
        email: p.email || "—",
        created_at: p.created_at,
        last_sign_in: null,
        display_name: p.display_name || null,
        tier: p.tier || "free",
        tier_expires_at: null,
        tier_updated_at: p.tier_updated_at || null,
        is_admin: false,
        total_recipes: p.total_recipes_generated || 0,
        usage_today: 0,
        trial_days_left: 0,
        trial_expired: true,
        deleted: true,
        deleted_at: p.deleted_at
      }));

      return res.status(200).json({ users: [...activeUsers, ...deletedUsers] });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── POST update tier ───────────────────────────────────────────────────────
  if (req.method === "POST" && action === "update_tier") {
    const { user_id, tier } = req.body;
    if (!user_id || !tier) return res.status(400).json({ error: "user_id and tier required" });
    const validTiers = ["free", "commis", "sous", "head"];
    if (!validTiers.includes(tier)) return res.status(400).json({ error: "Invalid tier" });

    try {
      await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${user_id}`, {
        method: "PATCH",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          tier,
          tier_updated_at: new Date().toISOString(),
          tier_expires_at: tier === "free" ? null : new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString()
        })
      });
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── POST restore account ───────────────────────────────────────────────────
  if (req.method === "POST" && action === "restore") {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: "user_id required" });
    try {
      await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${user_id}`, {
        method: "PATCH",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({ deleted: false, deleted_at: null })
      });
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(404).json({ error: "Unknown action" });
}
