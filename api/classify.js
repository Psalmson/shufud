export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const { ingredients, categories } = req.body;
  if (!ingredients?.length) return res.status(400).json({ error: "No ingredients provided" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: `You are a Nigerian kitchen ingredient classifier. Given a list of ingredients and categories, classify each ingredient into the most appropriate category. Be smart about Nigerian/African ingredients like ugwu, iru, crayfish, stockfish, egusi etc.
Respond ONLY with valid JSON in this exact format:
{
  "classified": {
    "category_key": ["ingredient1", "ingredient2"],
    "another_key": ["ingredient3"]
  }
}
Only use the category keys provided. Put unrecognised items in "others".`,
        messages: [{
          role: "user",
          content: `Ingredients to classify: ${ingredients.join(", ")}
          
Categories available: ${JSON.stringify(categories.map(c => ({ key: c.key, label: c.label })))}`
        }]
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: "Classification failed" });

    const text = data.content?.map(b => b.text || "").join("") || "";
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
