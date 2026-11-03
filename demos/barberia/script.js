// ⚠️ Cambia aquí el número de WhatsApp (código de país + número, sin "+" ni espacios)
const WHATSAPP = "51916629138";
const META_CORTES = 6;

// localStorage puede fallar en algunos navegadores con file:// o modo privado
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
};

/* ---------- Reserva ---------- */
const $barbero = document.getElementById("barbero");
const $fecha = document.getElementById("fecha");
const $hora = document.getElementById("hora");

const fmtFecha = new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "long" });

for (let i = 0; i < 7; i++) {
  const d = new Date();
  d.setDate(d.getDate() + i);
  const txt = fmtFecha.format(d);
  const label = i === 0 ? `Hoy (${txt})` : i === 1 ? `Mañana (${txt})` : txt;
  $fecha.add(new Option(label.charAt(0).toUpperCase() + label.slice(1), txt));
}

// Slots de 30 min: 10:00 ... 19:30 (el último termina a las 20:00)
function pintarHoras() {
  const esHoy = $fecha.selectedIndex === 0;
  const ahora = new Date();
  const minAhora = ahora.getHours() * 60 + ahora.getMinutes();
  $hora.innerHTML = "";
  for (let m = 10 * 60; m < 20 * 60; m += 30) {
    if (esHoy && m <= minAhora) continue;
    const h = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    $hora.add(new Option(h, h));
  }
  if (!$hora.options.length) $hora.add(new Option("Sin horarios hoy", ""));
}
$fecha.addEventListener("change", pintarHoras);
pintarHoras();

let turno = null;

document.getElementById("formReserva").addEventListener("submit", (e) => {
  e.preventDefault();
  turno = { barbero: $barbero.value, fecha: $fecha.value, hora: $hora.value };
  document.getElementById("resumenLista").innerHTML = `
    <li>Barbero: <strong>${turno.barbero}</strong></li>
    <li>Fecha: <strong>${turno.fecha}</strong></li>
    <li>Hora: <strong>${turno.hora}</strong></li>`;
  const r = document.getElementById("resumen");
  r.hidden = false;
  r.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

document.getElementById("btnWsp").addEventListener("click", () => {
  if (!turno) return;
  const msg = `¡Hola Urban Cut! Quiero confirmar mi turno:\n\n✂️ Barbero: ${turno.barbero}\n📅 Fecha: ${turno.fecha}\n🕒 Hora: ${turno.hora}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
});

/* ---------- Tarjeta de fidelidad ---------- */
const $sellos = document.getElementById("sellos");
const $contador = document.getElementById("contador");
const $btnSellar = document.getElementById("btnSellar");
let cortes = Math.min(META_CORTES, Number(store.get("urbanCut_cortes")) || 0);

function pintarSellos() {
  $sellos.innerHTML = Array.from({ length: META_CORTES }, (_, i) =>
    `<div class="sello ${i < cortes ? "on" : ""}">${i < cortes ? "✂" : i + 1}</div>`).join("");
  const gratis = cortes >= META_CORTES;
  $contador.textContent = gratis ? "¡Corte gratis! 🎉" : `${cortes} de ${META_CORTES} cortes`;
  $contador.classList.toggle("gratis", gratis);
  $btnSellar.disabled = gratis;
  store.set("urbanCut_cortes", cortes);
}

$btnSellar.addEventListener("click", () => { cortes = Math.min(META_CORTES, cortes + 1); pintarSellos(); });
document.getElementById("btnReset").addEventListener("click", () => { cortes = 0; pintarSellos(); });
pintarSellos();

/* ---------- ¿Cuánta gente hay? ---------- */
const ESTADOS = [
  { txt: "Poco", desc: "Pasa ahora, casi sin espera.", color: "#2ecc71" },
  { txt: "Normal", desc: "Espera aproximada de 20 a 30 minutos.", color: "#f1c40f" },
  { txt: "Lleno", desc: "Mejor reserva tu turno para otra hora.", color: "#e74c3c" },
];
let estado = Number(store.get("urbanCut_estado")) || 0;

function pintarEstado() {
  const s = ESTADOS[estado % ESTADOS.length];
  document.getElementById("estado").style.setProperty("--c", s.color);
  document.getElementById("estadoTxt").textContent = s.txt;
  document.getElementById("estadoDesc").textContent = s.desc;
  store.set("urbanCut_estado", estado);
}

document.getElementById("btnEstado").addEventListener("click", () => {
  estado = (estado + 1) % ESTADOS.length;
  pintarEstado();
});
pintarEstado();

/* ---------- Imágenes: si Unsplash falla, usar Picsum ---------- */
document.querySelectorAll("img").forEach((img, i) => {
  img.addEventListener("error", () => { img.src = `https://picsum.photos/seed/urbancut${i}/800/800?grayscale`; }, { once: true });
});
