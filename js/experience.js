// experience.js – collapsible timeline details
(function () {
  const cards = document.querySelectorAll('.tl-card');

  cards.forEach(card => {
    const btn = card.querySelector('.tl-toggle');
    const body = card.querySelector('.tl-card-body');
    if (!btn || !body) return;

    // ensure initial collapsed state
    card.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    body.hidden = true;

    btn.addEventListener('click', () => {
      const isOpen = card.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
      // use hidden to keep it out of a11y tree when closed
      if (isOpen) {
        body.hidden = false;            // show + animate open
      } else {
        // wait for collapse animation before hiding from a11y tree
        body.addEventListener('transitionend', function onTEnd(e){
          if (e.propertyName === 'max-height' && !card.classList.contains('open')) {
            body.hidden = true;
            body.removeEventListener('transitionend', onTEnd);
          }
        });
      }
    });
  });
})();
