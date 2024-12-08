function poblarMenuNavegacion(datos) {
    let menu = document.querySelector("nav ul");  // Selecciono el menú donde voy a poner las entradas dinámicas

    // Verificamos que los datos sean válidos
    if (!Array.isArray(datos) || datos.length === 0) {
        console.error("No se han recibido datos válidos para poblar el menú de navegación.");
        return;
    }

    datos.forEach(function (tabla) {  // Para cada una de las tablas que han venido de la base de datos
        let nombre_de_la_tabla = tabla['Tables_in_crimson'];  // Atrapo el nombre de la tabla que viene del fetch
        let comentario_tabla = tabla['Comentario'] || 'No hay comentario disponible';  // Obtengo el comentario, con valor predeterminado

        let elemento = document.createElement("li");  // Creo en memoria un nuevo elemento li
        elemento.textContent = nombre_de_la_tabla;  // A ese elemento li le pongo como texto el nombre de la tabla
        elemento.setAttribute("jvtooltip", `Haz click para cargar la información de la tabla ${nombre_de_la_tabla}`);
        elemento.setAttribute("comentario", comentario_tabla);

        // Evento de clic para cada elemento del menú
        elemento.onclick = function () {
            cargarTablaSeleccionada(this);
        };

        menu.appendChild(elemento);  // Lo añado al menú
    });
}

// Función para cargar la tabla seleccionada
function cargarTablaSeleccionada(elemento) {
    let texto = elemento.textContent;  // Atrapo el texto del elemento de navegación
    cargaDatosTabla(texto);  // Llamo a la función para cargar los datos de la tabla
    document.querySelector(".titulotabla h5").textContent = texto;  // Muestra el nombre de la tabla
    document.querySelector(".titulotabla p").textContent = elemento.getAttribute("comentario");  // Muestra el comentario

    // Elimina la clase "menuseleccionado" de todos los elementos del menú
    document.querySelectorAll("nav ul li").forEach(function (item) {
        item.classList.remove("menuseleccionado");
    });

    // Añade la clase "menuseleccionado" al elemento seleccionado
    elemento.classList.add("menuseleccionado");
}
