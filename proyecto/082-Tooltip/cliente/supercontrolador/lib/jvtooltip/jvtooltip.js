// Crear el contenedor del tooltip
let jvtooltip = document.createElement("div");
jvtooltip.classList.add("jvtooltip");  // Se le añade una clase CSS para su estilo

// Agregar el contenedor del tooltip al cuerpo de la página
document.querySelector("body").appendChild(jvtooltip);

// Evento que se dispara cuando el ratón se mueve por la página
document.onmousemove = function(e) {
    // Posicionar el tooltip en las coordenadas del ratón
    jvtooltip.style.left = e.pageX + "px";  // Establece la posición horizontal
    jvtooltip.style.top = e.pageY + "px";   // Establece la posición vertical
};

// Evento que se dispara cuando el ratón entra en un elemento
document.onmouseover = function(event) {
    const element = event.target;  // Obtener el elemento sobre el que está el ratón

    // Verificar si el elemento tiene el atributo "jvtooltip" (atributo personalizado)
    if (element.hasAttribute("jvtooltip") && element.getAttribute("jvtooltip") !== "") {
        // Si el elemento tiene el atributo "jvtooltip", mostrar el tooltip con el texto correspondiente
        console.log("aqui!!!");
        jvtooltip.style.display = "block";  // Hacer visible el tooltip
        jvtooltip.textContent = element.getAttribute("jvtooltip");  // Establecer el contenido del tooltip con el valor del atributo
    } else {
        // Si el elemento no tiene el atributo "jvtooltip", ocultar el tooltip
        jvtooltip.style.display = "none";  // Hacer invisible el tooltip
    }
};
