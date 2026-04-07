const API = "";

// CARGAR CARRITO
async function cargarCarrito() {
  try {
    const res = await fetch(`${API}/carrito`);
    const data = await res.json();

    const lista = document.getElementById("listaCarrito");
    const totalDiv = document.getElementById("totalCarrito");

    if (!lista || !totalDiv) return;

    lista.innerHTML = "";
    let total = 0;

    data.forEach(item => {
      total += item.precio * item.cantidad;

      const div = document.createElement("div");
      div.className = "card p-2 mb-2";

      div.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>${item.titulo}</strong><br>
            <small>Cantidad: ${item.cantidad}</small><br>
            <span>$${item.precio}</span>
          </div>

          <button class="btn btn-danger btn-sm"
            onclick="eliminarItem(${item.id})">
            Eliminar
          </button>
        </div>
      `;

      lista.appendChild(div);
    });

    totalDiv.innerText = "$" + total;

  } catch (error) {
    console.error("Error al cargar carrito:", error);
  }
}

// ELIMINAR PRODUCTO
async function eliminarItem(id) {
  try {
    await fetch(`${API}/carrito/${id}`, {
      method: "DELETE"
    });

    cargarCarrito();

  } catch (error) {
    console.error("Error al eliminar:", error);
  }
}

// CARGAR RESUMEN (para pago.html)
async function cargarResumen() {
  try {
    const res = await fetch(`${API}/carrito`);
    const data = await res.json();

    const contenedor = document.getElementById("resumenPedido");
    const totalDiv = document.getElementById("totalPedido");

    if (!contenedor || !totalDiv) return;

    contenedor.innerHTML = "";
    let total = 0;

    data.forEach(item => {
      total += item.precio * item.cantidad;

      contenedor.innerHTML += `
        <p>${item.titulo} x${item.cantidad} - $${item.precio}</p>
      `;
    });

    totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;

  } catch (error) {
    console.error("Error al cargar resumen:", error);
  }
}

// REALIZAR COMPRA (BACKEND)
async function realizarCompra() {
  try {
    const nombre = document.getElementById("nombreCliente")?.value;
    const direccion = document.getElementById("direccionCliente")?.value;
    const tarjeta = document.getElementById("tarjetaCliente")?.value;
    const cvv = document.getElementById("cvvCliente")?.value;

    if (!nombre || !direccion || !tarjeta || !cvv) {
      alert("Completa todos los campos");
      return;
    }

    const res = await fetch(`${API}/ventas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre,
        direccion,
        tarjeta,
        cvv
      })
    });

    const data = await res.json();

    // mostrar éxito
    const pantalla = document.getElementById("pantallaExito");
    const orden = document.getElementById("ordenGenerada");

    if (pantalla && orden) {
      orden.innerText = "Orden #" + data.id;
      pantalla.style.display = "flex";
    }

  } catch (error) {
    console.error("Error al pagar:", error);
  }
}

// CERRAR ÉXITO
function cerrarExito() {
  window.location.href = "catalogo.html";
}

// AUTO INICIO SEGÚN PÁGINA
document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();   // carrito.html
  cargarResumen();   // pago.html
});