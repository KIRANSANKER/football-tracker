// =============================================
// Football Tracker - app.js
// Includes: Theme Switcher + All CRUD Logic
// =============================================

// =============================================
// THEME SWITCHER
// =============================================
const THEME_NAMES = {
  arctic:   '☀️ Arctic',
  galaxy:   '🔮 Galaxy'
};

function setTheme(theme, dot) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ft-theme', theme);
  document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
  if (dot) dot.classList.add('active');
  document.getElementById('themeName').textContent = THEME_NAMES[theme];
}

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('ft-theme') || 'arctic';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('themeName').textContent = THEME_NAMES[saved];
  const dot = document.querySelector(`.dot-${saved}`);
  if (dot) {
    document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
  }
});

// =============================================
// API + UTILITY
// =============================================
const API    = 'http://localhost:8080/api';
let allTeams = [];

const app    = () => document.getElementById('app');
const loader = () => `<div class="loader">⚽ Loading...</div>`;

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return options.method === 'DELETE' ? null : res.json();
}

function openModal(title, bodyHTML) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML   = bodyHTML;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

function setActiveNav(el) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
}

// =============================================
// LOAD SECTION
// =============================================
async function loadSection(section, navEl) {
  if (navEl) setActiveNav(navEl);
  app().innerHTML = loader();
  allTeams = await apiFetch(`${API}/teams`).catch(() => []);

  switch (section) {
    case 'standings': return renderStandings();
    case 'matches':   return renderMatches();
    case 'teams':     return renderTeams();
    case 'players':   return renderPlayers();
    case 'stats':     return renderStats();
  }
}

// =============================================
// STANDINGS
// =============================================
async function renderStandings() {
  const data = await apiFetch(`${API}/standings`);
  app().innerHTML = `
    <div class="section-header">
      <h2>🏆 League Standings</h2>
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
          ${data.map((s, i) => `
            <tr>
              <td><span class="rank-badge rank-${i+1 <= 3 ? i+1 : ''}">${i+1}</span></td>
              <td><strong>${s.team.name}</strong><br>
                <small style="color:var(--muted)">${s.team.city}</small></td>
              <td>${s.played}</td>
              <td style="color:var(--accent)">${s.won}</td>
              <td>${s.drawn}</td>
              <td style="color:var(--danger)">${s.lost}</td>
              <td>${s.goalsFor}</td>
              <td>${s.goalsAgainst}</td>
              <td>${s.goalsFor - s.goalsAgainst >= 0 ? '+' : ''}${s.goalsFor - s.goalsAgainst}</td>
              <td><strong style="font-size:1.1rem;color:var(--accent)">${s.points}</strong></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

// =============================================
// MATCHES
// =============================================
async function renderMatches() {
  const data = await apiFetch(`${API}/matches`);
  app().innerHTML = `
    <div class="section-header">
      <h2>📅 Matches</h2>
      <button class="btn btn-primary" onclick="showAddMatchForm()">+ Add Match</button>
    </div>
    ${data.length === 0
      ? `<div class="empty-state"><div class="icon">📭</div><p>No matches found.</p></div>`
      : data.map(m => `
        <div class="match-card">
          <div class="match-team home">${m.homeTeam.name}</div>
          <div>
            <div class="match-score">${m.homeScore} - ${m.awayScore}</div>
            <div class="match-meta">
              ${m.matchDate || 'TBD'} &nbsp;|&nbsp; ${m.venue || '—'}<br>
              <span class="badge badge-${m.status?.toLowerCase()}">${m.status}</span>
            </div>
          </div>
          <div class="match-team away">${m.awayTeam.name}</div>
        </div>`).join('')}`;
}

function showAddMatchForm() {
  const teamOptions = allTeams.map(t =>
    `<option value="${t.id}">${t.name}</option>`).join('');
  openModal('Add Match', `
    <div class="form-group"><label>Home Team</label>
      <select id="f-home">${teamOptions}</select></div>
    <div class="form-group"><label>Away Team</label>
      <select id="f-away">${teamOptions}</select></div>
    <div class="form-row">
      <div class="form-group"><label>Home Score</label>
        <input type="number" id="f-hscore" value="0" min="0"/></div>
      <div class="form-group"><label>Away Score</label>
        <input type="number" id="f-ascore" value="0" min="0"/></div>
    </div>
    <div class="form-group"><label>Match Date</label>
      <input type="date" id="f-date"/></div>
    <div class="form-group"><label>Venue</label>
      <input type="text" id="f-venue" placeholder="e.g. Old Trafford"/></div>
    <div class="form-group"><label>Status</label>
      <select id="f-status">
        <option value="SCHEDULED">Scheduled</option>
        <option value="LIVE">Live</option>
        <option value="COMPLETED">Completed</option>
      </select>
    </div>
    <div class="form-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveMatch()">Save Match</button>
    </div>`);
}

async function saveMatch() {
  const body = {
    homeTeam:  { id: +document.getElementById('f-home').value },
    awayTeam:  { id: +document.getElementById('f-away').value },
    homeScore: +document.getElementById('f-hscore').value,
    awayScore: +document.getElementById('f-ascore').value,
    matchDate:  document.getElementById('f-date').value,
    venue:      document.getElementById('f-venue').value,
    status:     document.getElementById('f-status').value
  };
  await apiFetch(`${API}/matches`, { method: 'POST', body: JSON.stringify(body) });
  closeModal();
  renderMatches();
}

// =============================================
// TEAMS
// =============================================
async function renderTeams() {
  const data = await apiFetch(`${API}/teams`);
  app().innerHTML = `
    <div class="section-header">
      <h2>🛡️ Teams</h2>
      <button class="btn btn-primary" onclick="showTeamForm()">+ Add Team</button>
    </div>
    <div class="grid">
      ${data.map(t => `
        <div class="card">
          <h3>${t.name}</h3>
          <p>📍 ${t.city || '—'}</p>
          <p>📅 Founded: ${t.foundedYear || '—'}</p>
          <div class="card-actions">
            <button class="btn btn-warning btn-sm"
              onclick="showTeamForm(${t.id}, '${t.name}', '${t.city}', ${t.foundedYear})">Edit</button>
            <button class="btn btn-danger btn-sm"
              onclick="deleteTeam(${t.id})">Delete</button>
          </div>
        </div>`).join('')}
    </div>`;
}

function showTeamForm(id = null, name = '', city = '', foundedYear = '') {
  openModal(id ? 'Edit Team' : 'Add Team', `
    <div class="form-group"><label>Team Name</label>
      <input type="text" id="f-name" value="${name}" placeholder="e.g. Manchester United"/></div>
    <div class="form-group"><label>City</label>
      <input type="text" id="f-city" value="${city}" placeholder="e.g. Manchester"/></div>
    <div class="form-group"><label>Founded Year</label>
      <input type="number" id="f-year" value="${foundedYear}" placeholder="e.g. 1878"/></div>
    <div class="form-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveTeam(${id})">Save Team</button>
    </div>`);
}

async function saveTeam(id) {
  const body = {
    name:        document.getElementById('f-name').value,
    city:        document.getElementById('f-city').value,
    foundedYear: +document.getElementById('f-year').value
  };
  const url    = id ? `${API}/teams/${id}` : `${API}/teams`;
  const method = id ? 'PUT' : 'POST';
  await apiFetch(url, { method, body: JSON.stringify(body) });
  closeModal();
  renderTeams();
}

async function deleteTeam(id) {
  if (!confirm('Delete this team?')) return;
  await apiFetch(`${API}/teams/${id}`, { method: 'DELETE' });
  renderTeams();
}

// =============================================
// PLAYERS
// =============================================
async function renderPlayers() {
  const data = await apiFetch(`${API}/players`);
  app().innerHTML = `
    <div class="section-header">
      <h2>👤 Players</h2>
      <button class="btn btn-primary" onclick="showPlayerForm()">+ Add Player</button>
    </div>
    <div class="grid">
      ${data.map(p => `
        <div class="card">
          <h3>#${p.jerseyNumber} ${p.name}</h3>
          <p>🎽 ${p.position || '—'}</p>
          <p>🌍 ${p.nationality || '—'}</p>
          <p>🎂 Age: ${p.age || '—'}</p>
          <p>🛡️ ${p.team?.name || 'No Team'}</p>
          <div class="card-actions">
            <button class="btn btn-warning btn-sm"
              onclick="showPlayerForm(${p.id},'${p.name}','${p.position}',
              ${p.jerseyNumber},'${p.nationality}',${p.age},
              ${p.team?.id || null})">Edit</button>
            <button class="btn btn-danger btn-sm"
              onclick="deletePlayer(${p.id})">Delete</button>
          </div>
        </div>`).join('')}
    </div>`;
}

function showPlayerForm(id=null, name='', position='', jersey=0, nationality='', age=0, teamId=null) {
  const teamOptions = allTeams.map(t =>
    `<option value="${t.id}" ${t.id === teamId ? 'selected' : ''}>${t.name}</option>`).join('');
  openModal(id ? 'Edit Player' : 'Add Player', `
    <div class="form-row">
      <div class="form-group"><label>Full Name</label>
        <input type="text" id="f-name" value="${name}" placeholder="Player name"/></div>
      <div class="form-group"><label>Jersey #</label>
        <input type="number" id="f-jersey" value="${jersey}" min="1" max="99"/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Position</label>
        <select id="f-pos">
          ${['Goalkeeper','Defender','Midfielder','Forward'].map(p =>
            `<option ${p === position ? 'selected' : ''}>${p}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Age</label>
        <input type="number" id="f-age" value="${age}" min="15" max="50"/></div>
    </div>
    <div class="form-group"><label>Nationality</label>
      <input type="text" id="f-nat" value="${nationality}" placeholder="e.g. English"/></div>
    <div class="form-group"><label>Team</label>
      <select id="f-team">
        <option value="">-- No Team --</option>${teamOptions}
      </select>
    </div>
    <div class="form-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="savePlayer(${id})">Save Player</button>
    </div>`);
}

async function savePlayer(id) {
  const teamId = document.getElementById('f-team').value;
  const body   = {
    name:         document.getElementById('f-name').value,
    jerseyNumber: +document.getElementById('f-jersey').value,
    position:     document.getElementById('f-pos').value,
    age:          +document.getElementById('f-age').value,
    nationality:  document.getElementById('f-nat').value,
    team: teamId ? { id: +teamId } : null
  };
  const url    = id ? `${API}/players/${id}` : `${API}/players`;
  const method = id ? 'PUT' : 'POST';
  await apiFetch(url, { method, body: JSON.stringify(body) });
  closeModal();
  renderPlayers();
}

async function deletePlayer(id) {
  if (!confirm('Delete this player?')) return;
  await apiFetch(`${API}/players/${id}`, { method: 'DELETE' });
  renderPlayers();
}

// =============================================
// PLAYER STATS
// =============================================
async function renderStats() {
  const [stats, players] = await Promise.all([
    apiFetch(`${API}/stats/top-scorers`),
    apiFetch(`${API}/players`)
  ]);

  const map = {};
  stats.forEach(s => {
    const pid = s.player.id;
    if (!map[pid]) map[pid] = { player: s.player, goals: 0, assists: 0, yellows: 0, reds: 0 };
    map[pid].goals   += s.goals;
    map[pid].assists += s.assists;
    map[pid].yellows += s.yellowCards;
    map[pid].reds    += s.redCards;
  });
  const rows = Object.values(map).sort((a, b) => b.goals - a.goals);

  const totalGoals   = rows.reduce((a, r) => a + r.goals,   0);
  const totalAssists = rows.reduce((a, r) => a + r.assists, 0);
  const totalYellow  = rows.reduce((a, r) => a + r.yellows, 0);

  app().innerHTML = `
    <div class="section-header">
      <h2>📊 Player Statistics</h2>
      <button class="btn btn-primary" onclick="showStatsForm()">+ Add Stats</button>
    </div>
    <div class="stats-summary">
      <div class="stat-box">
        <div class="stat-value">${players.length}</div>
        <div class="stat-label">Total Players</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${totalGoals}</div>
        <div class="stat-label">Total Goals</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${totalAssists}</div>
        <div class="stat-label">Total Assists</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${totalYellow}</div>
        <div class="stat-label">Yellow Cards</div>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th><th>Player</th><th>Team</th>
            <th>⚽ Goals</th><th>🅰️ Assists</th>
            <th>🟨 Yellow</th><th>🟥 Red</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><strong>${r.player.name}</strong></td>
              <td>${r.player.team?.name || '—'}</td>
              <td style="color:var(--accent);font-weight:700">${r.goals}</td>
              <td>${r.assists}</td>
              <td style="color:var(--warning)">${r.yellows}</td>
              <td style="color:var(--danger)">${r.reds}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

async function showStatsForm() {
  const [players, matches] = await Promise.all([
    apiFetch(`${API}/players`),
    apiFetch(`${API}/matches`)
  ]);
  const playerOpts = players.map(p =>
    `<option value="${p.id}">${p.name}</option>`).join('');
  const matchOpts  = matches.map(m =>
    `<option value="${m.id}">${m.homeTeam.name} vs ${m.awayTeam.name} (${m.matchDate || 'TBD'})</option>`).join('');

  openModal('Add Player Stats', `
    <div class="form-group"><label>Player</label>
      <select id="f-player">${playerOpts}</select></div>
    <div class="form-group"><label>Match</label>
      <select id="f-match">${matchOpts}</select></div>
    <div class="form-row">
      <div class="form-group"><label>Goals</label>
        <input type="number" id="f-goals" value="0" min="0"/></div>
      <div class="form-group"><label>Assists</label>
        <input type="number" id="f-assists" value="0" min="0"/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Yellow Cards</label>
        <input type="number" id="f-yellow" value="0" min="0" max="2"/></div>
      <div class="form-group"><label>Red Cards</label>
        <input type="number" id="f-red" value="0" min="0" max="1"/></div>
    </div>
    <div class="form-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveStats()">Save Stats</button>
    </div>`);
}

async function saveStats() {
  const body = {
    player:      { id: +document.getElementById('f-player').value },
    match:       { id: +document.getElementById('f-match').value },
    goals:        +document.getElementById('f-goals').value,
    assists:      +document.getElementById('f-assists').value,
    yellowCards:  +document.getElementById('f-yellow').value,
    redCards:     +document.getElementById('f-red').value
  };
  await apiFetch(`${API}/stats`, { method: 'POST', body: JSON.stringify(body) });
  closeModal();
  renderStats();
}

// =============================================
// MODAL CLOSE ON OVERLAY CLICK
// =============================================
document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

// =============================================
// INIT
// =============================================
loadSection('standings', document.querySelector('.nav-item.active'));
