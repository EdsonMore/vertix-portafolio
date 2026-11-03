// ⚠️ Cambia aquí el número de WhatsApp (código de país + número, sin "+" ni espacios)
const WHATSAPP = "51916629138";

const MENU = {
  Entradas: [
    { id: "e1", nombre: "Ocopa arequipeña", desc: "Papas sancochadas con crema de huacatay y maní.", precio: 14 },
    { id: "e2", nombre: "Rocoto relleno", desc: "Rocoto horneado relleno de carne, con pastel de papa.", precio: 22 },
    { id: "e3", nombre: "Solterito de queso", desc: "Ensalada fresca de habas, queso, choclo y aceitunas.", precio: 15 },
  ],
  Segundos: [
    { id: "s1", nombre: "Adobo arequipeño", desc: "Cerdo macerado en chicha de jora con pan de tres puntas.", precio: 28 },
    { id: "s2", nombre: "Chicharrón de chancho", desc: "Crocante, con mote, camote y sarsa criolla.", precio: 30 },
    { id: "s3", nombre: "Cuy chactado", desc: "Cuy frito a la piedra con papas doradas.", precio: 45 },
    { id: "s4", nombre: "Lomo saltado", desc: "Lomo fino al wok con papas fritas y arroz.", precio: 34 },
  ],
  Bebidas: [
    { id: "b1", nombre: "Chicha morada (jarra)", desc: "Preparada en casa con maíz morado y frutas.", precio: 12 },
    { id: "b2", nombre: "Chicha de jora", desc: "Fermentada artesanalmente.", precio: 8 },
    { id: "b3", nombre: "Inca Kola 1L", desc: "Bien helada.", precio: 9 },
  ],
};

const DIA = { id: "dia", nombre: "Chupe de camarones (plato del día)", precio: 32 };

const todos = Object.values(MENU).flat().concat(DIA);
const cantidades = {}; // id -> cantidad

const soles = (n) => "S/ " + n.toFixed(2);

// Pintar la carta
const menuEl = document.getElementById("menu");
menuEl.innerHTML = Object.entries(MENU).map(([cat, platos]) => `
  <div class="categoria">
    <h3>${cat}</h3>
    <div class="platos">
      ${platos.map((p) => `
        <article class="plato">
          <div>
            <h4>${p.nombre}</h4>
            <p>${p.desc}</p>
            <strong class="precio">${soles(p.precio)}</strong>
          </div>
          <div class="qty">
            <button class="menos" data-id="${p.id}" data-d="-1" aria-label="Quitar ${p.nombre}">−</button>
            <span id="q-${p.id}">0</span>
            <button data-id="${p.id}" data-d="1" aria-label="Agregar ${p.nombre}">+</button>
          </div>
        </article>`).join("")}
    </div>
  </div>`).join("");

function cambiar(id, d) {
  cantidades[id] = Math.max(0, (cantidades[id] || 0) + d);
  const q = document.getElementById("q-" + id);
  if (q) q.textContent = cantidades[id];
  actualizar();
}

menuEl.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-id]");
  if (b) cambiar(b.dataset.id, Number(b.dataset.d));
});

document.querySelector("[data-add-dia]").addEventListener("click", () => cambiar("dia", 1));

function seleccion() {
  return todos.filter((p) => cantidades[p.id] > 0).map((p) => ({ ...p, cant: cantidades[p.id] }));
}

function actualizar() {
  const sel = seleccion();
  const total = sel.reduce((s, p) => s + p.precio * p.cant, 0);
  const count = sel.reduce((s, p) => s + p.cant, 0);
  document.getElementById("pedidoTotal").textContent = soles(total);
  document.getElementById("pedidoCount").textContent = count + (count === 1 ? " plato" : " platos");
  document.getElementById("btnPedir").disabled = count === 0;
}

document.getElementById("btnPedir").addEventListener("click", () => {
  const sel = seleccion();
  const total = sel.reduce((s, p) => s + p.precio * p.cant, 0);
  const lineas = sel.map((p) => `• ${p.cant} x ${p.nombre} — ${soles(p.precio * p.cant)}`);
  const msg = `¡Hola El Buen Sabor! Quiero hacer este pedido:\n\n${lineas.join("\n")}\n\n*Total: ${soles(total)}*`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
});

// Toggle plato del día (se recuerda en este navegador)
const toggle = document.getElementById("toggleDia");
const card = document.getElementById("diaCard");
const off = document.getElementById("diaOff");

function mostrarDia(on) {
  card.hidden = !on;
  off.hidden = on;
  if (!on && cantidades.dia) { cantidades.dia = 0; actualizar(); }
  try { localStorage.setItem("buenSabor_dia", on ? "1" : "0"); } catch (_) {}
}

try { toggle.checked = localStorage.getItem("buenSabor_dia") !== "0"; } catch (_) {}
mostrarDia(toggle.checked);
toggle.addEventListener("change", () => mostrarDia(toggle.checked));

// Si una imagen de Unsplash falla, usar Picsum
document.querySelectorAll("img").forEach((img, i) => {
  img.addEventListener("error", () => { img.src = `https://picsum.photos/seed/sabor${i}/1200/800`; }, { once: true });
});
