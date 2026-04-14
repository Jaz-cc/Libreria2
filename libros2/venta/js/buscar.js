const APILiB = "https://localhost:44367/api/libro";

// OBTENER USUARIO
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

async function buscarLibro() {
  const texto = document.getElementById("busqueda").value.toLowerCase();

  const token = localStorage.getItem("token");

  const res = await fetch(APILiB, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    alert("Sesión expirada, inicia sesión nuevamente");
    window.location.href = "./login.html";
    return;
  }
  const data = await res.json();

  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "";

  const filtrados = data.filter(libro =>
    (libro.Titulo && libro.Titulo.toLowerCase().includes(texto)) ||
    (libro.Autor && libro.Autor.toLowerCase().includes(texto))
  );

  if (filtrados.length === 0) {
    resultado.innerHTML = "<p>No se encontraron resultados</p>";
    return;
  }

  filtrados.forEach(libro => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h4>${libro.Titulo}</h4>
      <p>Autor: ${libro.Autor}</p>
      <p>Precio: $${libro.Precio}</p>
      <p>Stock: ${libro.Stock}</p>
      <img src="imagenes/${libro.Imagen}" width="120">
    `;

    resultado.appendChild(div);
  });
}
