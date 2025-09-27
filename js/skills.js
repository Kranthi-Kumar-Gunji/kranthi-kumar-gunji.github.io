// skills.js — Flip-chip skills grid (fixed sidebar; compact clear; default "Data Engineering")
(function(){
  const root = document.querySelector('.skills-flip');
  const filtersWrap = document.getElementById('filters');
  const clearBtn = document.getElementById('clearFilters');
  if(!root || !filtersWrap || !clearBtn) return;

  // Ensure we don't persist older levels
  try { localStorage.removeItem('skillLevels'); } catch(e) {}

  const SKILLS = [
    // Data Engineering
    { name:'SAP BODS', cat:'Data Engineering', years:3, desc:'Reusable jobs, error handling', level:'Expert' },
    { name:'Informatica', cat:'Data Engineering', years:3, desc:'Ingestion, reconciliation', level:'Intermediate' },
    { name:'SAP Data Services', cat:'Data Engineering', years:3, desc:'ETL design & migration', level:'Expert' },
    { name:'ETL Scheduling', cat:'Data Engineering', years:4, desc:'Job orchestration', level:'Advanced' },
    { name:'Data Cleansing', cat:'Data Engineering', years:6, desc:'Standardization, QA', level:'Expert' },
    { name:'Data Validation', cat:'Data Engineering', years:6, desc:'Checks, anomaly triage', level:'Expert' },

    // Databases
    { name:'Microsoft SQL Server', cat:'Databases', years:4, desc:'T-SQL, indexing', level:'Advanced' },
    { name:'Oracle Database', cat:'Databases', years:2, desc:'PL/SQL basics', level:'Intermediate' },
    { name:'Snowflake', cat:'Databases', years:3, desc:'Warehouses, optimization', level:'Advanced' },
    { name:'SSMS', cat:'Databases', years:4, desc:'Admin & dev tool', level:'Advanced' },
    { name:'SQL Developer', cat:'Databases', years:2, desc:'Oracle dev tool', level:'Intermediate' },

    // Visualization
    { name:'Tableau', cat:'Visualization', years:4, desc:'LOD, parameters, performance', level:'Expert' },
    { name:'Power BI', cat:'Visualization', years:3, desc:'DAX, data modeling', level:'Advanced' },
    { name:'SAP Lumira', cat:'Visualization', years:2, desc:'Operational visuals', level:'Expert' },
    { name:'Excel', cat:'Visualization', years:6, desc:'Power Query, KPI models', level:'Expert' },
    { name:'Jupyter Notebooks', cat:'Visualization', years:4, desc:'EDA, prototypes', level:'Advanced' },

    // Cloud
    { name:'AWS S3', cat:'Cloud', years:2, desc:'Data lake staging', level:'Intermediate' },
    { name:'AWS EC2', cat:'Cloud', years:2, desc:'Environment provisioning', level:'Intermediate' },
    { name:'AWS IAM', cat:'Cloud', years:2, desc:'Access control', level:'Intermediate' },
    { name:'AWS Lambda', cat:'Cloud', years:2, desc:'Serverless ETL', level:'Intermediate' },
    { name:'Salesforce Cloud Platform', cat:'Cloud', years:3, desc:'Platform services', level:'Advanced' },

    // Programming
    { name:'Python', cat:'Programming', years:5, desc:'Automation, ETL, data wrangling', level:'Expert' },
    { name:'SQL', cat:'Programming', years:6, desc:'Window functions, tuning, complex joins', level:'Expert' },
    { name:'Apex', cat:'Programming', years:2, desc:'Triggers, batches, automation', level:'Intermediate' },
    { name:'Java', cat:'Programming', years:1, desc:'Integrations, basics', level:'Beginner' },
    { name:'HTML', cat:'Programming', years:4, desc:'UI markup for apps/pages', level:'Advanced' },
    { name:'Shell Scripting', cat:'Programming', years:3, desc:'Automation & ops glue', level:'Intermediate' },
    { name:'JavaScript', cat:'Programming', years:2, desc:'UI interactions & scripts', level:'Intermediate' },
    { name:'VS Code', cat:'Programming', years:5, desc:'Daily IDE', level:'Advanced' },

    // Salesforce
    { name:'Salesforce Administration', cat:'Salesforce', years:3, desc:'Org setup, security', level:'Advanced' },
    { name:'Lightning Components / LWC', cat:'Salesforce', years:2, desc:'UI components', level:'Intermediate' },
    { name:'Flow Builder', cat:'Salesforce', years:3, desc:'No-code automation', level:'Advanced' },
    { name:'Process Builder', cat:'Salesforce', years:2, desc:'Legacy automation', level:'Intermediate' },
    { name:'Validation Rules', cat:'Salesforce', years:3, desc:'Data quality gates', level:'Advanced' },
    { name:'Approval Processes', cat:'Salesforce', years:2, desc:'Governance workflows', level:'Intermediate' },
    { name:'Tableau CRM (CRM Analytics)', cat:'Salesforce', years:2, desc:'Embedded analytics', level:'Intermediate' },
    { name:'Data Loader.io', cat:'Salesforce', years:3, desc:'Bulk loads', level:'Advanced' },
    { name:'Change Sets', cat:'Salesforce', years:2, desc:'Metadata deploy', level:'Intermediate' },
    { name:'Metadata API', cat:'Salesforce', years:2, desc:'Scripted deploys', level:'Intermediate' },
    { name:'Profiles & Permission Sets', cat:'Salesforce', years:3, desc:'Access control', level:'Advanced' },
    { name:'REST/SOAP APIs', cat:'Salesforce', years:2, desc:'Integrations', level:'Intermediate' },
    { name:'SOQL', cat:'Salesforce', years:3, desc:'Query language', level:'Advanced' },
    { name:'SOSL', cat:'Salesforce', years:2, desc:'Search language', level:'Intermediate' },
    { name:'Salesforce CLI', cat:'Salesforce', years:2, desc:'Dev tooling', level:'Intermediate' },
    { name:'Salesforce Extensions (VS Code)', cat:'Salesforce', years:2, desc:'IDE integrations', level:'Intermediate' }
  ];

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
