

const statusMsgs = [
  'INITIALIZING',
  'LOADING ENVIRONMENT',
  'COMPILING SHADERS',
  'CALIBRATING SCENE',
  'READY',
];

const fillEl   = document.getElementById('l-fill');
const pctEl    = document.getElementById('lpn');
const statusEl = document.getElementById('l-status');
const loaderEl = document.getElementById('loader');

let loadP = 0;

function tickLoad() {
  const iv = setInterval(() => {
    loadP += Math.random() * 2.2 + 0.4;
    if (loadP >= 85) {
      loadP = 85;
      clearInterval(iv);
      finishLoad();
    }
    const si = Math.min(Math.floor(loadP / 25), statusMsgs.length - 2);
    statusEl.textContent   = statusMsgs[si];
    fillEl.style.width     = loadP + '%';
    pctEl.textContent      = Math.floor(loadP);
  }, 38);
}

function finishLoad() {
  const iv2 = setInterval(() => {
    loadP += 1.8;
    if (loadP >= 100) {
      loadP = 100;
      clearInterval(iv2);
      fillEl.style.width   = '100%';
      pctEl.textContent    = '100';
      statusEl.textContent = 'READY';
      setTimeout(smoothReveal, 520);
    }
    fillEl.style.width = loadP + '%';
    pctEl.textContent  = Math.floor(loadP);
  }, 18);
}

setTimeout(tickLoad, 500);

function smoothReveal() {
  calcChapters();

  
  camZ = 62;
  camera.position.z = 62;

  
  knotWire.scale.set(0.01, 0.01, 0.01);
  knotSolid.scale.set(0.01, 0.01, 0.01);
  [ring1, ring2, ring3].forEach(r => r.material.opacity = 0);
  pMesh.material.opacity = 0;
  hMesh.material.opacity = 0;

  render(); 

  
  loaderEl.classList.add('fade-out');
  setTimeout(() => { loaderEl.style.display = 'none'; }, 1500);

  
  gsap.to({ z: 62 }, {
    z: 36, duration: 3.2, ease: 'power2.inOut',
    onUpdate: function () { camZ = this.targets()[0].z; },
  });

  
  gsap.to([knotWire.scale, knotSolid.scale], {
    x: 1, y: 1, z: 1, duration: 2.6, ease: 'power3.out', delay: 0.3,
  });

  
  [ring1, ring2, ring3].forEach((r, i) => {
    gsap.to(r.material, {
      opacity: [0.22, 0.14, 0.09][i],
      duration: 2.2, delay: 0.5 + i * 0.28, ease: 'power2.out',
    });
  });

  
  gsap.to(pMesh.material, { opacity: 0.6,  duration: 2.8, delay: 0.4, ease: 'power2.out' });
  gsap.to(hMesh.material, { opacity: 0.18, duration: 2.4, delay: 0.8, ease: 'power2.out' });

  
  gsap.to('#hn1', { y: 0, duration: 1.2, ease: 'power4.out', delay: 0.9  });
  gsap.to('#hn2', { y: 0, duration: 1.2, ease: 'power4.out', delay: 1.12 });

  
  gsap.to('#heb', { opacity: 1, letterSpacing: '6px', duration: 1.1, ease: 'power2.out', delay: 1.55 });

  
  gsap.to('#hsub',   { opacity: 1, y: 0,    duration: 1.0, ease: 'power2.out', delay: 1.85 });
  gsap.to('#havail', { opacity: 1, x: -250, duration: 1.2, ease: 'power3.out', delay: 2.2  });
  gsap.to('#shint',  { opacity: 1,           duration: 1.0,                    delay: 2.7  });
}
