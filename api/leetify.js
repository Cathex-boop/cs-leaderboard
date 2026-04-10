// api/leetify.js — Vercel Serverless Function
// Stores the Leetify API Key as environment variable LEETIFY_API_KEY

export default async function handler(req, res) {
  const path = req.query.path;
  if (!path) return res.status(400).json({ error: "Missing path" });

  const apiKey = process.env.LEETIFY_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "LEETIFY_API_KEY not configured" });

  try {
    const upstream = await fetch("https://api.cs-prod.leetify.com" + path, {
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      }
    });

    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
