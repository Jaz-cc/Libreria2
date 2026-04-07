const API = "";

async function login() {
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;
  const mensaje = document.getElementById("mensaje");

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ usuario, password })
    });

    if (!res.ok) {
      mensaje.innerText = "Credenciales incorrectas";
      return;
    }

    const data = await res.json();

    // guardar sesión
    localStorage.setItem("usuario", JSON.stringify(data));

    window.location.href = "catalogo.html";

  } catch (error) {
    mensaje.innerText = "Error del servidor";
  }
}