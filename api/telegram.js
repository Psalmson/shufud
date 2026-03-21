const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const TIER_LIMITS = { free: 2, smart_cook: 5, pro_chef: 999 };

const SYSTEM_PROMPT = `You are Shufud, a friendly Telegram recipe assistant with deep knowledge of Nigerian and West African cuisine.
When given a list of ingredients, suggest 2 recipes. ALWAYS include at least 1 Nigerian or West African dish if the ingredients can support it.
Great Nigerian dishes to suggest: Jollof Rice, Egusi Soup, Pepper Soup, Efo Riro, Moi Moi, Suya, Akara, Puff Puff, Ofada Stew, Banga Soup, Ofe Onugbu, Fried Plantain (Dodo), Ogbono Soup, Oha Soup, Eba & Soup, Tuwo Shinkafa, Fried Rice (Nigerian style), Ofe Akwu, Abacha (African Salad).
If the ingredients include palm oil, crayfish, stockfish, ugwu, ogiri, iru, yam, or plantain — lean into 2 Nigerian recipes.
Format your response clearly for Telegram using emojis. Use this structure for each recipe:
🍽 *Recipe Name* 🇳🇬 (add flag for Nigerian dishes)
⏱ Time: X mins | 📊 Difficulty: Easy/Medium
📝 Description: One sentence.
🛒 You'll also need: [any extra ingredients not in their list]
👨‍🍳 Steps:
1. Step one
2. Step two
3. Step three
---
Be culturally authentic. Keep responses friendly and encouraging!`;

// ── Telegram API helper ────────────────────────────────────────────────────
const tg = async (method, body) => {
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return res.json();
};

// ── Supabase helpers ───────────────────────────────────────────────────────
const sbGet = async (table, filters) => {
  const params = new URLSearchParams(filters);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  });
  return res.json();
};

const sbPatch = async (table, filters, body) => {
  const params = new URLSearchParams(filters);
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify(body)
  });
};

// ── Generate OTP ───────────────────────────────────────────────────────────
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ── Send OTP email via Resend ──────────────────────────────────────────────
const sendOTPEmail = async (email, otp) => {
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: "Shufud <noreply@mail-shufud.thord.co>",
      to: email,
      subject: "Your Shufud Telegram verification code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #2E5339; font-size: 1.4rem;">🍳 Shufud Telegram Verification</h2>
          <p style="color: #4a6655; font-size: 1rem; line-height: 1.6;">
            Someone is trying to link this email to a Shufud Telegram account.
            If this was you, use the code below:
          </p>
          <div style="background: #f0f5f1; border: 2px solid #d4e2d8; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
            <div style="font-size: 2.5rem; font-weight: 700; color: #2E5339; letter-spacing: 0.2em;">${otp}</div>
            <div style="color: #4a6655; font-size: 0.85rem; margin-top: 8px;">Expires in 10 minutes</div>
          </div>
          <p style="color: #9ab5a2; font-size: 0.82rem;">If you didn't request this, ignore this email.</p>
        </div>
      `
    })
  });
};

// ── Claude API ─────────────────────────────────────────────────────────────
const callClaude = async (ingredients) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `I have these ingredients: ${ingredients}\nSuggest 2 recipes I can make.` }]
    })
  });
  const data = await res.json();
  return data.content?.[0]?.text || "Sorry, I couldn't generate recipes right now.";
};

// ── Check and update daily usage ───────────────────────────────────────────
const checkAndUpdateUsage = async (userId, dailyLimit) => {
  const today = new Date().toISOString().split("T")[0];
  const usage = await sbGet("usage_tracking", { user_id: `eq.${userId}`, date: `eq.${today}`, select: "*" });
  const current = usage?.[0];
  const count = current?.count || 0;

  if (count >= dailyLimit) return { allowed: false, count, limit: dailyLimit };

  if (current) {
    await sbPatch("usage_tracking", { user_id: `eq.${userId}`, date: `eq.${today}` }, { count: count + 1 });
  } else {
    await fetch(`${SUPABASE_URL}/rest/v1/usage_tracking`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({ user_id: userId, date: today, count: 1 })
    });
  }

  return { allowed: true, count: count + 1, limit: dailyLimit };
};

// ── Handle incoming Telegram message ──────────────────────────────────────
const handleMessage = async (message) => {
  const chatId = message.chat.id.toString();
  const text = (message.text || "").trim();
  const sendMsg = (msg, extra = {}) => tg("sendMessage", { chat_id: chatId, text: msg, parse_mode: "Markdown", ...extra });

  // ── /start ──────────────────────────────────────────────────────────────
  if (text === "/start") {
    return sendMsg(
      "👨‍🍳 *Welcome to Shufud!*\n\n" +
      "I can suggest Nigerian & African recipes based on what you have at home.\n\n" +
      "To get started, I need to verify your Shufud account.\n" +
      "Please send me your registered email address."
    );
  }

  // ── /help ────────────────────────────────────────────────────────────────
  if (text === "/help") {
    return sendMsg(
      "🍳 *Shufud Help* 🇳🇬\n\n" +
      "*Commands:*\n" +
      "`/recipe <ingredients>` — Get recipe suggestions\n" +
      "`/unlink` — Unlink your account\n" +
      "`/help` — Show this message\n\n" +
      "*Examples:*\n" +
      "`/recipe palm oil, egusi, stockfish`\n" +
      "`/recipe chicken, tomatoes, onions`\n\n" +
      "*Tips:*\n" +
      "• Separate ingredients with commas\n" +
      "• Add dietary needs: `/recipe tofu, spinach - make it vegan`"
    );
  }

  // ── Look up profile by telegram_chat_id ──────────────────────────────────
  const profiles = await sbGet("profiles", { telegram_chat_id: `eq.${chatId}`, select: "*" });
  const profile = profiles?.[0];

  // ── /unlink ──────────────────────────────────────────────────────────────
  if (text === "/unlink") {
    if (!profile) return sendMsg("You don't have a linked account.");
    await sbPatch("profiles", { telegram_chat_id: `eq.${chatId}` }, {
      telegram_chat_id: null,
      telegram_otp: null,
      telegram_otp_expires_at: null
    });
    return sendMsg("✅ Your account has been unlinked. Send your email to link again.");
  }

  // ── Not verified — handle verification flow ───────────────────────────────
  if (!profile) {
    // Check if this looks like an OTP (6 digits)
    if (/^\d{6}$/.test(text)) {
      // Find profile with matching OTP
      const otpProfiles = await sbGet("profiles", { telegram_otp: `eq.${text}`, select: "*" });
      const otpProfile = otpProfiles?.[0];

      if (!otpProfile) {
        return sendMsg("❌ Invalid code. Please check and try again, or send your email to restart.");
      }

      // Check expiry
      const expires = new Date(otpProfile.telegram_otp_expires_at);
      if (new Date() > expires) {
        return sendMsg("⏱ That code has expired. Send your email address again to get a new one.");
      }

      // Link account
      await sbPatch("profiles", { id: `eq.${otpProfile.id}` }, {
        telegram_chat_id: chatId,
        telegram_otp: null,
        telegram_otp_expires_at: null
      });

      const tierLabels = { free: "Free", smart_cook: "Smart Cook", pro_chef: "Pro Chef" };
      const tier = otpProfile.tier || "free";
      const limit = TIER_LIMITS[tier] || 2;

      return sendMsg(
        "✅ *Account linked successfully!*\n\n" +
        `📊 Your plan: *${tierLabels[tier]}*\n` +
        `🍽 Daily recipe limit: *${limit === 999 ? "Unlimited" : limit + "/day"}*\n\n` +
        "You're all set! Try:\n`/recipe palm oil, tomatoes, stockfish`"
      );
    }

    // Check if this looks like an email
    if (text.includes("@")) {
      const email = text.toLowerCase().trim();
      // Find profile by email via auth users
      const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?per_page=1000`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
      });
      const authData = await authRes.json();
      const user = authData.users?.find(u => u.email?.toLowerCase() === email);

      if (!user) {
        return sendMsg(
          "❌ No Shufud account found with that email.\n\n" +
          "Please make sure you're using the same email you registered with at shufud.vercel.app"
        );
      }

      // Check tier — free trial expired?
      const userProfiles = await sbGet("profiles", { id: `eq.${user.id}`, select: "*" });
      const userProfile = userProfiles?.[0];
      const tier = userProfile?.tier || "free";

      if (tier === "free") {
        const created = new Date(user.created_at);
        const daysUsed = Math.floor((Date.now() - created) / (1000 * 60 * 60 * 24));
        if (daysUsed > 7) {
          return sendMsg(
            "⚠️ Your free trial has expired.\n\n" +
            "Upgrade your plan at shufud.vercel.app to use Shufud on Telegram."
          );
        }
      }

      // Generate and store OTP
      const otp = generateOTP();
      const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      await sbPatch("profiles", { id: `eq.${user.id}` }, {
        telegram_otp: otp,
        telegram_otp_expires_at: expires
      });

      // Send OTP email
      await sendOTPEmail(email, otp);

      return sendMsg(
        "📧 *Verification code sent!*\n\n" +
        `A 6-digit code has been sent to *${email}*.\n\n` +
        "Please check your inbox and send me the code."
      );
    }

    // Unknown message — prompt for email
    return sendMsg(
      "👋 To use Shufud, please verify your account first.\n\n" +
      "Send me your registered email address at shufud.vercel.app"
    );
  }

  // ── Verified user — handle recipe commands ────────────────────────────────
  const tier = profile.tier || "free";

  // Check trial expiry for free users
  if (tier === "free") {
    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${profile.id}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    const userData = await authRes.json();
    const created = new Date(userData.created_at);
    const daysUsed = Math.floor((Date.now() - created) / (1000 * 60 * 60 * 24));
    if (daysUsed > 7) {
      return sendMsg(
        "⚠️ *Your free trial has expired.*\n\n" +
        "Upgrade your plan at shufud.vercel.app to continue using Shufud."
      );
    }
  }

  // Check subscription expiry for paid users
  if (tier !== "free" && profile.tier_expires_at) {
    const expired = new Date(profile.tier_expires_at) < new Date();
    if (expired) {
      await sbPatch("profiles", { id: `eq.${profile.id}` }, { tier: "free", tier_expires_at: null });
      return sendMsg(
        "⚠️ *Your subscription has expired.*\n\n" +
        "Renew your plan at shufud.vercel.app to continue using Shufud."
      );
    }
  }

  const dailyLimit = TIER_LIMITS[tier] || 2;

  // ── /recipe command ──────────────────────────────────────────────────────
  const isRecipeCommand = text.startsWith("/recipe");
  const isIngredientMessage = text.includes(",") || (text.split(" ").length <= 8 && !text.startsWith("/"));

  if (isRecipeCommand || isIngredientMessage) {
    const ingredients = isRecipeCommand
      ? text.replace("/recipe", "").trim()
      : text;

    if (!ingredients) {
      return sendMsg(
        "Please tell me your ingredients!\n" +
        "Example: `/recipe palm oil, tomatoes, stockfish`"
      );
    }

    // Check daily limit
    const usage = await checkAndUpdateUsage(profile.id, dailyLimit);
    if (!usage.allowed) {
      return sendMsg(
        `⚠️ *Daily limit reached!*\n\n` +
        `You've used your ${dailyLimit} recipe suggestion${dailyLimit !== 1 ? "s" : ""} for today.\n` +
        `Come back tomorrow or upgrade at shufud.vercel.app 🍽`
      );
    }

    await tg("sendChatAction", { chat_id: chatId, action: "typing" });

    const reply = await callClaude(ingredients);
    const remaining = usage.limit === 999 ? "∞" : `${usage.limit - usage.count} remaining today`;

    return sendMsg(
      `🧑‍🍳 *Recipes for:* _${ingredients}_\n\n${reply}\n\n` +
      `_📊 ${remaining}_`
    );
  }

  // ── Unknown command ──────────────────────────────────────────────────────
  return sendMsg(
    "I'm not sure what you mean 😊\n\n" +
    "Try: `/recipe palm oil, tomatoes, stockfish`\n" +
    "Or use /help for more options."
  );
};

// ── Main handler ───────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(200).json({ ok: true });

  try {
    const { message } = req.body;
    if (message) await handleMessage(message);
  } catch (err) {
    console.error("Telegram webhook error:", err);
  }

  return res.status(200).json({ ok: true });
}
