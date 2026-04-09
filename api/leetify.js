export default async function handler(req, res) {
  const { steamId } = req.query;

  if (!steamId) {
    return res.status(400).json({ error: "steamId fehlt" });
  }

  try {
    const response = await fetch(`https://api.cs-prod.leetify.com/api/profile/${steamId}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; CS2Leaderboard/1.0)",
        "Accept": "application/json"
      }
    });

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    return res.status(response.status).json(data);
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
