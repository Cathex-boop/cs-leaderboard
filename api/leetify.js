// api/leetify.js
const https = require("https");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  let path = req.query.path ? decodeURIComponent(req.query.path) : null;
  if (!path) return res.status(400).json({ error: "Missing path" });

  const apiKey = process.env.LEETIFY_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "LEETIFY_API_KEY not set" });

  // Leetify public API: strip /api prefix — endpoint is /profiles/{steamId}, not /api/profiles/{steamId}
  if (path.startsWith("/api/")) {
    path = path.replace("/api/", "/");
  }

  const url = "https://api.cs-prod.leetify.com" + path;

  try {
    const response = await new Promise((resolve, reject) => {
      const options = {
        headers: {
          "Authorization": "Bearer " + apiKey,
          "Content-Type": "application/json",
          "User-Agent": "CS2-Leaderboard/1.0"
        }
      };
      https.get(url, options, (apiRes) => {
        let data = "";
        apiRes.on("data", chunk => data += chunk);
        apiRes.on("end", () => resolve({ status: apiRes.statusCode, body: data }));
      }).on("error", reject);
    });

    // Return status + body for debugging, plus actual URL on error
    if (response.status >= 400) {
      res.status(response.status).json({ error: "Upstream error", status: response.status, url: url, body: response.body });
    } else {
      res.status(response.status).setHeader("Content-Type", "application/json").end(response.body);
    }
  } catch (e) {
    res.status(500).json({ error: e.message, url: url });
  }
};
