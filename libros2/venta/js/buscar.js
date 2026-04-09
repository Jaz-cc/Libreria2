const APILiB = "https://localhost:44367/api/libro";

async function buscarLibro() {
  const texto = document.getElementById("busqueda").value.toLowerCase();

  const res = await fetch(APILiB);
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