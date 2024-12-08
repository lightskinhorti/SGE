// Variables de estado globales
let tamanio = 1;
let cantidadcontraste = 30;
let invertido = false;
let contadorFuente = 0;
const fuentes = ['Sans-serif', 'serif', 'monospace', 'fantasy'];

// Crea el contenedor para los botones
let contenedor = document.createElement("div");
contenedor.classList.add("jvampliador");

// Función para crear botones de forma reutilizable
function crearBoton(texto, label, titulo, accion) {
    let boton = document.createElement("button");
    boton.textContent = texto;
    boton.setAttribute("aria-label", label);
    boton.setAttribute("title", titulo);
    boton.onclick = accion;
    contenedor.appendChild(boton);
    return boton;
}

// Botón para aumentar tamaño de fuente
crearBoton("+", "Ampliar", "Ampliar el tamaño de la letra", function () {
    tamanio *= 1.1;
    document.querySelector("body").style.fontSize = tamanio + "em";
});

// Botón para cambiar contraste
crearBoton("C", "Contraste", "Ajustar el contraste de la página", function () {
    document.querySelector("body").style.filter = "contrast(" + cantidadcontraste + ")";
});

// Botón para invertir colores
crearBoton("I", "Invertir", "Invertir los colores de la página", function () {
    if (!invertido) {
        document.querySelector("body").style.filter = "invert(1) hue-rotate(180deg)";
        invertido = true;
    } else {
        document.querySelector("body").style.filter = "invert(0) hue-rotate(0deg)";
        invertido = false;
    }
});

// Botón para cambiar fuente
crearBoton("F", "Cambiar la fuente", "Cambiar el tipo de fuente de la página", function () {
    document.querySelector("body").style.fontFamily = fuentes[contadorFuente];
    contadorFuente = (contadorFuente + 1) % fuentes.length;  // Rota entre las fuentes
});

// Botón para disminuir tamaño de fuente
crearBoton("-", "Disminuir", "Disminuir el tamaño de la letra", function () {
    tamanio *= 0.9;
    document.querySelector("body").style.fontSize = tamanio + "em";
});

// Agregar el contenedor de botones al cuerpo de la página
document.querySelector("body").appendChild(contenedor);
