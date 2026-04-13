// Configuracion EP API
const API_LIBROS = "https://localhost:44367/api/libro";
const API_CARRITO = "https://localhost:44367/api/carrito";

// obtener usuario
function obtenerUsuario() {
  return JSON.parse(localStorage.getItem("usuario"));
}

const adminBtn = document.getElementById("adminBtn");

const usuario = obtenerUsuario();
if (usuario.rol === "admin") {
  adminBtn.innerHTML = `<li class="nav-item"><a class="nav-link" href="altaLibro.html">Alta Libro</a></li>`;
}

// proteger acceso, verifica si hay una seccion activa
// si no hay usuario, redirige al login
function verificarSesion() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Debes iniciar sesión");
    window.location.href = "/login.html";
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
      // construcción del html de cada libro
      col.innerHTML = `
        <div class="card libro-card h-100">

          ${libro.Stock < 5 ? '<span class="badge bg-danger">POCAS PIEZAS</span>' : ''}

          <img src="imagenes/${libro.Imagen}" class="card-img-top">

          <div class="card-body d-flex flex-column">
            <h6>${libro.Titulo}</h6>
            <div class="precio">$${libro.Precio}</div>

            <p class="${libro.Stock > 0 ? 'text-success' : 'text-danger'}">
              ${libro.Stock > 0 ? "Stock: " + libro.Stock : "AGOTADO"}
            </p>

            <div class="mt-auto">

              <!-- comprar -->
              <button class="btn btn-success btn-sm w-100 mb-1"
                onclick="agregarAlCarrito(${libro.Id}, ${libro.Precio})"
                ${libro.Stock === 0 ? "disabled" : ""}>
                Comprar
              </button>

              <!-- solo admin -->
              ${user?.rol === "admin" ? `
                <button class="btn btn-danger btn-sm w-100"
                  onclick="eliminarLibro(${libro.Id})">
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

// grega libros al carrito del usuario actual
async function agregarAlCarrito(id, precio) {
  const usuario = obtenerUsuario();

  try {
    await fetch(API_CARRITO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        UserId: usuario.id,
        LibroId: id,
        Cantidad: 1,
        Precio: precio
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
  //validación de permisos
  if (!user || user.rol !== "admin") {
    alert("No tienes permisos");
    return;
  }
  //confrimacion del usuario
  if (!confirm("¿Eliminar este libro?")) return;

  try {
    await fetch(`${API_LIBROS}/${id}`, {
      method: "DELETE"
    });
    //recargar lista de libros
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