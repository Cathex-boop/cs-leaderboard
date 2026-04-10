// api/leetify.js
const https = require("https");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const steamId  = req.query.steamId;
  const endpoint = req.query.endpoint || "profile";
  if (!steamId) return res.status(400).json({ error: "Missing steamId" });

  const apiKey = process.env.LEETIFY_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "LEETIFY_API_KEY not set" });

  const url = "https://api-public.cs-prod.leetify.com/v3/" + endpoint + "?steamId=" + steamId;

  try {
    const response = await new Promise((resolve, reject) => {
      https.get(url, {
        headers: {
          "Authorization": "Bearer " + apiKey,
          "Content-Type": "application/json",
          "User-Agent": "CS2-Leaderboard/1.0"
        }
      }, (apiRes) => {
        let data = "";
        apiRes.on("data", chunk => data += chunk);
        apiRes.on("end", () => resolve({ status: apiRes.statusCode, body: data }));
      }).on("error", reject);
    });

    if (response.status >= 400) {
      res.status(response.status).json({ error: "Upstream error", status: response.status, url, body: response.body });
    } else {
      res.status(200).setHeader("Content-Type", "application/json").end(response.body);
    }
  } catch (e) {
    res.status(500).json({ error: e.message, url });
  }
};
