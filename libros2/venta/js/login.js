// Configuración API
const API = "https://localhost:44367/api/";

let timeout;

function resetTimer() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        localStorage.removeItem("token");
        alert("Sesión expirada");
        window.location.href = "/login";
    }, 15 * 60 * 1000);
}

document.onmousemove = resetTimer;
document.onkeypress = resetTimer;
window.onload = resetTimer;

// Autentificación, obtiene credenciales desde el formulario, envia la peticion al back
// guarda la secion, redirige al catalogo si es existoso
async function login() {
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;
  const mensaje = document.getElementById("mensaje");

  try {
    //peticion al ep de autentificación
    const res = await fetch(`${API}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ usuario, password })
    });
    //validacion de credenciales incorrectas
    if (!res.ok) {
      mensaje.innerText = "Credenciales incorrectas";
      return;
    }
    // respuesta del servidor, datos del usuario
    const data = await res.json();

    //GUARDA TOKEN Y USUARIO
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    console.log("Respuesta completa:", data);
    console.log("TOKEN:", data.token);
    console.log("USUARIO:", data.usuario);

    //redireccion al catalogo
    window.location.href = "catalogo.html";

  } catch (error) {
    // error de red o del servidor
    mensaje.innerText = "Error del servidor";
  }
}

function cerrarSesion() {
  // Eliminar datos de sesión
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");

  // Opcional: limpiar todo (si guardas más cosas)
  // localStorage.clear();

  // Redirigir al login
  window.location.href = "./login.html";
}