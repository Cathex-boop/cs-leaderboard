// api/steam-avatar.js
const https = require("https");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const steamId = req.query.steamId;
  if (!steamId) return res.status(400).json({ error: "Missing steamId" });

  const url = "https://steamcommunity.com/profiles/" + steamId + "/?xml=1";

  try {
    const response = await new Promise((resolve, reject) => {
      https.get(url, {
        headers: { "User-Agent": "CS2-Leaderboard/1.0" }
      }, (apiRes) => {
        let data = "";
        apiRes.on("data", chunk => data += chunk);
        apiRes.on("end", () => resolve(data));
      }).on("error", reject);
    });

    // Parse avatarFull from XML: <avatarFull>https://...</avatarFull>
    const match = response.match(/<avatarFull><!\[CDATA\[(.*?)\]\]><\/avatarFull>/);
    const avatar = match ? match[1] : null;

    res.status(200).json({ avatar });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
