async function loadFeatured() {
  const res = await fetch('../data/projects.json');
  const data = await res.json();
  document.getElementById('featured').innerHTML = data.map(p => `
    <div class="card" style="margin:10px 0">
      <h3>${p.title}</h3>
      <p class="muted">${p.desc}</p>
      <div class="badges">${makeBadges(p.stack)}</div>
    </div>
  `).join('');
}

async function loadRepos() {
  const user = 'Kranthi-Kumar-Gunji';
  try {
    const res = await fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=6`);
    const repos = await res.json();
    const el = document.getElementById('repos');
    if(Array.isArray(repos)) {
      el.innerHTML = repos.map(r => `
        <div class="card" style="margin:10px 0">
          <h3><a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a></h3>
          <p class="muted">Updated: ${new Date(r.updated_at).toLocaleDateString()} · ★ ${r.stargazers_count}</p>
        </div>
      `).join('');
    } else { el.textContent = 'Unable to load repositories.'; }
  } catch(e) {
    document.getElementById('repos').textContent = 'GitHub API error.';
  }
}

loadFeatured();
loadRepos();
