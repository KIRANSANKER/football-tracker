// =============================================
// Football Tracker - Tournament JS
// =============================================

const API = 'http://localhost:8080/api';
let currentTournamentId = null;
let currentTab          = 'matches';
let allTeams            = [];
let allPlayers          = [];

// =============================================
// THEME SWITCHER
// =============================================
const THEME_NAMES = {
  arctic: '☀️ Arctic',
  galaxy: '🔮 Galaxy'
};

function setTheme(theme, dot) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ft-theme', theme);
  document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
  if (dot) dot.classList.add('active');
  document.getElementById('themeName').textContent = THEME_NAMES[theme];
}

window.addEventListener('DOMContentLoaded', async () => {
  const saved = localStorage.getItem('ft-theme') || 'arctic';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('themeName').textContent = THEME_NAMES[saved];
  const dot = document.querySelector(`.dot-${saved}`);
  if (dot) { document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active')); dot.classList.add('active'); }

  // Load global data
  allTeams   = await apiFetch(`${API}/teams`).catch(() => []);
  allPlayers = await apiFetch(`${API}/players`).catch(() => []);

  loadTournaments();
});

// =============================================
// API FETCH
// =============================================
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' }, ...options
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return options.method === 'DELETE' ? null : res.json();
}

// =============================================
// MODAL
// =============================================
function openModal(title, bodyHTML) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

// =============================================
// VIEW MANAGEMENT
// =============================================
function showListView() {
  document.getElementById('view-list').classList.remove('hidden');
  document.getElementById('view-detail').classList.add('hidden');
  currentTournamentId = null;
  loadTournaments();
}

function showDetailView(id) {
  currentTournamentId = id;
  document.getElementById('view-list').classList.add('hidden');
  document.getElementById('view-detail').classList.remove('hidden');
  loadTournamentDetail(id);
}

function switchTab(tab, el) {
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  loadTabContent(tab);
}

// =============================================
// LOAD TOURNAMENTS LIST
// =============================================
async function loadTournaments() {
  document.getElementById('tournament-list').innerHTML =
    `<div class="loader">⚽ Loading tournaments...</div>`;
  const data = await apiFetch(`${API}/tournaments`).catch(() => []);

  const filter = document.getElementById('filterStatus').value;
  const filtered = filter ? data.filter(t => t.status === filter) : data;

  if (filtered.length === 0) {
    document.getElementById('tournament-list').innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="icon">🏆</div>
        <p>No tournaments found.</p>
        <button class="btn btn-primary" style="margin-top:1rem"
          onclick="showTournamentForm()">+ Create First Tournament</button>
      </div>`;
    return;
  }

  document.getElementById('tournament-list').innerHTML = filtered.map(t => `
    <div class="tournament-card ${t.status?.toLowerCase()}"
         onclick="showDetailView(${t.id})">
      <div class="tournament-card-header">
        <div class="tournament-card-name">${t.name}</div>
        <span class="status-badge status-${t.status?.toLowerCase()}">${t.status}</span>
      </div>
      <div class="tournament-card-meta">
        <span>📍 ${t.location || '—'}</span>
        <span>📅 ${t.startDate || '—'} → ${t.endDate || '—'}</span>
        ${t.description ? `<span>📝 ${t.description}</span>` : ''}
      </div>
      <div class="tournament-card-footer">
        <span class="team-count">Click to view details</span>
        <button class="btn-view" onclick="event.stopPropagation();showDetailView(${t.id})">
          View →
        </button>
      </div>
    </div>`).join('');
}

function filterTournaments() { loadTournaments(); }

// =============================================
// LOAD TOURNAMENT DETAIL
// =============================================
async function loadTournamentDetail(id) {
  const t = await apiFetch(`${API}/tournaments/${id}`);
  document.getElementById('detail-title').textContent = t.name;

  document.getElementById('tournament-info-bar').innerHTML = `
    <div class="info-item">
      <span class="info-label">Status</span>
      <span class="status-badge status-${t.status?.toLowerCase()}">${t.status}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Location</span>
      <span class="info-value">📍 ${t.location || '—'}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Start Date</span>
      <span class="info-value">📅 ${t.startDate || '—'}</span>
    </div>
    <div class="info-item">
      <span class="info-label">End Date</span>
      <span class="info-value">🏁 ${t.endDate || '—'}</span>
    </div>
    ${t.description ? `
    <div class="info-item">
      <span class="info-label">Description</span>
      <span class="info-value">📝 ${t.description}</span>
    </div>` : ''}`;

  document.getElementById('btn-edit-tournament').onclick   = () => showTournamentForm(t);
  document.getElementById('btn-delete-tournament').onclick = () => deleteTournament(id);

  loadTabContent(currentTab);
}

// =============================================
// LOAD TAB CONTENT
// =============================================
async function loadTabContent(tab) {
  const content = document.getElementById('tab-content');
  content.innerHTML = `<div class="loader">⚽ Loading...</div>`;

  switch (tab) {
    case 'matches':   return loadMatchesTab(content);
    case 'teams':     return loadTeamsTab(content);
    case 'standings': return loadStandingsTab(content);
    case 'stats':     return loadStatsTab(content);
  }
}

// ---- MATCHES TAB ----
async function loadMatchesTab(content) {
  const matches = await apiFetch(`${API}/tournaments/${currentTournamentId}/matches`);

  const upcoming  = matches.filter(m => m.status === 'UPCOMING');
  const ongoing   = matches.filter(m => m.status === 'ONGOING');
  const completed = matches.filter(m => m.status === 'COMPLETED');

  content.innerHTML = `
    <div style="display:flex;justify-content:flex-end;margin-bottom:1rem">
      <button class="btn btn-primary" onclick="showMatchForm()">+ Add Match</button>
    </div>

    ${ongoing.length > 0 ? `
      <h3 style="color:var(--accent);margin-bottom:0.8rem;font-size:1rem">
        🔴 Ongoing (${ongoing.length})
      </h3>
      ${ongoing.map(m => matchCard(m)).join('')}` : ''}

    ${upcoming.length > 0 ? `
      <h3 style="color:#42a5f5;margin-bottom:0.8rem;font-size:1rem;margin-top:1rem">
        📅 Upcoming (${upcoming.length})
      </h3>
      ${upcoming.map(m => matchCard(m)).join('')}` : ''}

    ${completed.length > 0 ? `
      <h3 style="color:var(--muted);margin-bottom:0.8rem;font-size:1rem;margin-top:1rem">
        ✅ Completed (${completed.length})
      </h3>
      ${completed.map(m => matchCard(m)).join('')}` : ''}

    ${matches.length === 0 ? `
      <div class="empty-state">
        <div class="icon">📅</div>
        <p>No matches scheduled yet.</p>
      </div>` : ''}`;
}

function matchCard(m) {
  return `
    <div class="t-match-card">
      <div class="t-match-top">
        <span class="t-match-round">🏷️ ${m.round || 'Match'}</span>
        <span class="status-badge status-${m.status?.toLowerCase()}">${m.status}</span>
        <span class="t-match-datetime">
          📅 ${m.matchDate || 'TBD'} &nbsp;⏰ ${m.matchTime || 'TBD'}
        </span>
      </div>
      <div class="t-match-scoreline">
        <div class="t-team-block">
          <div class="t-team-name">${m.homeTeam.name}</div>
        </div>
        <div class="t-score">${m.homeScore} - ${m.awayScore}</div>
        <div class="t-team-block">
          <div class="t-team-name">${m.awayTeam.name}</div>
        </div>
      </div>
      <div class="t-match-footer">
        <span class="t-match-venue">📍 ${m.venue || '—'}</span>
        <div class="t-match-actions">
          <button class="btn btn-primary btn-sm"
            onclick="showAddEventForm(${m.id},'${m.homeTeam.name}','${m.awayTeam.name}',
            ${m.homeTeam.id},${m.awayTeam.id})">⚽ Goal/Assist</button>
          <button class="btn btn-warning btn-sm"
            onclick="showMatchForm(${JSON.stringify(m).replace(/"/g,'&quot;')})">Edit</button>
          <button class="btn btn-sm" style="background:var(--surface2)"
            onclick="showMatchEvents(${m.id})">Events</button>
          <button class="btn btn-danger btn-sm"
            onclick="deleteMatch(${m.id})">Del</button>
        </div>
      </div>
    </div>`;
}

// ---- TEAMS TAB ----
async function loadTeamsTab(content) {
  const tTeams = await apiFetch(`${API}/tournaments/${currentTournamentId}/teams`);

  const teamIds = tTeams.map(tt => tt.team.id);
  const available = allTeams.filter(t => !teamIds.includes(t.id));

  content.innerHTML = `
    <div class="teams-tab-header">
      <h3 style="color:var(--accent)">Teams (${tTeams.length})</h3>
      ${available.length > 0 ? `
        <div style="display:flex;gap:0.6rem;align-items:center">
          <select id="addTeamSelect" class="filter-select">
            ${available.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
          </select>
          <button class="btn btn-primary btn-sm" onclick="addTeamToTournament()">
            + Add Team
          </button>
        </div>` : '<span style="color:var(--muted);font-size:0.85rem">All teams added</span>'}
    </div>
    ${tTeams.length === 0
      ? `<div class="empty-state"><div class="icon">🛡️</div><p>No teams added yet.</p></div>`
      : tTeams.map(tt => `
        <div class="team-pill">
          <div>
            <div class="team-pill-name">🛡️ ${tt.team.name}</div>
            <div class="team-pill-meta">📍 ${tt.team.city || '—'}</div>
          </div>
          <div>
            <button class="btn btn-sm" style="background:var(--surface2);margin-right:0.4rem"
              onclick="showTeamPlayers(${tt.team.id},'${tt.team.name}')">
              👤 Players
            </button>
            <button class="btn btn-danger btn-sm"
              onclick="removeTeam(${tt.team.id})">Remove</button>
          </div>
        </div>`).join('')}`;
}

// ---- STANDINGS TAB ----
async function loadStandingsTab(content) {
  const data = await apiFetch(`${API}/tournaments/${currentTournamentId}/standings`);

  if (data.length === 0) {
    content.innerHTML = `<div class="empty-state"><div class="icon">🏆</div>
      <p>No standings yet. Complete some matches first!</p></div>`;
    return;
  }

  content.innerHTML = `
    <div class="standings-note">
      📌 Only COMPLETED matches are counted in standings.
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th>
            <th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th>
          </tr>
        </thead>
        <tbody>
          ${data.map((r, i) => `
            <tr>
              <td><span class="rank-badge ${i<3?'rank-'+(i+1):''}">${i+1}</span></td>
              <td><strong>${r.teamName}</strong></td>
              <td>${r.played}</td>
              <td style="color:var(--accent)">${r.won}</td>
              <td>${r.drawn}</td>
              <td style="color:var(--danger)">${r.lost}</td>
              <td>${r.gf}</td>
              <td>${r.ga}</td>
              <td>${r.gf - r.ga >= 0 ? '+' : ''}${r.gf - r.ga}</td>
              <td><strong style="color:var(--accent)">${r.points}</strong></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

// ---- STATS TAB ----
async function loadStatsTab(content) {
  const data = await apiFetch(`${API}/tournaments/${currentTournamentId}/stats`);

  if (data.length === 0) {
    content.innerHTML = `<div class="empty-state"><div class="icon">📊</div>
      <p>No stats yet. Add goals and assists to matches!</p></div>`;
    return;
  }

  const topGoals   = [...data].sort((a,b) => b.goals - a.goals).slice(0, 3);
  const topAssists = [...data].sort((a,b) => b.assists - a.assists).slice(0, 3);

  content.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:2rem">
      <div>
        <h3 style="color:var(--accent);margin-bottom:0.8rem;font-size:1rem">⚽ Top Scorers</h3>
        ${topGoals.map((p, i) => `
          <div style="display:flex;align-items:center;gap:0.8rem;
               background:var(--surface);border-radius:8px;padding:0.7rem 1rem;
               margin-bottom:0.5rem;border:1px solid var(--border)">
            <span style="font-size:1.2rem">${['🥇','🥈','🥉'][i]}</span>
            <div style="flex:1">
              <div style="font-weight:600">${p.playerName}</div>
              <div style="font-size:0.78rem;color:var(--muted)">${p.teamName}</div>
            </div>
            <span style="font-size:1.3rem;font-weight:800;color:var(--accent)">${p.goals}</span>
          </div>`).join('')}
      </div>
      <div>
        <h3 style="color:#42a5f5;margin-bottom:0.8rem;font-size:1rem">🅰️ Top Assists</h3>
        ${topAssists.map((p, i) => `
          <div style="display:flex;align-items:center;gap:0.8rem;
               background:var(--surface);border-radius:8px;padding:0.7rem 1rem;
               margin-bottom:0.5rem;border:1px solid var(--border)">
            <span style="font-size:1.2rem">${['🥇','🥈','🥉'][i]}</span>
            <div style="flex:1">
              <div style="font-weight:600">${p.playerName}</div>
              <div style="font-size:0.78rem;color:var(--muted)">${p.teamName}</div>
            </div>
            <span style="font-size:1.3rem;font-weight:800;color:#42a5f5">${p.assists}</span>
          </div>`).join('')}
      </div>
    </div>

    <h3 style="color:var(--accent);margin-bottom:0.8rem;font-size:1rem">
      📊 Full Player Stats
    </h3>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>#</th><th>Player</th><th>Team</th><th>⚽ Goals</th><th>🅰️ Assists</th></tr>
        </thead>
        <tbody>
          ${data.map((p, i) => `
            <tr>
              <td>${i+1}</td>
              <td><strong>${p.playerName}</strong></td>
              <td>${p.teamName}</td>
              <td style="color:var(--accent);font-weight:700">${p.goals}</td>
              <td style="color:#42a5f5">${p.assists}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

// =============================================
// TOURNAMENT FORM
// =============================================
function showTournamentForm(t = null) {
  openModal(t ? 'Edit Tournament' : 'New Tournament', `
    <div class="form-group"><label>Tournament Name</label>
      <input type="text" id="f-name" value="${t?.name || ''}"
             placeholder="e.g. Premier League 2024"/></div>
    <div class="form-group"><label>Location</label>
      <input type="text" id="f-location" value="${t?.location || ''}"
             placeholder="e.g. England"/></div>
    <div class="form-row">
      <div class="form-group"><label>Start Date</label>
        <input type="date" id="f-start" value="${t?.startDate || ''}"/></div>
      <div class="form-group"><label>End Date</label>
        <input type="date" id="f-end" value="${t?.endDate || ''}"/></div>
    </div>
    <div class="form-group"><label>Status</label>
      <select id="f-status">
        <option value="UPCOMING"  ${t?.status==='UPCOMING' ?'selected':''}>📅 Upcoming</option>
        <option value="ONGOING"   ${t?.status==='ONGOING'  ?'selected':''}>🔴 Ongoing</option>
        <option value="COMPLETED" ${t?.status==='COMPLETED'?'selected':''}>✅ Completed</option>
      </select>
    </div>
    <div class="form-group"><label>Description (optional)</label>
      <input type="text" id="f-desc" value="${t?.description || ''}"
             placeholder="Short description..."/></div>
    <div class="form-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveTournament(${t?.id || null})">
        ${t ? 'Update' : 'Create'} Tournament
      </button>
    </div>`);
}

async function saveTournament(id) {
  const body = {
    name:        document.getElementById('f-name').value,
    location:    document.getElementById('f-location').value,
    startDate:   document.getElementById('f-start').value || null,
    endDate:     document.getElementById('f-end').value   || null,
    status:      document.getElementById('f-status').value,
    description: document.getElementById('f-desc').value
  };
  const url    = id ? `${API}/tournaments/${id}` : `${API}/tournaments`;
  const method = id ? 'PUT' : 'POST';
  await apiFetch(url, { method, body: JSON.stringify(body) });
  closeModal();
  if (id) loadTournamentDetail(id);
  else    loadTournaments();
}

async function deleteTournament(id) {
  if (!confirm('Delete this tournament and all its matches?')) return;
  await apiFetch(`${API}/tournaments/${id}`, { method: 'DELETE' });
  showListView();
}

// =============================================
// MATCH FORM
// =============================================
function showMatchForm(m = null) {
  const teamOpts = allTeams.map(t =>
    `<option value="${t.id}"
      ${m && m.homeTeam?.id===t.id?'selected':''}>${t.name}</option>`).join('');
  const awayOpts = allTeams.map(t =>
    `<option value="${t.id}"
      ${m && m.awayTeam?.id===t.id?'selected':''}>${t.name}</option>`).join('');

  openModal(m ? 'Edit Match' : 'Add Match', `
    <div class="form-group"><label>Round</label>
      <input type="text" id="f-round" value="${m?.round||''}"
             placeholder="e.g. Matchday 1, Quarter Final"/></div>
    <div class="form-group"><label>Home Team</label>
      <select id="f-home">${teamOpts}</select></div>
    <div class="form-group"><label>Away Team</label>
      <select id="f-away">${awayOpts}</select></div>
    <div class="form-row">
      <div class="form-group"><label>Home Score</label>
        <input type="number" id="f-hs" value="${m?.homeScore||0}" min="0"/></div>
      <div class="form-group"><label>Away Score</label>
        <input type="number" id="f-as" value="${m?.awayScore||0}" min="0"/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Match Date</label>
        <input type="date" id="f-date" value="${m?.matchDate||''}"/></div>
      <div class="form-group"><label>Match Time</label>
        <input type="time" id="f-time" value="${m?.matchTime||''}"/></div>
    </div>
    <div class="form-group"><label>Venue</label>
      <input type="text" id="f-venue" value="${m?.venue||''}"
             placeholder="e.g. Old Trafford"/></div>
    <div class="form-group"><label>Status</label>
      <select id="f-status">
        <option value="UPCOMING"  ${m?.status==='UPCOMING' ?'selected':''}>📅 Upcoming</option>
        <option value="ONGOING"   ${m?.status==='ONGOING'  ?'selected':''}>🔴 Ongoing</option>
        <option value="COMPLETED" ${m?.status==='COMPLETED'?'selected':''}>✅ Completed</option>
      </select>
    </div>
    <div class="form-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveMatch(${m?.id||null})">Save Match</button>
    </div>`);
}

async function saveMatch(id) {
  const body = {
    homeTeam:  { id: +document.getElementById('f-home').value },
    awayTeam:  { id: +document.getElementById('f-away').value },
    homeScore: +document.getElementById('f-hs').value,
    awayScore: +document.getElementById('f-as').value,
    matchDate:  document.getElementById('f-date').value || null,
    matchTime:  document.getElementById('f-time').value || null,
    venue:      document.getElementById('f-venue').value,
    status:     document.getElementById('f-status').value,
    round:      document.getElementById('f-round').value
  };
  if (id) {
    await apiFetch(`${API}/tournaments/matches/${id}`, { method:'PUT', body:JSON.stringify(body) });
  } else {
    await apiFetch(`${API}/tournaments/${currentTournamentId}/matches`,
      { method:'POST', body:JSON.stringify(body) });
  }
  closeModal();
  loadTabContent('matches');
}

async function deleteMatch(id) {
  if (!confirm('Delete this match?')) return;
  await apiFetch(`${API}/tournaments/matches/${id}`, { method:'DELETE' });
  loadTabContent('matches');
}

// =============================================
// GOAL & ASSIST FORM
// =============================================
function showAddEventForm(matchId, homeTeam, awayTeam, homeTeamId, awayTeamId) {
  const playerOpts = allPlayers.map(p =>
    `<option value="${p.id}" data-team="${p.team?.id||''}">${p.name} (${p.team?.name||'—'})</option>`
  ).join('');

  openModal(`⚽ Add Goal / Assist`, `
    <div class="form-group"><label>Event Type</label>
      <select id="f-event">
        <option value="GOAL">⚽ Goal</option>
      </select>
    </div>
    <div class="form-group"><label>Scored By</label>
      <select id="f-player">${playerOpts}</select></div>
    <div class="form-group"><label>Assist By (optional)</label>
      <select id="f-assist">
        <option value="">-- No Assist --</option>
        ${playerOpts}
      </select>
    </div>
    <div class="form-group"><label>Team</label>
      <select id="f-team">
        <option value="${homeTeamId}">${homeTeam}</option>
        <option value="${awayTeamId}">${awayTeam}</option>
      </select>
    </div>
    <div class="form-group"><label>Minute</label>
      <input type="number" id="f-minute" value="1" min="1" max="120"/></div>
    <div class="form-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveEvent(${matchId})">Add Goal</button>
    </div>`);
}

async function saveEvent(matchId) {
  const assistId = document.getElementById('f-assist').value;
  const body = {
    player:    { id: +document.getElementById('f-player').value },
    team:      { id: +document.getElementById('f-team').value },
    eventType:  document.getElementById('f-event').value,
    minute:    +document.getElementById('f-minute').value,
    assistBy:   assistId ? { id: +assistId } : null
  };
  await apiFetch(`${API}/tournaments/matches/${matchId}/events`,
    { method:'POST', body:JSON.stringify(body) });
  closeModal();
  loadTabContent('matches');
}

async function showMatchEvents(matchId) {
  const events = await apiFetch(`${API}/tournaments/matches/${matchId}/events`);
  if (events.length === 0) {
    openModal('Match Events', `<div class="empty-state"><div class="icon">📭</div>
      <p>No events yet.</p></div>`);
    return;
  }
  openModal('Match Events', `
    <div class="events-list">
      ${events.map(e => `
        <div class="event-row">
          <span class="event-min">${e.minute}'</span>
          <span>⚽</span>
          <span><strong>${e.player.name}</strong>
            ${e.assistBy ? `<span style="color:var(--muted)"> (assist: ${e.assistBy.name})</span>` : ''}
          </span>
          <span style="margin-left:auto;color:var(--muted);font-size:0.75rem">${e.team.name}</span>
          <button class="btn btn-danger btn-sm" onclick="deleteEvent(${e.id})">✕</button>
        </div>`).join('')}
    </div>`);
}

async function deleteEvent(id) {
  if (!confirm('Remove this event?')) return;
  await apiFetch(`${API}/tournaments/events/${id}`, { method:'DELETE' });
  closeModal();
  loadTabContent('matches');
}

// =============================================
// TEAM MANAGEMENT
// =============================================
async function addTeamToTournament() {
  const teamId = document.getElementById('addTeamSelect').value;
  if (!teamId) return;
  await apiFetch(`${API}/tournaments/${currentTournamentId}/teams/${teamId}`,
    { method:'POST' });
  loadTabContent('teams');
}

async function removeTeam(teamId) {
  if (!confirm('Remove this team from tournament?')) return;
  await apiFetch(`${API}/tournaments/${currentTournamentId}/teams/${teamId}`,
    { method:'DELETE' });
  loadTabContent('teams');
}

function showTeamPlayers(teamId, teamName) {
  const players = allPlayers.filter(p => p.team?.id === teamId);
  openModal(`👤 ${teamName} — Players`, players.length === 0
    ? `<div class="empty-state"><div class="icon">👤</div><p>No players found.</p></div>`
    : `<div>
        ${players.map(p => `
          <div style="display:flex;align-items:center;gap:0.8rem;
               background:var(--surface2);border-radius:8px;padding:0.6rem 1rem;
               margin-bottom:0.5rem">
            <span style="font-size:1.2rem">👤</span>
            <div>
              <div style="font-weight:600">#${p.jerseyNumber} ${p.name}</div>
              <div style="font-size:0.78rem;color:var(--muted)">
                ${p.position || '—'} · ${p.nationality || '—'} · Age ${p.age || '—'}
              </div>
            </div>
          </div>`).join('')}
      </div>`);
}
