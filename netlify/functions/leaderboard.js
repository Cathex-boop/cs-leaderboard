const fetch = require("node-fetch");
const players = require("../../players.json");

const LEETIFY_BASE = "https://api.cs-prod.leetify.com/api/profile/";

exports.handler = async function (event, context) {
  try {
    const results = await Promise.all(
      players.map(async (player) => {
        try {
          const res = await fetch(`${LEETIFY_BASE}${player.steamId64}`);
          if (!res.ok) throw new Error("Leetify fetch failed");
          const data = await res.json();

          const meta = data.meta || {};
          const recentGames = data.recentGames || [];
          const games = data.games || [];

          const wins = games.filter(g => g.won === true).length;
          const totalGames = games.length;
          const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : null;

          const avgKd = recentGames.length > 0
            ? (recentGames.reduce((sum, g) => sum + (g.kdRatio || 0), 0) / recentGames.length).toFixed(2)
            : null;

          const avgAdr = recentGames.length > 0
            ? (recentGames.reduce((sum, g) => sum + (g.adr || 0), 0) / recentGames.length).toFixed(1)
            : null;

          return {
            steamId64: player.steamId64,
            displayName: player.displayName,
            avatar: meta.avatarUrl || null,
            steamName: meta.name || player.displayName,
            premierRating: meta.csRating || null,
            kd: avgKd,
            adr: avgAdr,
            winRate: winRate,
            totalGames: totalGames,
            leetifyUrl: `https://leetify.com/app/profile/${player.steamId64}`
          };
        } catch (err) {
          return {
            steamId64: player.steamId64,
            displayName: player.displayName,
            avatar: null,
            steamName: player.displayName,
            premierRating: null,
            kd: null,
            adr: null,
            winRate: null,
            totalGames: null,
            leetifyUrl: `https://leetify.
