// skills.js — Flip-chip skills grid (fixed sidebar; compact clear; default "Data Engineering")
(async function(){
  const root = document.querySelector('.skills-flip');
  const filtersWrap = document.getElementById('filters');
  const clearBtn = document.getElementById('clearFilters');
  if(!root || !filtersWrap || !clearBtn) return;

  // Ensure we don't persist older levels
  try { localStorage.removeItem('skillLevels'); } catch(e) {}

  // Load SKILLS from data/skills.json (keeps the HTML/JS smaller and data-driven)
  let SKILLS = [];
  try{
    const res = await fetch('data/skills.json');
    if(res.ok) SKILLS = await res.json();
    else console.warn('Failed to load data/skills.json:', res.status);
  }catch(err){
    console.error('Error loading skills.json', err);
  }

  // Order puts "Data Engineering" first; we default to it
  const CATS = ['Data Engineering','Databases','Visualization','Cloud','Programming','Salesforce','All'];
  const CAT_ICONS = { 'Data Engineering':'⚙️', Databases:'🗄️', Visualization:'📊', Cloud:'☁️', Programming:'🧩', Salesforce:'🌀', All:'✨' };

  // Level → class + progress %
  const LEVEL_CLASS = { Unrated:'unrated', Beginner:'beginner', Intermediate:'intermediate', Advanced:'advanced', Expert:'expert' };
  const LEVEL_PCT   = { Unrated:0, Beginner:40, Intermediate:65, Advanced:82, Expert:95 };

  const grid  = root.querySelector('#grid');
  const empty = root.querySelector('#empty');

  // Default active filter → "Data Engineering"
  const state = { active:new Set(['Data Engineering']) };

  // Helpers (counts/chips)
  function countForCat(cat){ return SKILLS.filter(s=> (cat==='All' || s.cat===cat)).length; }
  function updateChipCounts(){
    CATS.forEach(cat=>{
      const el = chipEls[cat]; if(!el) return;
      const span = el.querySelector('.count'); if(span) span.textContent = countForCat(cat);
    });
  }

  // Build chips
  const chipEls = {};
  CATS.forEach(cat=>{
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.setAttribute('type','button');
    btn.innerHTML = `<span class="ico">${CAT_ICONS[cat]||'#'}</span><span class="label">${cat}</span><span class="count">${countForCat(cat)}</span>`;
    btn.addEventListener('click', ()=> toggleCat(cat));
    filtersWrap.appendChild(btn);
    chipEls[cat] = btn;
  });

  // Clear: remove all filters (or swap to default by uncommenting 2 lines below)
  clearBtn.addEventListener('click', ()=>{
    state.active.clear();
    // state.active = new Set(['Data Engineering']); // <- use this to reset to default instead
    render();
  });

  function toggleCat(cat){
    if(cat==='All') state.active.clear();
    else { state.active.has(cat) ? state.active.delete(cat) : state.active.add(cat); }
    render();
  }

  function matchesFilters(s){ return state.active.size===0 || state.active.has(s.cat); }

  function addClickAnimations(card){
    const pressOn = ()=> card.classList.add('is-pressed');
    const pressOff = ()=> card.classList.remove('is-pressed');
    card.addEventListener('mousedown', pressOn);
    card.addEventListener('touchstart', pressOn, {passive:true});
    ['mouseup','mouseleave','touchend','touchcancel'].forEach(ev=> card.addEventListener(ev, pressOff));
  }

  function render(){
    // Chip active states
    for(const [cat, el] of Object.entries(chipEls)){
      el.classList.toggle('is-active', cat==='All' ? state.active.size===0 : state.active.has(cat));
    }
    updateChipCounts();

    // Build cards
    grid.innerHTML='';
    const shown = SKILLS.filter(matchesFilters);
    empty.hidden = shown.length>0;
    if(shown.length===0) return;

    shown.forEach((s)=>{
      const item=document.createElement('article');
      item.className='card';
      item.setAttribute('tabindex','0'); // keyboard a11y

      const level = s.level || 'Unrated';
      const cls   = LEVEL_CLASS[level] || 'unrated';
      const pct   = LEVEL_PCT[level]   ?? 0;

      const front=document.createElement('div'); front.className='face front';
      front.innerHTML=`
        <div class="row">
          <div class="skill-name">${s.name}</div>
          <span class="pill ${cls}">${level}</span>
        </div>
        <div class="bar ${cls}"><i style="width:${pct}%"></i></div>
        <div class="meta">${s.cat}</div>`;

      const back=document.createElement('div'); back.className='face back';
      back.innerHTML=`
        <div class="skill-name">${s.name}</div>
        <p class="desc">${s.desc}</p>
        <p class="years"><strong>Years:</strong> ${s.years}+ years</p>
        <div class="meta">Category: ${s.cat}</div>`;

      item.appendChild(front);
      item.appendChild(back);
      addClickAnimations(item);

      const flip = ()=>{
        item.classList.add('clicked','is-flipping');
        setTimeout(()=> item.classList.remove('clicked'), 200);
        setTimeout(()=> item.classList.remove('is-flipping'), 800);
        root.querySelectorAll('.card.is-flipped').forEach(c=>{if(c!==item)c.classList.remove('is-flipped');});
        item.classList.toggle('is-flipped');
      };

      item.addEventListener('click', (e)=>{ e.preventDefault(); flip(); });
      item.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); flip(); } });

      grid.appendChild(item);
    });
  }

  // Initial render with "Data Engineering" active
  render();
})();
