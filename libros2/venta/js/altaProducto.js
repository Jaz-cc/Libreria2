const APILI = "https://localhost:44367/api/libro";

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

function AddLibro() {

  if (!usuario || usuario.rol !== "admin") {
    alert("No tienes permiso");
    return;
  }

  const fileInput = document.getElementById("imagen");
  const file = fileInput.files[0];
  const imagen = file.name;

  const form = document.getElementById("formAltaProducto");

  // Evento submit
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Ahora sí definidas correctamente
    const titulo = document.getElementById("titulo").value;
    const autor = document.getElementById("autor").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const stock = parseInt(document.getElementById("stock").value);

    try {
      const response = await fetch(APILI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
          Titulo: titulo,
          Autor: autor,
          Precio: precio,
          Stock: stock,
          Imagen: imagen //La imagen solo se mostrara si la tiene en la carpeta de imagnes del lado del cliente
          //puesto que no se encunetran subidas al servidor
        })
      });


      if (!response.ok) {
        throw new Error("Error al guardar");
      }

      mostrarModal("Producto registrado correctamente");

      form.reset();
      preview.src = "/imagenes/default.png";

    } catch (error) {
      console.error("Error:", error);
      mostrarModal("Error al registrar el producto");
    }
  });
}

function mostrarModal(mensaje) {
    document.getElementById("textoModal").innerText = mensaje;
    document.getElementById("modalMensaje").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modalMensaje").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  verificarSesion();
  AddLibro();
});
