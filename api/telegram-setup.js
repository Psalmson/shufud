export default async function handler(req, res) {
  const token = process.env.TELEGRAM_TOKEN;
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
}
```

---

Commit both files, then **register the webhook** by visiting this URL once in your browser:
```
https://shufud.vercel.app/api/telegram-setup
