# Spec: Portafolio Vertix Studio

## Objetivo
Evolucionar la landing actual (`index.html`) a un portafolio que convierta: el dueño de negocio en Perú ve proyectos reales, entiende qué puede tener y escribe por WhatsApp (+51 916 629 138).

Supuestos (no hubo preguntas, por instrucción del usuario):
1. Sitio 100% estático (HTML/CSS/JS), sin framework: carga instantánea, deploy sin build en Vercel o Netlify.
2. Dominio provisional `https://vertix-studio.vercel.app` (canonical, OG, sitemap). Se cambia en un solo lugar: `scripts/build.mjs` (`SITE`) + buscar/reemplazar en `index.html`.
3. EcoDataAI, SaldoClaro y MediLink Plus no tienen URL pública ni repo accesible: van con mockup CSS y CTA a WhatsApp, sin link "Ver proyecto".
4. Las demos de `PAGINAS_WEB_DEMO` (Urban Cut, El Buen Sabor, Constructora 360) se publican dentro del portafolio en `/demos/*`, con el WhatsApp de Vertix en lugar del número de relleno.
5. El nombre real de la demo de barbería es "Urban Cut" (no "The Barber Club") y el de la picantería "El Buen Sabor".

## Proyectos (solo estos, nada inventado)
| slug | Nombre | Categoría | URL |
|---|---|---|---|
| miaula | MiAula | Sistema | mi-aula-neon.vercel.app |
| fairmap | FairMap | Sistema | fairmap-kappa.vercel.app |
| ecodataai | EcoDataAI | Sistema | — |
| saldoclaro | SaldoClaro | Sistema (app Android) | — |
| medilink | MediLink Plus | Sistema | — |
| libreria-bazar | Librería Bazar | Catálogo | libreria-bazar-paginaweb.vercel.app |
| sinole | SINOLE | Web | websinole.vercel.app |
| rafael-norte | Comercial Rafael Norte | Web · Demo | rafaelnorte-demo.netlify.app |
| urban-cut | Urban Cut | Demo | /demos/barberia/ |
| el-buen-sabor | El Buen Sabor | Demo | /demos/picanteria/ |
| constructora-360 | Constructora 360 | Demo | /demos/constructora/ |

## Estructura
```
index.html                 Home (grid de proyectos inyectado por build)
proyectos/<slug>/index.html  Detalle por proyecto (generado)
demos/{barberia,picanteria,constructora}/  Copias de las demos
assets/css/site.css        Estilos compartidos (de la landing base)
assets/js/site.js          WhatsApp, menú, reveal, filtros
assets/img/                Capturas JPEG + og.jpg + favicon.svg
scripts/projects.mjs       Datos de proyectos (fuente única)
scripts/build.mjs          Genera grid, detalles y sitemap.xml
scripts/capture.mjs        Capturas con Playwright
robots.txt, sitemap.xml, vercel.json, netlify.toml
```

## Comandos
```
npm install                 # solo para capturas (playwright)
npm run capture             # regenera assets/img/projects/*.jpg
npm run build               # regenera grid, detalles y sitemap
npx serve .                 # local
vercel deploy --prod  |  netlify deploy --prod --dir .
```

## Estilo
Paleta y logo de la guía de marca, sin cambios. Poppins (títulos) + Inter (texto). Copy en primera persona, tuteo, beneficio, sin jerga técnica (el stack se muestra como badges, no en el copy).

## Criterios de éxito
- Grid con los 11 proyectos, filtro Todos / Webs / Catálogos / Sistemas / Demos, cada uno con captura o mockup, categoría, stack, beneficio en 1-2 líneas y CTA.
- Página de detalle por proyecto con captura desktop + móvil (cuando hay), qué resuelve, qué incluye, stack y CTA.
- Sección Stack con badges: Next.js, React, Flutter, PostgreSQL, Supabase, Tailwind, TypeScript, IA.
- SEO: title/description únicos, canonical, Open Graph + Twitter, favicon SVG, sitemap.xml, robots.txt, JSON-LD ProfessionalService.
- Imágenes con `loading="lazy"`, width/height y < 200 KB cada una.
- Responsive desde 360 px, focus visible, aria-labels, `prefers-reduced-motion`.
- Lighthouse móvil ≥ 90 en Performance, Accessibility, Best Practices y SEO.
- Todo link externo con `rel="noopener"`; sin formularios (no hay datos que filtrar).

## Límites
- Siempre: respetar la paleta y el logo, y el copy en español de Perú.
- Nunca: inventar proyectos, métricas ni testimonios; mostrar jerga técnica en el copy.
