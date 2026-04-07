const API_LIBROS = "";
const API_CARRITO = "";

// obtener usuario
function obtenerUsuario() {
  return JSON.parse(localStorage.getItem("usuario"));
}

// proteger acceso
function verificarSesion() {
  const user = obtenerUsuario();
  if (!user) {
    window.location.href = "login.html";
  }
}

// cargar libros desde backend
async function cargarLibros() {
  try {
    const res = await fetch(API_LIBROS);
    const libros = await res.json();

    const contenedor = document.getElementById("contenedor-libros");
    contenedor.innerHTML = "";

    const user = obtenerUsuario();

    libros.forEach(libro => {
      const col = document.createElement("div");
      col.className = "col-md-3 col-sm-6";

      col.innerHTML = `
        <div class="card libro-card h-100">

          ${libro.stock < 5 ? '<span class="badge bg-danger">POCAS PIEZAS</span>' : ''}

          <img src="${libro.imagen}" class="card-img-top">

          <div class="card-body d-flex flex-column">
            <h6>${libro.titulo}</h6>
            <div class="precio">$${libro.precio}</div>

            <p class="${libro.stock > 0 ? 'text-success' : 'text-danger'}">
              ${libro.stock > 0 ? "Stock: " + libro.stock : "AGOTADO"}
            </p>

            <div class="mt-auto">

              <!-- comprar -->
              <button class="btn btn-success btn-sm w-100 mb-1"
                onclick="agregarAlCarrito(${libro.id})"
                ${libro.stock === 0 ? "disabled" : ""}>
                Comprar
              </button>

              <!-- solo admin -->
              ${user?.rol === "admin" ? `
                <button class="btn btn-danger btn-sm w-100"
                  onclick="eliminarLibro(${libro.id})">
                  Eliminar
                </button>
              ` : ""}

            </div>
          </div>
        </div>
      `;

      contenedor.appendChild(col);
    });

  } catch (error) {
    console.error("Error al cargar libros:", error);
  }
}

// gregar al carrito
async function agregarAlCarrito(id) {
  try {
    await fetch(API_CARRITO, {
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
    console.error("Error:", error);
  }
}

// eliminar libro (admin)
async function eliminarLibro(id) {
  const user = obtenerUsuario();

  if (!user || user.rol !== "admin") {
    alert("No tienes permisos");
    return;
  }

  if (!confirm("¿Eliminar este libro?")) return;

  try {
    await fetch(`${API_LIBROS}/${id}`, {
      method: "DELETE"
    });

    cargarLibros();

  } catch (error) {
    console.error("Error al eliminar:", error);
  }
}

// inicio
document.addEventListener("DOMContentLoaded", () => {
  verificarSesion();
  cargarLibros();
});