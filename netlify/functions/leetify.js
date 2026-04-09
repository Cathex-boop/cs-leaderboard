const https = require("https");

exports.handler = async function (event) {
  const steamId = event.queryStringParameters && event.queryStringParameters.steamId;

  if (!steamId) {
    return { statusCode: 400, body: JSON.stringify({ error: "steamId fehlt" }) };
  }

  const data = await new Promise((resolve, reject) => {
    const options = {
      hostname: "api.cs-prod.leetify.com",
      path: `/api/profile/${steamId}`,
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; CS2Leaderboard/1.0)",
        "Accept": "application/json"
      }
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", chunk => body += chunk);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body }); }
        catch(e) { reject(e); }
      });
    });

    req.on("error", reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error("Timeout")); });
    req.end();
  });

  return {
    statusCode: data.status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: data.body
  };
};
