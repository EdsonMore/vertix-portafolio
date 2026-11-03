// WhatsApp de Vertix Studio (código de país + número, sin "+")
const WHATSAPP = "51916629138";

document.querySelectorAll("[data-wa]").forEach(a => {
  a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(a.dataset.wa)}`;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
});

// Header al hacer scroll
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("scrolled", scrollY > 20);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Menú móvil
const toggle = document.getElementById("menuToggle");
const setMenu = open => {
  document.body.classList.toggle("menu-open", open);
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
};
toggle.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
document.querySelectorAll("#navLinks a").forEach(a => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", e => e.key === "Escape" && setMenu(false));

// Aparición al hacer scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Filtros del portafolio
const grid = document.getElementById("projectGrid");
document.querySelectorAll(".filters button").forEach(btn => btn.addEventListener("click", () => {
  const f = btn.dataset.filter;
  document.querySelectorAll(".filters button").forEach(b => b.setAttribute("aria-pressed", b === btn));
  grid.classList.toggle("filtered", f !== "all");
  grid.querySelectorAll(".project").forEach(p => {
    p.hidden = f !== "all" && p.dataset.cat !== f;
    p.classList.add("visible"); // sin esperar al scroll tras filtrar
  });
}));

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
