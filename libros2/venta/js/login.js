// Configuración API
const API = "https://localhost:44367/api/";

// Autentificación, obtiene credenciales desde el formulario, envia la peticion al back
// guarda la secion, redirige al catalogo si es existoso
async function login() {
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;
  const mensaje = document.getElementById("mensaje");

  try {
    //peticion al ep de autentificación
    const res = await fetch(`${API}/auth/login`, {
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

    //guardar token
    sessionStorage.setItem("token", data.token);

    // guardar sesión
    localStorage.setItem("usuario", JSON.stringify(data));

    //redireccion al catalogo
    window.location.href = "catalogo.html";

  } catch (error) {
    // error de red o del servidor
    mensaje.innerText = "Error del servidor";
  }
}