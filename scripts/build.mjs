// Genera: grid del portafolio en index.html, /proyectos/<slug>/index.html y sitemap.xml.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { projects, CATS } from "./projects.mjs";

const SITE = "https://vertix-studio.vercel.app"; // cambia aquí el dominio final
const WA = "https://wa.me/51916629138";
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const img = (slug, kind) => `/assets/img/projects/${slug}-${kind}.jpg`;
const hasShot = p => existsSync(`.${img(p.slug, "desktop")}`);
const host = p => p.url ? (p.url.startsWith("/") ? `demo · ${p.name.toLowerCase()}` : new URL(p.url).host) : `${p.name.toLowerCase()} · sistema`;
const waMsg = p => `Hola, vi ${p.name} en tu portafolio y quiero algo así para mi negocio.`;

const MOCKS = {
  map: p => `<div class="mock mock-map" role="img" aria-label="Vista ilustrativa de ${esc(p.name)}: mapa con árboles registrados">
      <i class="pin" style="left:18%;top:30%"></i><i class="pin" style="left:34%;top:62%"></i><i class="pin" style="left:62%;top:24%"></i><i class="pin" style="left:78%;top:58%"></i><i class="pin" style="left:48%;top:44%"></i>
      <div class="mock-panel">Algarrobo · Piura<b>Alta</b>probabilidad de supervivencia<div class="meter"><i></i></div></div></div>`,
  phone: p => `<div class="mock mock-phone-bg" role="img" aria-label="Vista ilustrativa de ${esc(p.name)} en un celular">
      <div class="phone"><small>Te alcanza para</small><b>~68 días</b><span class="row g"></span><span class="row"></span><span class="row"></span><span class="row"></span></div></div>`,
  dash: p => `<div class="mock mock-dash-bg" role="img" aria-label="Vista ilustrativa del panel de ${esc(p.name)}">
      <div class="dash"><aside><i></i><i></i><i></i><i></i><i></i></aside><main>
      <div class="kpis"><span>Citas<b>Hoy</b></span><span>Recetas<b>En curso</b></span><span>Stock<b>Al día</b></span></div>
      <div class="list"><i></i><i></i><i></i><i></i><i></i></div></main></div></div>`,
};

const shot = (p, eager = false) => hasShot(p)
  ? `<img src="${img(p.slug, "desktop")}" alt="Captura de ${esc(p.name)}" width="1280" height="800" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`
  : MOCKS[p.mock](p);

const chips = p => [
  `<span class="chip cat">${CATS[p.cat]}</span>`,
  p.live ? `<span class="chip live">● En línea</span>` : "",
  p.isDemo && p.cat !== "demo" ? `<span class="chip">Demo</span>` : "",
].join("");

const stackList = p => `<ul class="stack-mini" aria-label="Tecnologías">${p.stack.map(s => `<li>${esc(s)}</li>`).join("")}</ul>`;

const card = (p, i) => `
        <article class="project reveal${i % 3 ? ` d${i % 3}` : ""}${i === 0 ? " wide" : ""}" data-cat="${p.cat}">
          <div class="browser" aria-hidden="true"><i></i><i></i><i></i><span>${esc(host(p))}</span></div>
          <div class="shot">${shot(p)}</div>
          <div class="project-body">
            <div class="project-meta">${chips(p)}</div>
            <h3><a href="/proyectos/${p.slug}/">${esc(p.name)}</a></h3>
            <p class="label">${esc(p.label)}</p>
            <p>${esc(p.tagline)}</p>
            ${stackList(p)}
            <div class="project-links">
              <a class="project-link" href="/proyectos/${p.slug}/" aria-label="Ver caso: ${esc(p.name)}">Ver caso <span aria-hidden="true">→</span></a>
              ${p.url
                ? `<a class="project-link alt" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="Ver en vivo: ${esc(p.name)} (se abre en otra pestaña)">Ver en vivo <span aria-hidden="true">↗</span></a>`
                : `<a class="project-link alt" href="${WA}" data-wa="${esc(waMsg(p))}" aria-label="Quiero uno así, como ${esc(p.name)} (WhatsApp)">Quiero uno así <span aria-hidden="true">→</span></a>`}
            </div>
          </div>
        </article>`;

// ---------- Grid en index.html ----------
const counts = Object.fromEntries(Object.keys(CATS).map(c => [c, projects.filter(p => p.cat === c).length]));
const filters = `
      <div class="filters reveal" role="group" aria-label="Filtrar proyectos">
        <button type="button" data-filter="all" aria-pressed="true">Todos<span>${projects.length}</span></button>
        ${Object.entries(CATS).map(([c, n]) => `<button type="button" data-filter="${c}" aria-pressed="false">${n === "Web" ? "Webs" : n === "Catálogo" ? "Catálogos" : n === "Sistema" ? "Sistemas" : "Demos"}<span>${counts[c]}</span></button>`).join("\n        ")}
      </div>`;
const grid = `<!-- PROJECTS:START -->${filters}
      <div class="portfolio-grid" id="projectGrid">${projects.map(card).join("")}
      </div>
<!-- PROJECTS:END -->`;
const index = readFileSync("index.html", "utf8");
writeFileSync("index.html", index.replace(/<!-- PROJECTS:START -->[\s\S]*<!-- PROJECTS:END -->/, () => grid));

// ---------- Páginas de detalle ----------
const LOGO = `<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="#11161f" stroke="#1e2633"/><path d="M10 12 L20 29 L30 12" fill="none" stroke="#c6f432" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="30" cy="12" r="2.6" fill="#e9edf3"/></svg>`;
const WA_ICON = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-1 1.2-.4.2-.7.1a8.2 8.2 0 0 1-4.1-3.6c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.5 13.5 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>`;

const page = (p, next) => {
  const title = `${p.name} · ${p.label} | Vertix Studio`;
  const url = `${SITE}/proyectos/${p.slug}/`;
  const ogImg = SITE + (hasShot(p) ? img(p.slug, "desktop") : "/assets/img/og.jpg");
  const mobile = hasShot(p) && existsSync(`.${img(p.slug, "mobile")}`);
  return `<!DOCTYPE html>
<html lang="es-PE">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.tagline)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#07090d">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<meta property="og:type" content="article">
<meta property="og:locale" content="es_PE">
<meta property="og:site_name" content="Vertix Studio">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(p.tagline)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImg}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'"><noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet"></noscript>
<link rel="stylesheet" href="/assets/css/site.css">
<script>document.documentElement.classList.add("js")</script>
</head>
<body>
<a class="skip" href="#main">Saltar al contenido</a>
<header class="header" id="header">
  <nav class="container nav" aria-label="Principal">
    <a href="/" class="logo">${LOGO}<span>Vertix <small>Studio</small></span></a>
    <button class="menu-toggle" id="menuToggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="navLinks"><span></span><span></span><span></span></button>
    <ul class="nav-links" id="navLinks">
      <li><a href="/#servicios">Servicios</a></li>
      <li><a href="/#portafolio">Portafolio</a></li>
      <li><a href="/#proceso">Proceso</a></li>
      <li><a href="${WA}" class="btn btn-primary" data-wa="Hola, quiero cotizar una página web para mi negocio.">Cotizar ahora</a></li>
    </ul>
  </nav>
</header>

<main id="main">
  <section class="page-hero">
    <div class="container">
      <p class="crumbs"><a href="/#portafolio">← Portafolio</a></p>
      <div class="project-meta">${chips(p)}</div>
      <h1>${esc(p.name)}</h1>
      <p class="lead">${esc(p.tagline)}</p>
      <div class="hero-ctas">
        <a href="${WA}" class="btn btn-primary" data-wa="${esc(waMsg(p))}">${WA_ICON} Quiero uno así</a>
        ${p.url ? `<a href="${esc(p.url)}" class="btn btn-ghost" target="_blank" rel="noopener noreferrer">Ver en vivo <span aria-hidden="true">↗</span></a>` : ""}
      </div>
    </div>
  </section>

  <div class="container showcase">
    <div class="project">
      <div class="browser" aria-hidden="true"><i></i><i></i><i></i><span>${esc(host(p))}</span></div>
      <div class="shot">${shot(p, true)}</div>
    </div>
    ${mobile ? `<div class="device"><img src="${img(p.slug, "mobile")}" alt="${esc(p.name)} en celular" width="780" height="1688" loading="lazy" decoding="async"></div>` : ""}
  </div>

  <section class="detail">
    <div class="container">
      <div class="detail-grid">
        <div class="card reveal">
          <h2>Qué resuelve</h2>
          <p>${esc(p.problem)}</p>
          <h2 style="margin-top:2rem">Lo que incluye</h2>
          <ul class="check">${p.features.map(f => `<li>${esc(f)}</li>`).join("")}</ul>
        </div>
        <aside class="card reveal d1">
          <dl class="facts">
            <div><dt>Ideal para</dt><dd>${esc(p.who)}</dd></div>
            <div><dt>Tipo</dt><dd>${CATS[p.cat]} · ${esc(p.label)}</dd></div>
            <div><dt>Tecnologías</dt><dd>${stackList(p)}</dd></div>
          </dl>
        </aside>
      </div>
      <nav class="next" aria-label="Más proyectos">
        <a href="/#portafolio">← Todos los proyectos</a>
        <a href="/proyectos/${next.slug}/">Siguiente: ${esc(next.name)} →</a>
      </nav>
    </div>
  </section>

  <section class="final">
    <div class="container">
      <div class="final-box reveal">
        <span class="eyebrow">Empecemos</span>
        <h2>¿Quieres algo así para <span class="hl">tu negocio?</span></h2>
        <p>Cuéntame qué vendes y cómo trabajas. Te respondo con una propuesta clara, sin compromiso y sin letras pequeñas.</p>
        <div class="hero-ctas"><a href="${WA}" class="btn btn-primary" data-wa="${esc(waMsg(p))}">${WA_ICON} Escríbeme por WhatsApp</a></div>
      </div>
    </div>
  </section>
</main>

<footer>
  <div class="container foot">
    <a href="/" class="logo">${LOGO}<span>Vertix <small>Studio</small></span></a>
    <p>© <span id="year">2026</span> Vertix Studio · Desarrollo web y estrategia digital · Hecho en Perú 🇵🇪</p>
  </div>
</footer>
<a href="${WA}" class="wa-float" data-wa="Hola, vi tu portafolio y quiero información." aria-label="Escribir por WhatsApp">${WA_ICON}</a>
<script src="/assets/js/site.js" defer></script>
</body>
</html>
`;
};

projects.forEach((p, i) => {
  mkdirSync(`proyectos/${p.slug}`, { recursive: true });
  writeFileSync(`proyectos/${p.slug}/index.html`, page(p, projects[(i + 1) % projects.length]));
});

// ---------- sitemap.xml ----------
const today = new Date().toISOString().slice(0, 10);
const urls = ["/", ...projects.map(p => `/proyectos/${p.slug}/`)];
writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`);

console.log(`ok: ${projects.length} proyectos, ${urls.length} URLs en sitemap`);
