// Configuración API
const API = "https://localhost:44367/api/usuarios";

async function registro() {
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const mensaje = document.getElementById("mensaje");

    //Validación básica
    if (!usuario || !password || !email) {
        mensaje.innerText = "Todos los campos son obligatorios";
        return;
    }

    if (!email.includes("@")) {
        mensaje.innerText = "Email inválido";
        return;
    }

    try {
        const res = await fetch(`${API}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            Usuario: usuario, 
            Password: password,
            Rol: 'usuario',
            Email: email
        })
    });

    const data = await res.json();

    if (!res.ok) {
        mensaje.innerText = data.Message;
        return;
    }

    // éxito
    mensaje.innerText = "Registro exitoso";
    window.location.href = "login.html";

    } catch (error) {
        mensaje.innerText = "Error del servidor";
        console.error(error);
    }
}