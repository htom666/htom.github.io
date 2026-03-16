

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>/\\|[]{}';

const W = () => window.innerWidth;
const H = () => window.innerHeight;

const canvas = document.getElementById('c');
const scene  = new THREE.Scene();
scene.fog    = new THREE.FogExp2(0x060609, 0.009);

const camera = new THREE.PerspectiveCamera(60, W() / H(), 0.1, 1000);
camera.position.set(0, 0, 36);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(W(), H());
renderer.setClearColor(0x060609, 1);

const knotGeo = new THREE.TorusKnotGeometry(9, 2.6, 150, 20);

const knotSolid = new THREE.Mesh(knotGeo, new THREE.MeshPhongMaterial({
  color: 0x001e1c, emissive: 0x000e0d,
  specular: 0x00e5c8, shininess: 70,
  transparent: true, opacity: .93,
}));
scene.add(knotSolid);

const knotWire = new THREE.Mesh(knotGeo, new THREE.MeshBasicMaterial({
  color: 0x00e5c8, wireframe: true,
  transparent: true, opacity: .38,
}));
scene.add(knotWire);

const pl1 = new THREE.PointLight(0x00e5c8, 5, 80); pl1.position.set( 22,  14,  14); scene.add(pl1);
const pl2 = new THREE.PointLight(0xff6040, 3, 65); pl2.position.set(-26, -14,   8); scene.add(pl2);
const pl3 = new THREE.PointLight(0x4040ff, 2, 70); pl3.position.set(  0,  20, -20); scene.add(pl3);
scene.add(new THREE.AmbientLight(0x060609, .7));

function mkRing(r, tube, col, op, rx, ry, rz) {
  const m = new THREE.Mesh(
    new THREE.TorusGeometry(r, tube, 8, 100),
    new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op })
  );
  m.rotation.set(rx, ry, rz);
  scene.add(m);
  return m;
}
const ring1 = mkRing(14, .04,  0x00e5c8, .22,  Math.PI * .32, 0, 0);
const ring2 = mkRing(21, .03,  0xff6040, .14, -Math.PI * .18, Math.PI * .12, 0);
const ring3 = mkRing(27, .025, 0x4444ff, .09,  Math.PI * .5,  0, Math.PI * .22);

const ico = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.2, 1),
  new THREE.MeshBasicMaterial({ color: 0x00e5c8, wireframe: true, transparent: true, opacity: .55 })
);
scene.add(ico);

const pCount = 3500;
const pPos   = new Float32Array(pCount * 3);
const pOrig  = new Float32Array(pCount * 3);
for (let i = 0; i < pCount * 3; i++) { pPos[i] = (Math.random() - .5) * 110; pOrig[i] = pPos[i]; }
const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: .06, color: 0x00e5c8, transparent: true, opacity: .6 }));
scene.add(pMesh);

const hCount = 1000;
const hPos   = new Float32Array(hCount * 3);
for (let i = 0; i < hCount * 3; i++) hPos[i] = (Math.random() - .5) * 80;
const hGeo = new THREE.BufferGeometry();
hGeo.setAttribute('position', new THREE.BufferAttribute(hPos, 3));
const hMesh = new THREE.Points(hGeo, new THREE.PointsMaterial({ size: .09, color: 0xff6040, transparent: true, opacity: .18 }));
scene.add(hMesh);

const grid = new THREE.GridHelper(160, 42, 0x001c1a, 0x001c1a);
grid.position.y = -22;
grid.material.transparent = true;
grid.material.opacity = .65;
scene.add(grid);

const knot2 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(7, 2, 120, 16),
  new THREE.MeshBasicMaterial({ color: 0xff6040, wireframe: true, transparent: true, opacity: 0 })
);
knot2.position.set(0, 0, -55);
scene.add(knot2);

const markerShapes = [
  new THREE.IcosahedronGeometry(1.6, 1),
  new THREE.OctahedronGeometry(1.8, 0),
  new THREE.TetrahedronGeometry(1.9, 0),
  new THREE.IcosahedronGeometry(1.4, 0),
];
const markerPositions = [
  { x: -13, y:   5, z:  -8 },
  { x:  11, y:  -7, z: -14 },
  { x:  -7, y: -10, z: -20 },
  { x:  15, y:   7, z: -26 },
];
const markerColors = [0x00e5c8, 0xff6040, 0x00e5c8, 0xff6040];
const markers = markerPositions.map((pos, i) => {
  const m = new THREE.Mesh(
    markerShapes[i],
    new THREE.MeshBasicMaterial({ color: markerColors[i], wireframe: true, transparent: true, opacity: 0 })
  );
  m.position.set(pos.x, pos.y, pos.z);
  scene.add(m);
  return m;
});

let camZ   = 36;
let camY   = 0;
let camFov = 60;

let mxT = 0, myT = 0, mx = 0, my = 0;
document.addEventListener('mousemove', e => {
  mxT = (e.clientX / W() - .5) * 2;
  myT = -(e.clientY / H() - .5) * 2;
});

let didBreakthrough = false;
let hoveredProj     = -1;   

function lerp(a, b, t)  { return a + (b - a) * t; }
function clamp01(t)     { return Math.max(0, Math.min(1, t)); }
function ease(t)        { return t < .5 ? 2*t*t : -1 + (4 - 2*t)*t; }
function easeIn(t)      { return t * t * t; }
function easeOut(t)     { return 1 - Math.pow(1 - t, 3); }

let t = 0;
let _rendering = false;

function render() {
  requestAnimationFrame(render);
  t += 0.005;

  mx += (mxT - mx) * .042;
  my += (myT - my) * .042;

  
  const p_heroToAbout = progress(ch.heroEnd * .4, ch.aboutEnd);
  const p_workToEnd   = progress(ch.workEnd, ch.totalEnd);

  
  camZ += (targetCamZ - camZ) * .055;

  if (camZ < -0.5) didBreakthrough = true;
  if (camZ >  2.0) didBreakthrough = false;

  
  const approachT  = clamp01((36 - camZ) / 30);
  const tgtCamY    = lerp(0, 1.5, ease(clamp01(approachT - .3)));
  camY += (tgtCamY - camY) * .04;

  
  const nearBreak = camZ > 0 ? clamp01(1 - camZ / 12) : 0;
  const tgtFov    = lerp(60, 82, ease(nearBreak));
  camFov += (tgtFov - camFov) * .06;
  camera.fov = camFov;
  camera.updateProjectionMatrix();

  
  camera.position.x += (mx * 5 - camera.position.x) * .04;
  camera.position.y += (my * 3 + camY - camera.position.y) * .04;
  camera.position.z  = camZ;
  camera.lookAt(scene.position);

  
  knotWire.rotation.x += .0022;
  knotWire.rotation.y += .0045;
  knotSolid.rotation.copy(knotWire.rotation);

  let kScale = 1;
  if (camZ > 0 && camZ < 20)   kScale = lerp(1, 1.45, ease(1 - camZ / 20));
  else if (camZ < 0 && camZ > -10) kScale = lerp(1.45, .88, ease(Math.abs(camZ) / 10));
  knotWire.scale.setScalar(knotWire.scale.x + (kScale - knotWire.scale.x) * .07);
  knotSolid.scale.copy(knotWire.scale);

  const beyondT = clamp01(-camZ / 10);
  knotWire.material.opacity  = lerp(.38, .2,  beyondT);
  knotSolid.material.opacity = lerp(.93, .35, ease(clamp01((20 - camZ) / 20)));

  
  knot2.rotation.y += .006; knot2.rotation.z += .003;
  knot2.material.opacity = lerp(0, .45, ease(beyondT));

  
  ring1.rotation.z += .0014; ring2.rotation.y += .001; ring3.rotation.z -= .0008;
  const ringScale = lerp(1, .7, ease(clamp01((36 - camZ) / 30)));
  ring1.scale.setScalar(ringScale); ring2.scale.setScalar(ringScale);

  
  ico.position.x = Math.cos(t * .7) * 14;
  ico.position.y = Math.sin(t * .5) * 8;
  ico.position.z = Math.sin(t * .9) * 5;
  ico.rotation.x += .018; ico.rotation.y += .013;

  
  const warmT = ease(beyondT);
  pl1.color.setRGB(lerp(0x00, 0xff, warmT)/255, lerp(0xe5, 0x60, warmT)/255, lerp(0xc8, 0x40, warmT)/255);
  pl2.color.setRGB(lerp(0xff, 0x44, warmT)/255, lerp(0x60, 0x44, warmT)/255, lerp(0x40, 0xff, warmT)/255);
  pl1.position.x = Math.sin(t * .42) * 26; pl1.position.y = Math.cos(t * .3)  * 16;
  pl2.position.x = Math.cos(t * .37) * -28; pl2.position.y = Math.sin(t * .52) * -16;

  
  pMesh.rotation.y += .00022; pMesh.rotation.x += .00008;
  hMesh.material.opacity = lerp(.18, .6, ease(beyondT));
  hMesh.rotation.y -= .0003;

  
  markers.forEach((m, i) => {
    const mz   = markerPositions[i].z;
    const dist = camZ - mz;
    const vis  = ease(clamp01(1 - dist / 12));
    const tz   = window._markerTargetZ ? window._markerTargetZ[i] : mz;

    m.position.z += (tz - m.position.z) * .08;

    const isHov     = hoveredProj === i;
    const spinSpeed = isHov ? .06 : .012 + i * .003;
    m.rotation.x += spinSpeed; m.rotation.y += spinSpeed * .75;

    const tgtScale = isHov ? 2.2 : 1;
    m.scale.x += (tgtScale - m.scale.x) * .1;
    m.scale.y = m.scale.z = m.scale.x;

    m.material.opacity = isHov ? lerp(.5, .9, Math.sin(t * 6) * .5 + .5) : lerp(0, .5, vis);
  });

  
  grid.position.y = lerp(-22, -30, ease(p_heroToAbout));

  
  document.getElementById('vig').style.opacity = ease(nearBreak) * .85;

  
  const r = lerp(6, 10, warmT), g = lerp(6, 5, warmT), b = lerp(9, 6, warmT);
  renderer.setClearColor(new THREE.Color(`rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`), 1);

  
  document.getElementById('spbar').style.height = (rawScroll / ch.totalEnd * 100) + '%';

  
  const badge = document.getElementById('sbadge');
  if      (rawScroll < ch.heroEnd)  badge.textContent = '[ 00 — HERO ]';
  else if (rawScroll < ch.aboutEnd) badge.textContent = '[ 01 — ABOUT ]';
  else if (rawScroll < ch.workEnd)  badge.textContent = '[ 02 — WORK ]';
  else                              badge.textContent = '[ 03 — CONTACT ]';

  
  const cue = document.getElementById('scrollcue');
  cue.style.opacity = rawScroll < 60 ? 0 : rawScroll < 300 ? .7 : 0;

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = W() / H();
  camera.updateProjectionMatrix();
  renderer.setSize(W(), H());
  calcChapters();
});
