// render-contact.js — populates contact info from data/contact.json
(function(){
  async function init(){
    const emailEl = document.getElementById('contact-email');
    const phoneEl = document.getElementById('contact-phone');
    const profileEl = document.getElementById('contact-profile');
    const form = document.getElementById('contact-form');
    if(!emailEl && !phoneEl && !profileEl && !form) return;
    try{
      const res = await fetch('data/contact.json');
      if(!res.ok) return console.warn('contact.json load failed', res.status);
      const data = await res.json();
      if(emailEl){ emailEl.textContent = data.email; emailEl.href = `mailto:${data.email}`; }
      if(phoneEl) phoneEl.textContent = data.phone;
      if(profileEl && data.profile) profileEl.src = data.profile;
      if(form && data.contactForm && data.contactForm.action) form.action = data.contactForm.action;
    }catch(err){ console.error('Error loading contact.json', err); }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
