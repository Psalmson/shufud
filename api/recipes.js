export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: "Supabase not configured" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.replace("Bearer ", "");

  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: supabaseKey }
  });

  const userData = await userRes.json();
  if (!userData?.id) return res.status(401).json({ error: "Invalid session" });

  const { model, max_tokens, system, messages, bypass_limit } = req.body;

  // ── Bypassed — call Claude directly without limit check ───────────────────
  if (bypass_limit) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({ model, max_tokens, system, messages })
      });
      const data = await response.json();
      if (!response.ok) return res.status(response.status).json({ error: "Claude API error", details: data });
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: "Server error", details: err.message });
    }
  }

  // ── Daily limit check ─────────────────────────────────────────────────────
  const userId = userData.id;
  const today = new Date().toISOString().split("T")[0];
  const DAILY_LIMIT = 2;

  const usageRes = await fetch(
    `${supabaseUrl}/rest/v1/usage_tracking?user_id=eq.${userId}&date=eq.${today}`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json"
      }
    }
  );

  const usageData = await usageRes.json();
  const currentUsage = usageData?.[0];
  const currentCount = currentUsage?.count || 0;

  if (currentCount >= DAILY_LIMIT) {
    return res.status(429).json({
      error: "daily_limit_reached",
      message: `You've used your ${DAILY_LIMIT} free recipe suggestions for today. Come back tomorrow!`,
      count: currentCount,
      limit: DAILY_LIMIT
    });
  }

  // ── Call Claude API ────────────────────────────────────────────────────────
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({ model, max_tokens, system, messages })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: "Claude API error", details: data });

    // Update usage count
    if (currentUsage) {
      await fetch(
        `${supabaseUrl}/rest/v1/usage_tracking?user_id=eq.${userId}&date=eq.${today}`,
        {
          method: "PATCH",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal"
          },
          body: JSON.stringify({ count: currentCount + 1 })
        }
      );
    } else {
      await fetch(`${supabaseUrl}/rest/v1/usage_tracking`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({ user_id: userId, date: today, count: 1 })
      });
    }

    return res.status(200).json({
      ...data,
      usage_info: {
        count: currentCount + 1,
        limit: DAILY_LIMIT,
        remaining: DAILY_LIMIT - (currentCount + 1)
      }
    });

  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
