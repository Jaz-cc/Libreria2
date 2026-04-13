// configuracio Api
const API = "https://localhost:44367/api/libro";

// Obtener usuario logueado
function obtenerUsuario() {
  return JSON.parse(localStorage.getItem("usuario"));
}

const adminBtn = document.getElementById("adminBtn");

const usuario = obtenerUsuario();
if (usuario.rol === "admin") {
  adminBtn.innerHTML = `<li class="nav-item"><a class="nav-link" href="altaLibro.html">Alta Libro</a></li>`;
}

// Consulta los libros desde el backend y los renderiza en el dom
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
          ${libro.Stock < 5 ? '<span class="badge bg-danger">POCAS PIEZAS</span>' : ''}

          <img src="imagenes/${libro.Imagen}" class="card-img-top">

          <div class="card-body">
            <h6>${libro.Titulo}</h6>
            <div class="precio">$${libro.Precio}</div>

            <p class="${libro.Stock > 0 ? 'text-success' : 'text-danger'}">
              ${libro.Stock > 0 ? "Piezas Disponibles: " + libro.Stock : "AGOTADO"}
            </p>

            <p><label>Cantidad</label>
            <input style="width:70px;" type="number" id="cantidad-${libro.Id}" value=1 min="1" max="5" required></p>
            
            <!-- botón comprar -->
            <button class="btn btn-success btn-sm mt-2"
              onclick="agregarAlCarrito(${libro.Id}, ${libro.Precio})">
              Comprar
            </button>

            <!-- solo admin -->
            ${user?.rol === "admin" ? `
              <button class="btn btn-danger btn-sm mt-2"
                onclick="eliminarLibro(${libro.Id})">
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

function generarIdCompra() {
  const usuario = obtenerUsuario();
  const hoy = new Date();
  const yyyy = hoy.getFullYear().toString();
  const mm = (hoy.getMonth() + 1).toString().padStart(2, "0");
  const dd = hoy.getDate().toString().padStart(2, "0");

  return parseInt(yyyy + mm + dd + usuario.id); // ejemplo: 20260408
}
// Agregar al carrito (backend)
async function agregarAlCarrito(id, precio) {
  const usuario = obtenerUsuario();
  const idCompra = generarIdCompra();

  const cantidadInput = document.getElementById(`cantidad-${id}`);
  const cantidad = Number(cantidadInput.value);

  

  try {
    await fetch(`https://localhost:44367/api/carrito`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        UserId: usuario.id,
        IdCompra: idCompra,
        LibroId: id,
        Cantidad: cantidad,
        Precio: precio
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

// Proteger acceso
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