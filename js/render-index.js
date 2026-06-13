// render-index.js — loads data/index.json and renders the homepage sections
(function(){
  async function init(){
    function resolveAsset(p){
      if(!p) return p;
      if(p.startsWith('http') || p.startsWith('/') || p.startsWith('../') || p.startsWith('./')) return p;
      return (location.pathname.indexOf('/pages/') !== -1 ? '../' : '') + p;
    }
    const root = document.getElementById('index-root');
    if(!root) return;
    let data = {};
    try{
      const res = await fetch('../data/index.json');
      if(res.ok) data = await res.json(); else console.warn('Failed to load data/index.json', res.status);
    }catch(err){ console.error('Error loading index.json', err); }

    // Hero — render badges with shared badge utility
    const heroEl = document.getElementById('hero');
    if(heroEl && data.hero){
      heroEl.innerHTML = `<div><h1 class="section-title">${data.hero.title}</h1><p class="muted"><strong>${data.hero.subtitle}</strong></p><div data-social-buttons="../social-buttons.html"></div><div class="badges" style="margin-top:12px"></div></div><div class="profile"><img src="${resolveAsset(data.hero.profile)}" alt="Profile photo"/></div>`;
      const badgesWrap = heroEl.querySelector('.badges');
      badgesWrap.innerHTML = makeBadges(data.hero.badges||[]);
    }

    // Summary
    const sumEl = document.getElementById('summary');
    if(sumEl && Array.isArray(data.summary)){
      sumEl.innerHTML = '';
      data.summary.forEach((p, i)=>{
        if(i===1 && p==='🔧 Core Expertise'){
          const strong = document.createElement('p'); strong.innerHTML = '<strong>🔧 Core Expertise</strong>'; sumEl.appendChild(strong); return;
        }
        if(p.startsWith('✨') || p.startsWith('\t✨')){
          const pre = document.createElement('pre'); pre.textContent = p; sumEl.appendChild(pre); return;
        }
        const para = document.createElement('p'); para.textContent = p; sumEl.appendChild(para);
      });
    }

    // Education & Certifications
    const ec = document.getElementById('edu-cert');
    if(ec && (Array.isArray(data.education) || Array.isArray(data.certifications))){
      ec.innerHTML = '<h2 class="section-title">Education & Certifications</h2><div class="edu-row"></div>';
      const row = ec.querySelector('.edu-row');
      const left = document.createElement('div'); left.className='card';
      const lcont = document.createElement('div'); lcont.innerHTML = '<h3>Education</h3>';
      (data.education||[]).forEach(e=>{ const item=document.createElement('div'); item.className='edu-item'; item.innerHTML = `<img src="${resolveAsset(e.logo)}" alt="${e.school} logo"/><div><div><strong>${e.school}</strong></div><div class="muted">${e.detail}</div></div>`; lcont.appendChild(item); });
      left.appendChild(lcont);

      const right = document.createElement('div'); right.className='card';
      const rcont = document.createElement('div'); rcont.innerHTML = '<h3>Certifications</h3>';
      (data.certifications||[]).forEach(c=>{ const item=document.createElement('div'); item.className='cert-item'; item.innerHTML = `<img src="${resolveAsset(c.logo)}" alt="${c.name} logo"/><div><div><strong>${c.name}</strong></div><div class="muted">${c.when}</div></div>`; rcont.appendChild(item); });
      right.appendChild(rcont);

      row.appendChild(left); row.appendChild(right);
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
