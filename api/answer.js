export default async function handler(req, res) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { query, assets } = req.body || {};

  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    // Build context from assets if provided
    let assetContext = "";
    if (assets && assets.length > 0) {
      assetContext = `\nRelevant asset URLs provided: ${assets.join(", ")}`;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 1024,
        system: `You are a helpful assistant answering questions accurately and concisely.
Answer the question directly without any preamble or explanation unless asked.
Keep answers short and to the point.
For math questions, answer in the format "The sum/difference/product/quotient is X."${assetContext}`,
        messages: [{ role: "user", content: query }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Claude API error");
    }

    const output = data.content?.[0]?.text || "";

    return res.status(200).json({ output });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
