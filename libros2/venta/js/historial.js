const API = "https://localhost:44367/api/historialcar";

function obtenerUsuario() {
  return JSON.parse(localStorage.getItem("usuario"));
}

function verificarSesion() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Debes iniciar sesión");
    window.location.href = "/login.html";
  }
}

const adminBtn = document.getElementById("adminBtn");

const usuario = obtenerUsuario();
if (usuario.rol === "admin") {
  adminBtn.innerHTML = `<li class="nav-item"><a class="nav-link" href="altaLibro.html">Alta Libro</a></li>`;
}

// Cargar historial
async function cargarHistorial() {
  const usuario = obtenerUsuario();

  try {
    const res = await fetch(`${API}/usuario/${usuario.id}`);
    const data = await res.json();

    const lista = document.getElementById("listaHistorial");
    lista.innerHTML = "";

    if (data.length === 0) {
      lista.innerHTML = "<p>No hay compras registradas</p>";
      return;
    }

    data.forEach(histo => {
      const div = document.createElement("div");
      div.className = "card p-3 mb-3";

      div.innerHTML = `
        <h5>Orden #${histo.Id}</h5>
        <p><strong>Cliente:</strong> ${histo.Usuario}</p>
        <p><strong>Fecha:</strong> ${histo.Fecha}</p>
        <p><strong>Titulo:</strong> ${histo.Titulo}</p>
        <p><strong>Cantidad:</strong> ${histo.Cantidad}</p>
        <p><strong>Precio:</strong> ${histo.Precio}</p>
        <p><strong>Total:</strong> $${histo.Total}</p>
        <hr>
      `;

      lista.appendChild(div);
    });

  } catch (error) {
    console.error("Error al cargar historial:", error);
  }
}

// Iniciar
document.addEventListener("DOMContentLoaded", () => {
  verificarSesion()
  cargarHistorial()
});