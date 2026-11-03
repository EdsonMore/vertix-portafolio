# Plan: Portafolio Vertix Studio

Ver `SPEC.md`. Bloques en orden; cada uno se verifica antes de pasar al siguiente.

1. **Assets**: copiar demos a `/demos` (cambiar número WA), favicon.svg desde `marca/logo-icono.svg`, capturar con Playwright (desktop 1280×800 y móvil 390×844, JPEG q70). Verificar: archivos < 200 KB.
2. **Extraer CSS/JS** de la landing a `assets/` (compartidos con las páginas de detalle). Verificar: el home se ve igual.
3. **Datos + build**: `scripts/projects.mjs` (11 proyectos), `scripts/build.mjs` → grid en `index.html` entre marcadores, `proyectos/<slug>/index.html`, `sitemap.xml`. Verificar: `npm run build` sin errores, links válidos.
4. **Secciones nuevas** en el home: portafolio con filtros, Stack, servicios pulidos; mockups CSS para los sistemas sin captura.
5. **SEO/deploy**: meta, OG (og.jpg capturado del home), JSON-LD, robots, vercel.json/netlify.toml (cache + headers de seguridad), README.
6. **Verificación**: capturas del home desktop/móvil, Lighthouse móvil, revisión de links/a11y, revisión de seguridad.
7. **Commit**: `git init` + commit.

Riesgo: thum.io o los sitios en vivo caen → capturas locales con Playwright (sin dependencia en runtime).
