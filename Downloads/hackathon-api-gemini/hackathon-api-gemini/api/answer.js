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
    const apiKey = process.env.GEMINI_API_KEY;

    let prompt = `Answer the following question directly and concisely.
For math questions, answer in the format "The sum/difference/product/quotient is X."
Do not add any preamble or explanation unless asked.
Question: ${query}`;

    if (assets && assets.length > 0) {
      prompt += `\nRelevant assets: ${assets.join(", ")}`;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 512 },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Gemini API error");
    }

    const output = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    return res.status(200).json({ output });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
