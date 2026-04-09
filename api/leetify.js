module.exports = async function handler(req, res) {
  const steamId = req.query.steamId;
  if (!steamId) return res.status(400).json({ error: "steamId fehlt" });

  const key = process.env.STEAM_API_KEY;

  const summaryUrl = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=" + key + "&steamids=" + steamId;
  const statsUrl   = "https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/?key=" + key + "&steamid=" + steamId + "&appid=730";

  const [sRes, stRes] = await Promise.all([fetch(summaryUrl), fetch(statsUrl)]);
  const sData  = await sRes.json();
  const stData = await stRes.json();

  const player = (sData.response && sData.response.players && sData.response.players[0]) || {};
  const stats  = (stData.playerstats && stData.playerstats.stats) || [];

  function g(name) {
    var s = stats.find(function(x){ return x.name === name; });
    return s ? s.value : null;
  }

  var kills   = g("total_kills");
  var deaths  = g("total_deaths");
  var hs      = g("total_kills_headshot");
  var wins    = g("total_wins_map") !== null ? g("total_wins_map") : g("total_matches_won");
  var matches = g("total_matches_played");
  var time    = g("total_time_played");
  var rounds  = g("total_rounds_played");
  var dmg     = g("total_damage_done");

  var kd       = (kills !== null && deaths !== null && deaths > 0) ? (kills / deaths).toFixed(2) : null;
  var hsPct    = (kills !== null && hs !== null && kills > 0) ? ((hs / kills) * 100).toFixed(1) : null;
  var winRate  = (matches !== null && wins !== null && matches > 0) ? ((wins / matches) * 100).toFixed(1) : null;
  var adr      = (dmg !== null && rounds !== null && rounds > 0) ? (dmg / rounds).toFixed(1) : null;
  var hours    = time !== null ? Math.round(time / 3600) : null;

  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).json({
    steamId64:  steamId,
    steamName:  player.personaname || null,
    avatar:     player.avatarfull  || null,
    profileUrl: player.profileurl  || null,
    kd: kd,
    hsPercent: hsPct,
    winRate: winRate,
    adr: adr,
    kills: kills,
    wins: wins,
    hoursPlayed: hours,
    totalMatches: matches
  });
};
