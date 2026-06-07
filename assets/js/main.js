// ══════════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════════
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.rv').forEach(el => revealObs.observe(el));

// ══════════════════════════════════════════════
// HERO PARALLAX
// ══════════════════════════════════════════════
(function(){
  const hero  = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg-fallback');
  let ticking = false;
  if (hero && hero.classList.contains('has-image')) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight * 1.5) heroBg.style.backgroundPositionY = `calc(28% + ${y * 0.15}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
})();

// ══════════════════════════════════════════════
// CARD TILT — bento cards
// ══════════════════════════════════════════════
document.querySelectorAll('.bc').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-3px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    card.style.transformOrigin = 'center center';
    card.style.transition = 'transform .1s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .4s cubic-bezier(0.16,1,0.3,1), box-shadow .28s';
  });
});

// ══════════════════════════════════════════════
// GALERÍA — carrusel central infinito con fade
// ══════════════════════════════════════════════
(function(){
  const viewport = document.getElementById('galViewport');
  const dotsC    = document.getElementById('galDots');
  const btnP     = document.getElementById('galPrev');
  const btnN     = document.getElementById('galNext');
  if (!viewport) return;

  const items  = [...viewport.querySelectorAll('.gal-item')];
  const total  = items.length;
  let current  = 0;
  let isAnim   = false;

  // Crear dots
  items.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'gal-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Imagen ' + (i + 1));
    d.onclick = () => { goTo(i); resetAuto(); };
    dotsC && dotsC.appendChild(d);
  });

  function goTo(next) {
    if (isAnim || next === current) return;
    isAnim = true;
    const prev = current;
    current = ((next % total) + total) % total;

    items[prev].classList.remove('active');
    items[prev].classList.add('prev');
    items[current].classList.add('active');

    setTimeout(() => {
      items[prev].classList.remove('prev');
      isAnim = false;
    }, 680);

    // Update dots
    if (dotsC) {
      dotsC.querySelectorAll('.gal-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }
  }

  // Auto-avance infinito
  let autoTimer = setInterval(() => goTo(current + 1), 4500);
  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 4500);
  }

  // Botones del header
  if (btnP) btnP.onclick = () => { goTo(current - 1); resetAuto(); };
  if (btnN) btnN.onclick = () => { goTo(current + 1); resetAuto(); };

  // Swipe touch
  let touchStartX = 0;
  viewport.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 40) { diff < 0 ? goTo(current + 1) : goTo(current - 1); resetAuto(); }
  });
})();

// ══════════════════════════════════════════════
// FAQ — div role=button accesible
// ══════════════════════════════════════════════
function toggleFaqItem(item) {
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => {
    i.classList.remove('open');
    i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
  });
  if (!isOpen) {
    item.classList.add('open');
    item.querySelector('.faq-q').setAttribute('aria-expanded', 'true');
  }
}

document.querySelectorAll('.faq-q').forEach(el => {
  el.setAttribute('aria-expanded', 'false');
  el.addEventListener('click', () => toggleFaqItem(el.closest('.faq-item')));
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFaqItem(el.closest('.faq-item')); }
  });
});

// ══════════════════════════════════════════════
// FORMULARIO — validación
// ══════════════════════════════════════════════
function setErr(id, show) {
  const g = document.getElementById('g-' + id);
  if (g) show ? g.classList.add('has-err') : g.classList.remove('has-err');
}
function validateTel(tel) {
  if (!tel) return true;
  return /^(\+51\s?)?[0-9\s\-]{7,15}$/.test(tel);
}

// Reemplazá TU_ID_FORMSPREE con el código de tu endpoint en formspree.io/f/XXXXXXXX
const FORMSPREE_URL = 'https://formspree.io/f/xojzewpk';

document.getElementById('submitBtn').addEventListener('click', async function() {
  const nombre  = document.getElementById('nombre').value.trim();
  const ciudad  = document.getElementById('ciudad').value.trim();
  const email   = document.getElementById('email').value.trim();
  const tel     = document.getElementById('tel').value.trim();
  const msg     = document.getElementById('msg').value.trim();
  const tipoSel = document.querySelector('input[name="tipo"]:checked');
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  const telOk   = validateTel(tel);

  const tipoErr = document.getElementById('tipoErr');
  !tipoSel ? tipoErr.classList.add('show') : tipoErr.classList.remove('show');
  setErr('nombre', !nombre);
  setErr('email', !email || !emailOk);
  if (document.getElementById('g-tel')) setErr('tel', tel.length > 0 && !telOk);

  if (!nombre || !email || !emailOk || !tipoSel || (tel.length > 0 && !telOk)) return;

  const btn = this;
  btn.disabled = true;
  btn.textContent = 'Enviando\u2026';

  try {
    const payload = new URLSearchParams();
    payload.append('Nombre',        nombre);
    payload.append('Ciudad',        ciudad || '\u2014');
    payload.append('Email',         email);
    payload.append('Telefono',      tel    || '\u2014');
    payload.append('Participacion', tipoSel.value);
    payload.append('Mensaje',       msg    || '\u2014');

    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: payload.toString()
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Error ' + response.status);
    }

    const c = document.getElementById('formContent');
    c.style.transition = 'opacity .3s, transform .3s';
    c.style.opacity = '0';
    c.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      c.style.display = 'none';
      document.getElementById('formSuccess').classList.add('on');
    }, 300);

  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = 'Enviar mi participaci\u00f3n <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>';
    const errBox = document.getElementById('formSendErr');
    if (errBox) {
      errBox.textContent = 'Hubo un problema al enviar. Intent\u00e1 de nuevo o escr\u00edbenos por Instagram.';
      errBox.style.display = 'block';
      setTimeout(() => { errBox.style.display = 'none'; }, 6000);
    }
  }
});

['nombre','email','tel'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => setErr(id, false));
});

document.querySelectorAll('input[name="tipo"]').forEach(r => {
  r.addEventListener('change', () => {
    document.getElementById('tipoErr').classList.remove('show');
  });
});