async function loadLeaderboard() {
  const btn = document.getElementById("refreshBtn");
  const container = document.getElementById("leaderboard-container");
  btn.disabled = true;
  btn.textContent = "Lädt...";

  container.innerHTML = `<div class="loading"><div class="spinner"></div><p>Lade Daten von Leetify...</p></div>`;

  try {
    const res = await fetch("/.netlify/functions/leaderboard");
    if (!res.ok) throw new Error("API Fehler: " + res.status);
    const data = await res.json();

    if (data.updatedAt) {
      const d = new Date(data.updatedAt);
      document.getElementById("updatedAt").textContent =
        "Zuletzt aktualisiert: " + d.toLocaleString("de-DE");
    }

    renderLeaderboard(data.players);
  } catch (err) {
    container.innerHTML = `<div class="error-msg">⚠️ Daten konnten nicht geladen werden.<br><small>${err.message}</small></div>`;
  }

  btn.disabled = false;
  btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Aktualisieren`;
}

function renderLeaderboard(players) {
  const container = document.getElementById("leaderboard-container");

  const top3 = players.slice(0, 3);
  const rest = players.slice(3);

  let podiumHTML = `<div class="podium">`;
  const podiumOrder = top3.length === 3 ? [1, 0, 2] : top3.map((_, i) => i);
  podiumOrder.forEach(i => {
    if (!top3[i]) return;
    const p = top3[i];
    const rank = i + 1;
    podiumHTML += `
      <div class="podium-card rank-${rank}">
        <div class="podium-rank">#${rank}</div>
        ${p.avatar ? `<img class="podium-avatar" src="${p.avatar}" alt="${p.displayName}" onerror="this.style.display='none'"/>` : `<div class="podium-avatar"></div>`}
        <div class="podium-name">${p.displayName}</div>
        <div class="podium-rating">${p.premierRating != null ? p.premierRating.toLocaleString("de-DE") : "—"}</div>
        <
