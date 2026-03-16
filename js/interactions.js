

document.querySelectorAll('.nlinks a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
  });
});

const cr = document.getElementById('cr');
const cd = document.getElementById('cd');
let cx = 0, cy = 0, crx = 0, cry = 0;

document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });

function animCursor() {
  crx += (cx - crx) * .1;
  cry += (cy - cry) * .1;
  cr.style.left = crx + 'px'; cr.style.top = cry + 'px';
  cd.style.left =  cx + 'px'; cd.style.top =  cy + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('a, button, [data-mag]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cr.style.width = '58px'; cr.style.height = '58px';
    cr.style.background = 'rgba(0,229,200,.07)';
  });
  el.addEventListener('mouseleave', () => {
    cr.style.width = '36px'; cr.style.height = '36px';
    cr.style.background = 'transparent';
    cr.style.borderRadius = '50%';
    cr.style.borderColor = 'var(--accent)';
  });
});

document.querySelectorAll('.prow').forEach(row => {
  row.addEventListener('mouseenter', () => {
    cr.style.width = '48px'; cr.style.height = '48px';
    cr.style.borderRadius = '0';
    cr.style.borderColor = 'var(--accent)';
    cr.style.background = 'transparent';
    cr.style.transform = 'translate(-50%,-50%) rotate(45deg)';
  });
  row.addEventListener('mouseleave', () => {
    cr.style.width = '36px'; cr.style.height = '36px';
    cr.style.borderRadius = '50%';
    cr.style.transform = 'translate(-50%,-50%) rotate(0deg)';
  });
});

document.querySelectorAll('[data-mag]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r  = el.getBoundingClientRect();
    const dx = e.clientX - r.left - r.width  / 2;
    const dy = e.clientY - r.top  - r.height / 2;
    gsap.to(el, { x: dx * .32, y: dy * .32, duration: .3 });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)' });
  });
});

const tickerWords = [
  ['VR DEVELOPER', false], ['·', true],
  ['UX DESIGNER',  false], ['·', true],
  ['CREATIVE TECHNOLOGIST', false], ['·', true],
  ['FULL STACK',   false], ['·', true],
  ['OPEN TO WORK', false], ['·', true],
  ['TOYOHASHI — JAPAN', false], ['·', true],
];
const track = document.getElementById('tt');
[...tickerWords, ...tickerWords].forEach(([w, ac]) => {
  const s = document.createElement('span');
  s.className   = 'ti' + (ac ? ' ac' : '');
  s.textContent = w;
  track.appendChild(s);
});

const prows     = document.querySelectorAll('.prow');
const origTitles = [];
prows.forEach((row, i) => { origTitles[i] = row.querySelector('.pt').textContent; });

function scramble(el, original) {
  let frame = 0;
  const total = 18;
  const id = setInterval(() => {
    const p = frame / total;
    let result = '';
    for (let c = 0; c < original.length; c++) {
      if (original[c] === ' ') { result += ' '; continue; }
      result += c / original.length < p
        ? original[c]
        : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    }
    el.textContent = result;
    if (++frame > total) { clearInterval(id); el.textContent = original; }
  }, 28);
  return id;
}

const markerOrigZ   = markerPositions.map(p => p.z);
const markerTargetZ = [...markerOrigZ];
window._markerTargetZ = markerTargetZ;

const scrambleIds = new Array(prows.length).fill(null);

prows.forEach((row, i) => {
  const titleEl = row.querySelector('.pt');

  row.addEventListener('mouseenter', () => {
    row.classList.add('hov');
    if (scrambleIds[i]) clearInterval(scrambleIds[i]);
    scrambleIds[i] = scramble(titleEl, origTitles[i]);
    hoveredProj = i;
    markerTargetZ[i] = markerOrigZ[i] + 20;
  });

  row.addEventListener('mouseleave', () => {
    row.classList.remove('hov');
    if (scrambleIds[i]) clearInterval(scrambleIds[i]);
    titleEl.textContent = origTitles[i];
    hoveredProj = -1;
    markerTargetZ[i] = markerOrigZ[i];
    gsap.to(row, { rotationX: 0, rotationY: 0, duration: .7, ease: 'power2.out' });
  });

  row.addEventListener('mousemove', e => {
    const r  = row.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width  - .5;
    const ny = (e.clientY - r.top)  / r.height - .5;
    gsap.to(row, {
      rotationX: -ny * 6, rotationY: nx * 6,
      transformPerspective: 900, duration: .25, ease: 'power1.out',
    });
  });
});

const skCards   = document.querySelectorAll('.sk');
const skOrigCats = [];
skCards.forEach((sk, i) => { skOrigCats[i] = sk.querySelector('.skcat').textContent; });

skCards.forEach((sk, i) => {
  const catEl = sk.querySelector('.skcat');
  const svEls = sk.querySelectorAll('.sv');
  let catScramId = null;
  let svTimers   = [];

  sk.addEventListener('mouseenter', () => {
    sk.classList.add('skhov');

    
    if (catScramId) clearInterval(catScramId);
    let frame = 0, total = 12;
    const orig = skOrigCats[i];
    catScramId = setInterval(() => {
      const p = frame / total;
      let out = '';
      for (let c = 0; c < orig.length; c++) {
        if (orig[c] === ' ' || orig[c] === '&') { out += orig[c]; continue; }
        out += c / orig.length < p
          ? orig[c]
          : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      }
      catEl.textContent = out;
      if (++frame > total) { clearInterval(catScramId); catEl.textContent = orig; }
    }, 32);

    
    svTimers.forEach(t => clearTimeout(t));
    svTimers = [];
    svEls.forEach((sv, j) => {
      sv.style.opacity    = '0.15';
      sv.style.transform  = 'translateY(4px)';
      sv.style.transition = 'none';
      const t = setTimeout(() => {
        sv.style.transition = 'opacity .3s ease, transform .3s ease, color .3s';
        sv.style.opacity    = '1';
        sv.style.transform  = 'translateY(0)';
        sv.style.color      = 'rgba(232,228,220,1)';
      }, 80 + j * 55);
      svTimers.push(t);
    });

    
    cr.style.width = '18px'; cr.style.height = '18px';
    cr.style.borderRadius = '0';
    cr.style.transform    = 'translate(-50%,-50%) rotate(45deg)';
    cr.style.borderColor  = 'rgba(0,229,200,.8)';
  });

  sk.addEventListener('mouseleave', () => {
    sk.classList.remove('skhov');
    if (catScramId) { clearInterval(catScramId); catEl.textContent = skOrigCats[i]; }
    svTimers.forEach(t => clearTimeout(t));
    svEls.forEach(sv => {
      sv.style.transition = 'opacity .3s, transform .3s, color .3s';
      sv.style.opacity    = '1';
      sv.style.transform  = 'translateY(0)';
      sv.style.color      = '';
    });

    
    cr.style.width = '36px'; cr.style.height = '36px';
    cr.style.borderRadius = '50%';
    cr.style.transform    = 'translate(-50%,-50%) rotate(0deg)';
    cr.style.borderColor  = 'var(--accent)';

    gsap.to(sk, { rotationX: 0, rotationY: 0, z: 0, duration: .7, ease: 'elastic.out(1,.5)' });
  });

  
  sk.addEventListener('mousemove', e => {
    const r  = sk.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width  - .5;
    const ny = (e.clientY - r.top)  / r.height - .5;
    gsap.to(sk, {
      rotationX: -ny * 10, rotationY: nx * 10, z: 16,
      transformPerspective: 700, duration: .2, ease: 'power1.out',
    });
  });
});

const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in'); });
}, { threshold: .1 });

document.querySelectorAll('.rv').forEach((el, i) => {
  el.style.transitionDelay = (i % 4 * .09) + 's';
  obs.observe(el);
});
