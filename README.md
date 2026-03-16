# Dahech Hatem — Portfolio

Personal portfolio built with Three.js, GSAP, and vanilla JS.
No build step. No framework. One folder, four JS files, one CSS file.

**Live:** `https://YOUR_USERNAME.github.io`

---

## File structure

```
portfolio/
├── index.html          — markup only, no inline styles or scripts
├── css/
│   └── style.css       — all styles and animations
├── js/
│   ├── scene.js        — Three.js scene, 3D objects, render loop
│   ├── scroll.js       — scroll tracking, camera chapter logic
│   ├── loader.js       — loading screen + smooth reveal sequence
│   └── interactions.js — cursor, magnetic, ticker, hover effects
└── README.md
```

---

## Deploy to GitHub Pages

```bash
# 1. Create a repo named exactly: YOUR_USERNAME.github.io
# 2. Clone it
git clone https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io
cd YOUR_USERNAME.github.io

# 3. Drop all portfolio files in here (index.html, css/, js/)
# 4. Push
git add .
git commit -m "init portfolio"
git push origin main

# 5. Settings → Pages → Source → Deploy from branch → main
# Live in ~60 seconds at https://YOUR_USERNAME.github.io
```

---

## Customise

| What | Where |
|---|---|
| Name / copy | `index.html` — edit text directly |
| Email | `index.html` — search `dahech.hatem@gmail.com` |
| Social links | `index.html` — `#contact` section `href` attributes |
| Projects | `index.html` — `.prow` blocks in `#work` section |
| Colors | `css/style.css` — `:root` CSS variables at the top |
| 3D scene | `js/scene.js` — geometry, colors, particle counts |
| Scroll camera | `js/scroll.js` — `targetCamZ` values per section |
| Loader | `js/loader.js` — status messages, timing |

---

## Stack

- **Three.js r128** — WebGL scene, torus knot, particles, orbital rings
- **GSAP 3.11** — scroll-driven camera, reveal animations, hover effects
- **Vanilla JS** — cursor, scramble, skill card interactions
- Both libraries loaded from Cloudflare CDN — no npm needed
