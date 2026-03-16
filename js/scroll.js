

let rawScroll    = 0;
let smoothScroll = 0;
let targetCamZ   = 36;

let ch = { heroEnd: 0, aboutEnd: 0, workEnd: 0, totalEnd: 1 };

window.addEventListener('scroll', () => { rawScroll = window.scrollY; });

function calcChapters() {
  ch.heroEnd  = document.getElementById('hero').offsetHeight;
  ch.aboutEnd = ch.heroEnd  + document.getElementById('about').offsetHeight;
  ch.workEnd  = ch.aboutEnd + document.getElementById('work').offsetHeight;
  ch.totalEnd = Math.max(1, document.body.scrollHeight - window.innerHeight);
}

function progress(start, end) {
  return clamp01((smoothScroll - start) / Math.max(1, end - start));
}

function updateScroll() {
  smoothScroll += (rawScroll - smoothScroll) * .07;

  if (smoothScroll <= ch.heroEnd) {
    targetCamZ = 36;

  } else if (smoothScroll <= ch.aboutEnd) {
    const t1 = ease(progress(ch.heroEnd, ch.aboutEnd));
    targetCamZ = lerp(36, 7, t1);       

  } else if (smoothScroll <= ch.workEnd) {
    const t2 = ease(progress(ch.aboutEnd, ch.workEnd));
    targetCamZ = lerp(7, -22, t2);      

  } else {
    const t3 = easeOut(progress(ch.workEnd, ch.totalEnd));
    targetCamZ = lerp(-22, 28, t3);     
  }

  requestAnimationFrame(updateScroll);
}

updateScroll();
