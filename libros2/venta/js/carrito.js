const API = "https://localhost:44367/api/carrito";
const APIV = "https://localhost:44367/api/ventas";
const APILI = "https://localhost:44367/api/libro";

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

// CARGAR CARRITO
async function cargarCarrito() {

  const usuario = obtenerUsuario();

  try {
    const res = await fetch(`${API}/usuario/${usuario.id}`);
    const data = await res.json();

    const lista = document.getElementById("listaCarrito");
    const totalDiv = document.getElementById("totalCarrito");

    if (!lista || !totalDiv) return;

    lista.innerHTML = "";
    let total = 0;

    data.forEach(item => {
      total += item.Precio * item.Cantidad;
      id = item.LibroId;

      const div = document.createElement("div");
      div.className = "card p-2 mb-2";

      div.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div class="row justify-content-start">
            <div class="col-6">
              <img src="imagenes/${item.Imagen}" width="80">
            </div>
            <div class="col-6">
              <strong>${item.Titulo}</strong><br>
              <span>$${item.Precio}</span><br>
              <input type="number" 
                id="cantidad-${item.Id}" 
                style="width:70px;"
                value="${item.Cantidad}"
                min="1"
                max="5"
                onchange="actualizarCantidad(${item.Id})">
              </div>
            </row>
          </div>

          <button class="btn btn-danger btn-sm"
            onclick="eliminarItem(${item.Id})">
            Eliminar
          </button>
        </div>
      `;

      lista.appendChild(div);
    });

    totalDiv.innerText = "$" + total;
    return {Id: id}

  } catch (error) {
    console.error("Error al cargar carrito:", error);
  }
}

// ACTUALIZAR CANTIDAD DE PRODUCTO
async function actualizarCantidad(id) {
  const usuario = obtenerUsuario();
  const input = document.getElementById(`cantidad-${id}`);
  const cantidad = Number(input.value);

  if (!cantidad || cantidad <= 0 || cantidad > 5) {
    alert("Cantidad inválida");
    return;
  }

  precio = 0
  try {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        UserId: usuario.id,
        LibroId: id,
        Cantidad: cantidad,
        Precio: precio
      })
    });

    alert("Cantidad actualizada");

  } catch (error) {
    console.error("Error:", error);
  }
}

// ELIMINAR PRODUCTO
async function eliminarItem(id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    cargarCarrito();

  } catch (error) {
    console.error("Error al eliminar:", error);
  }
}

// CARGAR RESUMEN (para pago.html)
async function cargarResumen() {
   try {
    const usuario = obtenerUsuario();

 
    const res = await fetch(`${API}/usuario/${usuario.id}`);
    const data = await res.json();

    const contenedor = document.getElementById("resumenPedido");
    const totalDiv = document.getElementById("totalPedido");

    if (!contenedor || !totalDiv) return;

    contenedor.innerHTML = "";
    let total = 0;

    data.forEach(item => {
      total += item.Precio * item.Cantidad;
      id = item.Id;
      cantidad = item.Cantidad

      contenedor.innerHTML += `
        <p>${item.Titulo} x${item.Cantidad} - $${item.Precio}</p>
      `;
    });

    totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;

    actualizarStock(id);
    return {
      total: total,
      cantidad: cantidad
    };
    
  } catch (error) {
    console.error("Error al cargar resumen:", error);
  }

}

//ID PARA COMPRA
function generarIdCompra() {
  const usuario = obtenerUsuario();
  const hoy = new Date();
  const yyyy = hoy.getFullYear().toString();
  const mm = (hoy.getMonth() + 1).toString().padStart(2, "0");
  const dd = hoy.getDate().toString().padStart(2, "0");

  return parseInt(yyyy + mm + dd + usuario.id); // ejemplo: 20260408
}

// REALIZAR COMPRA (BACKEND)
async function procesarCompra() {
  const usuario = obtenerUsuario();
  const compraId = generarIdCompra();

  try {  
    const resultado = await cargarResumen();
    const total = resultado.total;

    const nombre = document.getElementById("nombreCliente")?.value;
    const direccion = document.getElementById("direccionCliente")?.value;
    const tarjeta = document.getElementById("tarjetaCliente")?.value;
    const cvv = document.getElementById("cvvCliente")?.value;

    if (!nombre || !direccion || !tarjeta || !cvv) {
      alert("Completa todos los campos");
      return;
    }

    const res = await fetch(`${APIV}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        CompraId: compraId,
        UserId: usuario.id,
        Total: total
      })
    });


    const data = await res.json();
    // mostrar éxito
    const pantalla = document.getElementById("pantallaExito");
    const orden = document.getElementById("ordenGenerada");

    if (pantalla && orden) {
      orden.innerText = "Orden #" + data.CarritoId;
      pantalla.style.display = "flex";
    }

  } catch (error) {
    console.error("Error al pagar:", error);
  }

}

// VACIAR CARRITO COMPRA (BACKEND)
async function vaciarCarrito() {
  const usuario = obtenerUsuario();
  if (!usuario || !usuario.id) {
    alert("Usuario no válido");
    return;
  }

  try {
    // Llamamos a la API que elimina todos los items del carrito de este usuario
    const res = await fetch(`${API}/usuario/${usuario.id}`, {
      method: "DELETE"
    });
      
    if (!res.ok) throw new Error("No se pudo vaciar el carrito");

    await cargarCarrito();
    alert("Carrito vaciado ✅ y los registros se movieron al historial automáticamente");
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    alert("No se pudo vaciar el carrito");
  }
}

//OBTENER DATOS DE API LIBRO
async function ObtenDatosL() {
  const resulta = await cargarCarrito();
  const id = resulta.Id;

  fetch(`${APILI}/${id}`)
    .then(res => res.json())
    .then(data => {
        data.Stock
    })
    .catch(err => console.error(err));

    return Stock


}

// ACTUALIZAR STOCK (BACKEND)
async function actualizarStock(id) {
  const resul = await ObtenDatosL();
  const stock = resul.Stock;


  const resultado = await cargarResumen();
  const cantidad = resultado.cantidad;


  console.log(stock, cantidad)

  if (!cantidad || cantidad <= 0 || cantidad > 5) {
    alert("Cantidad inválida");
    return;
  }

  Nstock= stock - cantidad;
  console.log(Nstock)

  if (id == 0) {
    alert("No hay id");
    return;
  }
  try {
    await fetch(`${APILI}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Titulo: null,
        Autor: null,
        Precio: null,
        Stock: Nstock,
        Imagen: null,
      })
    });

    alert("Cantidad actualizada");

  } catch (error) {
    console.error("Error:", error);
  }
}

// CERRAR ÉXITO
async function cerrarExito() {
  await actualizarStock(id);
  window.location.href = "catalogo.html";
}

async function realizarCompra() {
  await procesarCompra();
  await vaciarCarrito();
}

// AUTO INICIO SEGÚN PÁGINA
document.addEventListener("DOMContentLoaded", () => {
  verificarSesion();
  cargarCarrito();   // carrito.html
  cargarResumen();   // pago.html
});
