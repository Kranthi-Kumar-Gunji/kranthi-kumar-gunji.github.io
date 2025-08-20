document.querySelector('.nav-toggle').addEventListener('click', () => {
  document.getElementById('nav').classList.toggle('open');
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Fetch GitHub repos (projects.html)
(async function(){
  const grid = document.getElementById('repo-grid');
  if(!grid) return;
  try{
    const resp = await fetch('https://api.github.com/users/Kranthi-Kumar-Gunji/repos?sort=updated&per_page=6');
    const data = await resp.json();
    grid.innerHTML = '';
    data.forEach(repo => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h3>
        <p>${repo.description || 'No description provided.'}</p>
        <p style="color:#9ca3af;font-size:12px">Updated: ${new Date(repo.updated_at).toLocaleDateString()}</p>
      `;
      grid.appendChild(card);
    });
  } catch(e){
    grid.innerHTML = '<p>Unable to load repositories right now.</p>';
  }
})();
