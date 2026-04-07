const API = "";

async function buscarLibro() {
  const texto = document.getElementById("busqueda").value.toLowerCase();

  const res = await fetch(API);
  const data = await res.json();

  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "";

  const filtrados = data.filter(libro =>
    libro.titulo.toLowerCase().includes(texto) ||
    libro.autor.toLowerCase().includes(texto)
  );

  if (filtrados.length === 0) {
    resultado.innerHTML = "<p>No se encontraron resultados</p>";
    return;
  }

  filtrados.forEach(libro => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h4>${libro.titulo}</h4>
      <p>${libro.autor}</p>
      <p>$${libro.precio}</p>
      <img src="imagenes/${libro.imagen}" width="120">
      <hr>
    `;

    resultado.appendChild(div);
  });
}