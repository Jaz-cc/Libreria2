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

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API}/usuario/${usuario.id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      alert("Sesión expirada, inicia sesión nuevamente");
      window.location.href = "./login.html";
      return;
    }

    const data = await response.json();

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
  const token = localStorage.getItem("token");
  
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
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
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
  const token = localStorage.getItem("token");

  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    cargarCarrito();

  } catch (error) {
    console.error("Error al eliminar:", error);
  }
}

// CARGAR RESUMEN (para pago.html)
// async function cargarResumen() {
//    try {
//     const usuario = obtenerUsuario();
//     const token = localStorage.getItem("token");
 
//     const res = await fetch(`${API}/usuario/${usuario.id}`, {
//       headers: {
//         "Authorization": `Bearer ${token}` //token
//       }
//     });

//     const data = await res.json();

//     const contenedor = document.getElementById("resumenPedido");
//     const totalDiv = document.getElementById("totalPedido");

//     if (!contenedor || !totalDiv) return;

//     contenedor.innerHTML = "";
//     let total = 0;

//     data.forEach(item => {
//       total += item.Precio * item.Cantidad;
//       let id = [];
//       let cantidad = [];

//       contenedor.innerHTML += `
//         <p>${item.Titulo} x${item.Cantidad} - $${item.Precio}</p>
//       `;
//       id.push(item.LibroId);
//       cantidad.push(item.Cantidad);
//     });

//     totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;

//     for (let item of data) {
//       await actualizarStock(item.LibroId, item.Cantidad);
//     }

//     return {
//       total: total,
//       cantidad: cantidad
//     };
    
//   } catch (error) {
//     console.error("Error al cargar resumen:", error);
//   }

// }
async function cargarResumen() {
  try {
    const usuario = obtenerUsuario();
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/usuario/${usuario.id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    const contenedor = document.getElementById("resumenPedido");
    const totalDiv = document.getElementById("totalPedido");

    if (!contenedor || !totalDiv) return;

    contenedor.innerHTML = "";
    let total = 0;

    // solo UI
    data.forEach(item => {
      total += item.Precio * item.Cantidad;

      contenedor.innerHTML += `
        <p>${item.Titulo} x${item.Cantidad} - $${item.Precio}</p>
      `;
    });

    totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;

    // solo retorno de datos
    return {
      total,
      items: data
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

  return parseInt(yyyy + mm + dd + usuario.id); 
}

// REALIZAR COMPRA (BACKEND)
async function procesarCompra() {
  const usuario = obtenerUsuario();
  const token = localStorage.getItem("token");
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
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
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
  const token = localStorage.getItem("token");

  if (!usuario || !usuario.id) {
    alert("Usuario no válido");
    return;
  }

  try {
    // Llamamos a la API que elimina todos los items del carrito de este usuario
    const res = await fetch(`${API}/usuario/${usuario.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
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
async function ObtenDatosL(id) {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`https://localhost:44367/api/libro/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    // VALIDACIÓN CLAVE
    if (!response.ok) {
      console.error("Error HTTP:", response.status);
      return null;
    }

    const data = await response.json();

    if (!data) {
      console.error("Respuesta vacía");
      return null;
    }

    return data;

  } catch (error) {
    console.error("Error en ObtenDatosL:", error);
    return null;
  }
}

// ACTUALIZAR STOCK (BACKEND)
// async function actualizarStock(id) {
//   const token = localStorage.getItem("token");
//   const libro = await ObtenDatosL(id);
//   const resul = await ObtenDatosL();
//   const stock = resul.Stock;

//   // VALIDACIÓN 
//   if (!libro) {
//     console.error("Libro no válido");
//     return;
//   }

//   console.log("Libro:", libro);

//   // ya es seguro
//   const libroId = libro.Id;


//   const resultado = await cargarResumen();
//   const cantidad = resultado.cantidad;


//   console.log(stock, cantidad)

//   if (!cantidad || cantidad <= 0 || cantidad > 5) {
//     alert("Cantidad inválida");
//     return;
//   }

//   Nstock= stock - cantidad;
//   console.log(Nstock)

//   if (id == 0) {
//     alert("No hay id");
//     return;
//   }
//   try {
//     await fetch(`${APILI}/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify({
//         Titulo: null,
//         Autor: null,
//         Precio: null,
//         Stock: Nstock,
//         Imagen: null,
//       })
//     });

//     alert("Cantidad actualizada");

//   } catch (error) {
//     console.error("Error:", error);
//   }
// }
async function actualizarStock(libroId, cantidad) {
  const token = localStorage.getItem("token");

  const libro = await ObtenDatosL(libroId);

  if (!libro) return;

  const nuevoStock = libro.Stock - cantidad;

  await fetch(`${APILI}/${libroId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      Titulo: libro.Titulo,
      Autor: libro.Autor,
      Precio: libro.Precio,
      Stock: nuevoStock,
      Imagen: libro.Imagen
    })
  });
}

async function procesarStock(items) {
  for (let item of items) {
    await actualizarStock(item.LibroId, item.Cantidad);
  }
}

// CERRAR ÉXITO
async function cerrarExito() {
  window.location.href = "catalogo.html";
}

async function realizarCompra() {
  const resultado = await cargarResumen();

  if (!resultado || !resultado.items) return;

  await procesarCompra(resultado.total);   // 1. registrar venta
  await procesarStock(resultado.items);    // 2. descontar stock
  await vaciarCarrito();                   // 3. limpiar carrito

  alert("Compra realizada correctamente");
}

// AUTO INICIO SEGÚN PÁGINA
document.addEventListener("DOMContentLoaded", () => {
  verificarSesion();
  cargarCarrito();   // carrito.html
  cargarResumen();   // pago.html
});
