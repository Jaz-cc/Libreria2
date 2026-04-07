const API = "";

// Obtener usuario logueado
function obtenerUsuario() {
  return JSON.parse(localStorage.getItem("usuario"));
}

// Cargar libros desde backend
async function cargarLibros() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    const contenedor = document.getElementById("contenedor-libros");
    contenedor.innerHTML = "";

    const user = obtenerUsuario();

    data.forEach(libro => {
      const col = document.createElement("div");
      col.className = "col-md-3 col-sm-6";

      col.innerHTML = `
        <div class="card libro-card">
          ${libro.stock < 5 ? '<span class="badge bg-danger">POCAS PIEZAS</span>' : ''}

          <img src="${libro.imagen}" class="card-img-top">

          <div class="card-body">
            <h6>${libro.titulo}</h6>
            <div class="rating">⭐⭐⭐⭐⭐</div>
            <div class="precio">$${libro.precio}</div>

            <p class="${libro.stock > 0 ? 'text-success' : 'text-danger'}">
              ${libro.stock > 0 ? "Piezas Disponibles: " + libro.stock : "AGOTADO"}
            </p>

            <!-- botón comprar -->
            <button class="btn btn-success btn-sm mt-2"
              onclick="agregarAlCarrito(${libro.id})">
              Comprar
            </button>

            <!-- solo admin -->
            ${user?.rol === "admin" ? `
              <button class="btn btn-danger btn-sm mt-2"
                onclick="eliminarLibro(${libro.id})">
                Eliminar
              </button>
            ` : ""}
          </div>
        </div>
      `;

      contenedor.appendChild(col);
    });

  } catch (error) {
    console.error("Error al cargar libros:", error);
  }
}

// Agregar al carrito (backend)
async function agregarAlCarrito(id) {
  try {
    await fetch(`https://localhost:5001/api/carrito`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        libroId: id,
        cantidad: 1
      })
    });

    alert("Libro agregado al carrito");

  } catch (error) {
    console.error("Error al agregar:", error);
  }
}

// Eliminar libro (solo admin)
async function eliminarLibro(id) {
  const user = obtenerUsuario();

  if (!user || user.rol !== "admin") {
    alert("No tienes permiso");
    return;
  }

  if (!confirm("¿Eliminar este libro?")) return;

  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    cargarLibros();

  } catch (error) {
    console.error("Error al eliminar:", error);
  }
}

// Proteger acceso (opcional)
function verificarSesion() {
  const user = obtenerUsuario();

  if (!user) {
    window.location.href = "login.html";
  }
}

// INICIO
document.addEventListener("DOMContentLoaded", () => {
  verificarSesion();
  cargarLibros();
});