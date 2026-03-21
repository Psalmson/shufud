export default async function handler(req, res) {
  try {
    const token = process.env.TELEGRAM_TOKEN;
    if (!token) return res.status(500).json({ error: "TELEGRAM_TOKEN not set" });

    const webhookUrl = `https://shufud.vercel.app/api/telegram`;

    const response = await fetch(
      `https://api.telegram.org/bot${token}/setWebhook`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: webhookUrl })
      }
    );

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
