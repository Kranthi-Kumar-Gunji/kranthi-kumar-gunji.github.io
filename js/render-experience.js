// render-experience.js — fetches data/experience.json and renders the timeline
(function(){
  async function init(){
    const container = document.getElementById('tl-list');
    if(!container) return;
    let items = [];
    try{
      const res = await fetch('../data/experience.json');
      if(res.ok) items = await res.json();
      else { console.warn('Failed to load experience.json', res.status); }
    }catch(err){ console.error('Error loading experience.json', err); }

    // build DOM
    items.forEach((it, idx)=>{
      const tlItem = document.createElement('div'); tlItem.className = 'tl-item';

      const sideLeft = document.createElement('div'); sideLeft.className = 'tl-side';
      const sideRight = document.createElement('div'); sideRight.className = 'tl-side';

      const card = document.createElement('div'); card.className = 'tl-card';
      const header = document.createElement('div'); header.className = 'tl-card-header';
      const meta = document.createElement('div'); meta.className = 'tl-meta';
      const h3 = document.createElement('h3'); h3.textContent = it.title;
      const p = document.createElement('p'); p.className = 'muted'; p.textContent = `${it.company} · ${it.period}`;
      const chips = document.createElement('div'); chips.className='badges';
      chips.innerHTML = makeBadges(it.skills);
      meta.appendChild(h3); meta.appendChild(p); meta.appendChild(chips);
      header.appendChild(meta);

      const body = document.createElement('div'); body.className = 'tl-card-body'; body.id = it.id; body.hidden = true;
      const ul = document.createElement('ul'); (it.bullets||[]).forEach(b=>{ const li=document.createElement('li'); li.textContent=b; ul.appendChild(li); });
      body.appendChild(ul);

      const footer = document.createElement('div'); footer.className = 'tl-card-footer';
      const btn = document.createElement('button'); btn.className='tl-toggle'; btn.type='button'; btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-controls', it.id); btn.title='Show details';
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      footer.appendChild(btn);

      card.appendChild(header); card.appendChild(body); card.appendChild(footer);
      sideLeft.appendChild(card);

      const node = document.createElement('div'); node.className='tl-node'; node.setAttribute('aria-hidden','true');
      const badge = document.createElement('div'); badge.className='year-badge'; badge.setAttribute('aria-label','Start year'); badge.textContent = it.year || '';

      tlItem.appendChild(sideLeft); tlItem.appendChild(sideRight); tlItem.appendChild(node); tlItem.appendChild(badge);
      container.appendChild(tlItem);

      // toggle behaviour
      btn.addEventListener('click', ()=>{
        const open = card.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        body.hidden = !open;
      });
    });
  }

  // Initialize once DOM is ready
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
