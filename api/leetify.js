module.exports = async function handler(req, res) {
  const { steamId } = req.query;

  if (!steamId) {
    return res.status(400).json({ error: "steamId fehlt" });
  }

  const apiKey = process.env.STEAM_API_KEY;

  try {
    const summaryRes = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`
    );
    const summaryData = await summaryRes.json();
    const player = (summaryData?.response?.players || [])[0] || {};

    const statsRes = await fetch(
      `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/?key=${apiKey}&steamid=${steamId}&appid=730`
    );
    const statsData = await statsRes.json();
    const stats = statsData?.playerstats?.stats || [];

    const getStat = (name) => {
      const found = stats.find(s => s.name === name);
      return found ? found.value : null;
    };

    const kills        = getStat("total_kills");
    const deaths       = getStat("total_deaths");
    const wins         = getStat("total_wins_map") ?? getStat("total_matches_won");
    const headshots    = getStat("total_kills_headshot");
    const timePlayed   = getStat("total_time_played");
    const totalRounds  = getStat("total_rounds_played");
    const totalMatches = getStat("total_matches_played");
    const damage       = getStat("total_damage_done");

    const kd = kills != null && deaths != null && deaths > 0
      ? (kills / deaths).toFixed(2) : null;

    const hsPercent = kills != null && headshots != null && kills > 0
      ? ((headshots / kills) * 100).toFixed(1) : null;

    const winRate = totalMatches != null && wins != null && totalMatches > 0
      ? ((wins / totalMatches) * 100).toFixed(1) : null;

    const adr = damage != null && totalRounds != null && totalRounds > 0
      ? (damage / totalRounds).toFixed(1) : null;

    const hoursPlayed = timePlayed != null
      ? Math.round(timePlayed / 3600) : null;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.set
