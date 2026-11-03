# Vertix Studio · Portafolio

Sitio estático (HTML + CSS + JS, sin framework) del portafolio de Vertix Studio. Carga instantánea y deploy sin build.

Lighthouse móvil (local): Performance 100 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100.

## Correr en local

```bash
npx serve .          # o: npm run dev
```

Abre la URL que muestre la consola. Usa un servidor: las rutas son absolutas (`/assets/...`) y no funcionan abriendo el archivo con doble clic.

## Editar proyectos

Todos los proyectos viven en **`scripts/projects.mjs`** (nombre, categoría, texto, stack, URL). Después de editarlo:

```bash
npm run build        # regenera el grid del home, /proyectos/<slug>/ y sitemap.xml
```

El grid se inyecta en `index.html` entre `<!-- PROJECTS:START -->` y `<!-- PROJECTS:END -->`; no edites a mano esa parte.

Capturas nuevas (necesita `npm install` una vez, que instala Playwright):

```bash
npm run capture              # todas
npm run capture fairmap      # solo una
```

Los proyectos sin URL pública (EcoDataAI, SaldoClaro, MediLink Plus) usan mockups en CSS (`mock: "map" | "phone" | "dash"`). Si les agregas `url`, pasan a usar captura real.

## Dominio

El dominio provisional es `https://vertix-studio.vercel.app`. Si usas otro, cámbialo en:
1. `scripts/build.mjs` → constante `SITE`, y vuelve a correr `npm run build`.
2. `index.html`, `robots.txt` → busca y reemplaza `vertix-studio.vercel.app`.

## Deploy

**Vercel** (recomendado):
```bash
npm i -g vercel
vercel deploy --prod
```
`vercel.json` ya define: sin instalación, build `node scripts/build.mjs`, salida `.`, cabeceras de seguridad y caché de `/assets`.

**Netlify**:
```bash
npm i -g netlify-cli
netlify deploy --prod --dir .
```
`netlify.toml` publica la raíz con las mismas cabeceras.

También puedes subir la carpeta a GitHub y conectarla desde el panel de Vercel o Netlify (cada push se publica solo).

## Estructura

```
index.html                  Home (hero, problema, servicios, portafolio, stack, nichos, proceso, CTA)
proyectos/<slug>/index.html Página de detalle de cada proyecto (generada)
demos/                      Demos navegables: barbería, picantería, constructora (noindex)
assets/css/site.css         Estilos compartidos
assets/js/site.js           WhatsApp, menú, animaciones, filtros
assets/img/                 favicon.svg, og.jpg, apple-touch-icon.png, projects/*.jpg
scripts/projects.mjs        Datos de los proyectos (fuente única)
scripts/build.mjs           Generador de grid, detalles y sitemap
scripts/capture.mjs         Capturas con Playwright
docs/                       Capturas del home (desktop y móvil)
SPEC.md, tasks/plan.md      Especificación y plan
```

El número de WhatsApp está en `assets/js/site.js` (`WHATSAPP`) y en `scripts/build.mjs` (`WA`).
