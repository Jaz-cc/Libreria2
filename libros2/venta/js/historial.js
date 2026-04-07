const API = "";

// Cargar historial
async function cargarHistorial() {
  try {
    const res = await fetch(`${API}/ventas`);
    const data = await res.json();

    const lista = document.getElementById("listaHistorial");
    lista.innerHTML = "";

    if (data.length === 0) {
      lista.innerHTML = "<p>No hay compras registradas</p>";
      return;
    }

    data.forEach(venta => {
      const div = document.createElement("div");
      div.className = "card p-3 mb-3";

      div.innerHTML = `
        <h5>Orden #${venta.id}</h5>
        <p><strong>Cliente:</strong> ${venta.nombre}</p>
        <p><strong>Dirección:</strong> ${venta.direccion}</p>
        <p><strong>Total:</strong> $${venta.total}</p>
        <hr>
      `;

      lista.appendChild(div);
    });

  } catch (error) {
    console.error("Error al cargar historial:", error);
  }
}

// Iniciar
document.addEventListener("DOMContentLoaded", cargarHistorial);